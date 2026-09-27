'use strict';

const fs = require('node:fs');
const path = require('node:path');

const SERVICE_URL = 'http://127.0.0.1:8780/';

function isCompatibleService(html) {
  if (typeof html !== 'string') return false;
  return /<meta\s+name=["']yasen-desktop-version["']\s+content=["']1["']\s*\/?>/i.test(html);
}

function pythonCandidates(root, env = process.env) {
  const candidates = [
    env.YASEN_PYTHON,
    path.join(root, '.venv', 'Scripts', 'python.exe'),
    path.join(root, 'venv', 'Scripts', 'python.exe'),
    'python',
    'py',
  ];
  return [...new Set(candidates.filter(Boolean))];
}

function existingPythonCandidates(root, env = process.env) {
  return pythonCandidates(root, env).filter((candidate) => {
    if (!path.isAbsolute(candidate)) return true;
    return fs.existsSync(candidate);
  });
}

function desktopUrl(base = SERVICE_URL, params = {}) {
  const url = new URL(base);
  url.searchParams.set('desktop', '1');
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
  }
  return url.toString();
}

function boundedMoveDelta(value, limit = 240) {
  const parsed = Math.trunc(Number(value));
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(-limit, Math.min(limit, parsed));
}

function movedBounds(bounds, dx, dy) {
  if (!bounds || !Number.isFinite(bounds.x) || !Number.isFinite(bounds.y)) return null;
  return {
    ...bounds,
    x: bounds.x + boundedMoveDelta(dx),
    y: bounds.y + boundedMoveDelta(dy),
  };
}

function centeredSquareBounds(workArea, preferredSide = 1120, margin = 64) {
  if (!workArea || !Number.isFinite(workArea.x) || !Number.isFinite(workArea.y)
    || !Number.isFinite(workArea.width) || !Number.isFinite(workArea.height)) return null;
  const availableWidth = workArea.width - margin;
  const availableHeight = workArea.height - margin;
  const side = Math.floor(Math.min(preferredSide, availableWidth, availableHeight));
  if (side < 1) return null;
  return {
    x: Math.round(workArea.x + (workArea.width - side) / 2),
    y: Math.round(workArea.y + (workArea.height - side) / 2),
    width: side,
    height: side,
  };
}

function avatarWindowSide(scale, contentSide = 820, padding = 80, minimum = 240) {
  const parsed = Number(scale);
  if (!Number.isFinite(parsed)) return null;
  return Math.max(minimum, Math.round(Math.max(0, parsed) * contentSide + padding));
}

function squareBoundsWithSide(bounds, side) {
  if (!bounds || !Number.isFinite(bounds.x) || !Number.isFinite(bounds.y)
    || !Number.isFinite(bounds.width) || !Number.isFinite(bounds.height)) return null;
  const parsedSide = Math.round(Number(side));
  if (!Number.isFinite(parsedSide) || parsedSide < 1) return null;
  return {
    x: Math.round(bounds.x + (bounds.width - parsedSide) / 2),
    y: Math.round(bounds.y + (bounds.height - parsedSide) / 2),
    width: parsedSide,
    height: parsedSide,
  };
}

module.exports = {
  SERVICE_URL,
  avatarWindowSide,
  boundedMoveDelta,
  centeredSquareBounds,
  desktopUrl,
  existingPythonCandidates,
  isCompatibleService,
  movedBounds,
  pythonCandidates,
  squareBoundsWithSide,
};
