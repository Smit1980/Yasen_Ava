'use strict';

const { app, BrowserWindow, globalShortcut, ipcMain, Menu, nativeImage, screen, session, Tray } = require('electron');
const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { desktopUrl, existingPythonCandidates, isCompatibleService, movedBounds, SERVICE_URL } = require('./runtime.cjs');

const ROOT = path.resolve(__dirname, '..');
const RUNTIME_ROOT = path.join(ROOT, '.runtime');
const USER_DATA_ROOT = path.join(RUNTIME_ROOT, 'user-data');
const SESSION_DATA_ROOT = path.join(RUNTIME_ROOT, 'session-data');
fs.mkdirSync(USER_DATA_ROOT, { recursive: true });
fs.mkdirSync(SESSION_DATA_ROOT, { recursive: true });
app.setName('Yasen_Ava');
app.setPath('userData', USER_DATA_ROOT);
app.setPath('sessionData', SESSION_DATA_ROOT);

const SMOKE_TEST = process.argv.includes('--smoke-test');
const CAPTURE_PATH = process.env.YASEN_CAPTURE_PATH || path.join(app.getPath('temp'), 'yasen-ava-smoke.png');
const MAX_START_ATTEMPTS = 3;

let mainWindow = null;
let tray = null;
let ownedBridge = null;
let interactive = false;
let dragCapture = false;
let quitting = false;
let startAttempts = 0;
let bridgeMonitor = null;
let bridgeRecovering = false;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchText(url, timeoutMs = 1500) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, { timeout: timeoutMs }, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => resolve({ statusCode: response.statusCode || 0, body }));
    });
    request.on('timeout', () => request.destroy(new Error('timeout')));
    request.on('error', reject);
  });
}

async function bridgeStatus() {
  try {
    const response = await fetchText(SERVICE_URL);
    if (response.statusCode !== 200) return 'unavailable';
    return isCompatibleService(response.body) ? 'current' : 'conflict';
  } catch {
    return 'unavailable';
  }
}

function spawnBridge() {
  const candidates = existingPythonCandidates(ROOT);
  if (!candidates.length) throw new Error('Python 3.10+ не найден');

  let lastError = null;
  for (const command of candidates) {
    const args = command.toLowerCase().endsWith('py')
      ? ['-3', '-B', path.join('bridge', 'server.py'), '--no-browser']
      : ['-B', path.join('bridge', 'server.py'), '--no-browser'];
    try {
      const child = spawn(command, args, {
        cwd: ROOT,
        env: { ...process.env, PYTHONUTF8: '1' },
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      child.stdout.on('data', (chunk) => process.stdout.write(`[bridge] ${chunk}`));
      child.stderr.on('data', (chunk) => process.stderr.write(`[bridge] ${chunk}`));
      child.once('error', (error) => { lastError = error; });
      ownedBridge = child;
      return child;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('Не удалось запустить Python-мост');
}

async function ensureBridge() {
  const initialStatus = await bridgeStatus();
  if (initialStatus === 'current') return { reused: true };
  if (initialStatus === 'conflict') {
    throw new Error('Порт 8780 занят другим или устаревшим сервисом. Закройте прежний Voice Orb и повторите запуск.');
  }
  startAttempts += 1;
  spawnBridge();
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (await bridgeStatus() === 'current') return { reused: false };
    if (ownedBridge && ownedBridge.exitCode !== null) break;
    await delay(250);
  }
  if (startAttempts < MAX_START_ATTEMPTS) {
    stopOwnedBridge();
    await delay(300);
    return ensureBridge();
  }
  throw new Error('Локальный сервис Ясеня не ответил на 127.0.0.1:8780');
}

function monitorBridge() {
  clearInterval(bridgeMonitor);
  bridgeMonitor = setInterval(async () => {
    if (quitting || bridgeRecovering) return;
    const status = await bridgeStatus();
    if (status !== 'unavailable') return;
    bridgeRecovering = true;
    startAttempts = 0;
    try {
      stopOwnedBridge();
      await ensureBridge();
      if (mainWindow && !mainWindow.isDestroyed()) mainWindow.reload();
    } catch (error) {
      process.stderr.write(`Yasen_Ava bridge recovery: ${error.message}\n`);
    } finally {
      bridgeRecovering = false;
    }
  }, 10000);
  bridgeMonitor.unref?.();
}

function stopOwnedBridge() {
  if (!ownedBridge || !ownedBridge.pid || ownedBridge.exitCode !== null) {
    ownedBridge = null;
    return;
  }
  const pid = ownedBridge.pid;
  ownedBridge = null;
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
  } else {
    try { process.kill(-pid, 'SIGTERM'); } catch { /* already stopped */ }
  }
}

function trayIcon() {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="13" fill="#071426" stroke="#43bfff" stroke-width="2"/><circle cx="11" cy="14" r="2" fill="#bff5ff"/><circle cx="21" cy="14" r="2" fill="#bff5ff"/><path d="M10 21 Q16 25 22 21" fill="none" stroke="#ffad4a" stroke-width="2"/></svg>';
  return nativeImage.createFromDataURL(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`).resize({ width: 16, height: 16 });
}

function send(command) {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('yasen-command', command);
}

function applyMouseMode() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  const capturesMouse = interactive || dragCapture;
  mainWindow.setIgnoreMouseEvents(!capturesMouse, { forward: !capturesMouse });
  mainWindow.setFocusable(interactive);
}

function isMainRenderer(event) {
  return Boolean(mainWindow && !mainWindow.isDestroyed() && event.sender === mainWindow.webContents);
}

ipcMain.on('yasen-drag-start', (event) => {
  if (!isMainRenderer(event)) return;
  dragCapture = true;
  applyMouseMode();
});

ipcMain.on('yasen-drag-move', (event, delta) => {
  if (!isMainRenderer(event) || !dragCapture || !mainWindow) return;
  const next = movedBounds(mainWindow.getBounds(), delta?.x, delta?.y);
  if (next) mainWindow.setBounds(next);
});

ipcMain.on('yasen-drag-end', (event) => {
  if (!isMainRenderer(event)) return;
  dragCapture = false;
  applyMouseMode();
});

function setInteractive(value) {
  interactive = Boolean(value);
  if (!mainWindow || mainWindow.isDestroyed()) return;
  applyMouseMode();
  if (interactive) {
    mainWindow.show();
    mainWindow.focus();
  }
  mainWindow.webContents.send('yasen-interactive', interactive);
  rebuildTrayMenu();
}

function toggleVisible() {
  if (!mainWindow) return;
  if (mainWindow.isVisible()) mainWindow.hide();
  else mainWindow.showInactive();
  rebuildTrayMenu();
}

function setAutostart(value) {
  app.setLoginItemSettings({ openAtLogin: Boolean(value), path: process.execPath, args: [ROOT] });
  rebuildTrayMenu();
}

function rebuildTrayMenu() {
  if (!tray) return;
  const visible = Boolean(mainWindow && mainWindow.isVisible());
  const login = app.getLoginItemSettings().openAtLogin;
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: visible ? 'Скрыть Ясеня' : 'Показать Ясеня', click: toggleVisible },
    { label: 'Режим управления', type: 'checkbox', checked: interactive, click: (item) => setInteractive(item.checked) },
    { label: 'Слушать / остановить диалог', click: () => send('toggle-dialog') },
    { label: 'Пересобрать образ', click: () => send('replay-intro') },
    {
      label: 'Масштаб образа',
      submenu: [
        { label: 'Увеличить на 10%', click: () => send('scale-up') },
        { label: 'Уменьшить на 10%', click: () => send('scale-down') },
        { label: 'Вернуть 100%', click: () => send('scale-reset') },
      ],
    },
    { type: 'separator' },
    { label: 'Запускать с Windows', type: 'checkbox', checked: login, click: (item) => setAutostart(item.checked) },
    { label: 'Перезапустить интерфейс', click: () => mainWindow && mainWindow.reload() },
    { type: 'separator' },
    { label: 'Выйти', click: () => { quitting = true; app.quit(); } },
  ]));
}

async function createWindow() {
  const bounds = screen.getPrimaryDisplay().bounds;
  mainWindow = new BrowserWindow({
    ...bounds,
    transparent: true,
    frame: false,
    resizable: false,
    movable: false,
    show: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    backgroundColor: '#00000000',
    focusable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  applyMouseMode();
  mainWindow.on('close', (event) => {
    if (!quitting && !SMOKE_TEST) {
      event.preventDefault();
      mainWindow.hide();
      rebuildTrayMenu();
    }
  });
  mainWindow.webContents.on('did-finish-load', () => {
    dragCapture = false;
    applyMouseMode();
    mainWindow.webContents.send('yasen-interactive', interactive);
  });
  await mainWindow.loadURL(desktopUrl(SERVICE_URL));

  if (SMOKE_TEST) {
    mainWindow.showInactive();
    await delay(9500);
    const initialScale = await mainWindow.webContents.executeJavaScript('window.orb?.getAvatarScale?.() || 1');
    await mainWindow.webContents.executeJavaScript('window.orb?.setAvatarScale?.(1, false)');
    send('scale-up');
    await delay(150);
    const scaleControl = await mainWindow.webContents.executeJavaScript('window.orb?.getAvatarScale?.() || null');
    await mainWindow.webContents.executeJavaScript(`window.orb?.setAvatarScale?.(${JSON.stringify(initialScale)}, false)`);
    const beforeDrag = mainWindow.getBounds();
    await mainWindow.webContents.executeJavaScript('window.yasenDesktop?.beginDrag?.(); window.yasenDesktop?.dragBy?.(13, -9);');
    await delay(150);
    const afterDrag = mainWindow.getBounds();
    await mainWindow.webContents.executeJavaScript('window.yasenDesktop?.endDrag?.()');
    mainWindow.setBounds(beforeDrag);
    const profile = await mainWindow.webContents.executeJavaScript(`({
      voice: window.orb?.audio?.voice || null,
      desktopOverlay: document.documentElement.classList.contains('desktop-overlay'),
      passive: document.documentElement.classList.contains('desktop-passive'),
      avatarScale: window.orb?.getAvatarScale?.() || null,
      scaleControl: ${JSON.stringify(scaleControl)},
      dragMove: ${JSON.stringify({ x: afterDrag.x - beforeDrag.x, y: afterDrag.y - beforeDrag.y })},
      status: document.getElementById('status')?.textContent || ''
    })`);
    const image = await mainWindow.webContents.capturePage();
    fs.writeFileSync(CAPTURE_PATH, image.toPNG());
    process.stdout.write(`${JSON.stringify({ ok: true, capture: CAPTURE_PATH, size: image.getSize(), profile })}\n`);
    quitting = true;
    app.quit();
    return;
  }

  mainWindow.showInactive();
  tray = new Tray(trayIcon());
  tray.setToolTip('Ясень — голосовой аватар');
  tray.on('double-click', () => setInteractive(!interactive));
  rebuildTrayMenu();
}

function registerShortcuts() {
  globalShortcut.register('CommandOrControl+Alt+J', () => setInteractive(!interactive));
  globalShortcut.register('CommandOrControl+Alt+V', () => send('toggle-dialog'));
  globalShortcut.register('CommandOrControl+Alt+H', toggleVisible);
  globalShortcut.register('CommandOrControl+Alt+Up', () => send('scale-up'));
  globalShortcut.register('CommandOrControl+Alt+Down', () => send('scale-down'));
  globalShortcut.register('CommandOrControl+Alt+0', () => send('scale-reset'));
}

const hasSingleInstanceLock = app.requestSingleInstanceLock();
if (!hasSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      mainWindow.showInactive();
      setInteractive(true);
    }
  });

  app.whenReady().then(async () => {
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
      try {
        const origin = new URL(webContents.getURL()).origin;
        callback(origin === 'http://127.0.0.1:8780' && permission === 'media');
      } catch {
        callback(false);
      }
    });
    await ensureBridge();
    monitorBridge();
    registerShortcuts();
    await createWindow();
  }).catch((error) => {
    process.stderr.write(`Yasen_Ava: ${error.stack || error.message}\n`);
    quitting = true;
    stopOwnedBridge();
    app.exit(1);
  });
}

app.on('before-quit', () => {
  quitting = true;
  clearInterval(bridgeMonitor);
  globalShortcut.unregisterAll();
  stopOwnedBridge();
});

app.on('window-all-closed', () => {
  if (SMOKE_TEST || process.platform !== 'darwin') app.quit();
});
