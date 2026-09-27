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

module.exports = {
  SERVICE_URL,
  desktopUrl,
  existingPythonCandidates,
  isCompatibleService,
  pythonCandidates,
};
