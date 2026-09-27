'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const {
  boundedMoveDelta,
  centeredSquareBounds,
  desktopUrl,
  isCompatibleService,
  movedBounds,
  pythonCandidates,
} = require('./runtime.cjs');

test('recognizes only a Yasen/Voice Orb page', () => {
  assert.equal(isCompatibleService('<meta name="yasen-desktop-version" content="1">'), true);
  assert.equal(isCompatibleService("<meta name='yasen-desktop-version' content='1'/>"), true);
  assert.equal(isCompatibleService('<title>Voice Orb — визуал голоса ИИ-агента</title>'), false);
  assert.equal(isCompatibleService('<h1>another local app</h1>'), false);
});

test('desktop URL always enables overlay mode and preserves tuning', () => {
  const value = new URL(desktopUrl('http://127.0.0.1:8780/', { points: 200000, intro: 0 }));
  assert.equal(value.hostname, '127.0.0.1');
  assert.equal(value.searchParams.get('desktop'), '1');
  assert.equal(value.searchParams.get('points'), '200000');
  assert.equal(value.searchParams.get('intro'), '0');
});

test('custom Python takes priority and candidates stay unique', () => {
  const root = path.join('C:', 'Yasen_Ava');
  const list = pythonCandidates(root, { YASEN_PYTHON: 'C:\\Python\\python.exe' });
  assert.equal(list[0], 'C:\\Python\\python.exe');
  assert.equal(new Set(list).size, list.length);
});

test('drag movement preserves window size and rejects unsafe deltas', () => {
  const moved = movedBounds({ x: 100, y: 200, width: 1920, height: 1080 }, 18.8, -31.2);
  assert.deepEqual(moved, { x: 118, y: 169, width: 1920, height: 1080 });
  assert.equal(boundedMoveDelta(9999), 240);
  assert.equal(boundedMoveDelta('not-a-number'), 0);
});

test('avatar frame is a centered square inside the usable display area', () => {
  const bounds = centeredSquareBounds({ x: 0, y: 0, width: 1920, height: 1080 });
  assert.deepEqual(bounds, { x: 452, y: 32, width: 1016, height: 1016 });
});
