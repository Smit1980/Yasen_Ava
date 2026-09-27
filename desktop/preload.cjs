'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('yasenDesktop', {
  isDesktop: true,
  beginDrag() {
    ipcRenderer.send('yasen-drag-start');
  },
  dragBy(x, y) {
    ipcRenderer.send('yasen-drag-move', { x, y });
  },
  endDrag() {
    ipcRenderer.send('yasen-drag-end');
  },
  onCommand(callback) {
    if (typeof callback !== 'function') return () => {};
    const handler = (_event, command) => callback(command);
    ipcRenderer.on('yasen-command', handler);
    return () => ipcRenderer.removeListener('yasen-command', handler);
  },
});

ipcRenderer.on('yasen-interactive', (_event, interactive) => {
  const apply = () => {
    document.documentElement.classList.toggle('desktop-interactive', Boolean(interactive));
    document.documentElement.classList.toggle('desktop-passive', !interactive);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once: true });
  else apply();
});
