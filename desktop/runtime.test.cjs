'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const { desktopUrl, isCompatibleService, pythonCandidates } = require('./runtime.cjs');

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
