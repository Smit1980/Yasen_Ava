# 02 — Pipecat

**Исходники:** https://github.com/pipecat-ai/pipecat

**Документация:** https://docs.pipecat.ai

**Лицензия:** BSD-2-Clause.

## Что это

Python-фреймворк для realtime voice/multimodal agents: транспорты, audio frames, STT/LLM/TTS, speech-to-speech,
метрики, прерывания и оркестрация.

## Роль в пилоте

Основной открытый кандидат на серверный voice pipeline. Для локального desktop/browser-клиента начать с WebRTC/
SmallWebRTC, а не с пересылки готовых WAV-файлов.

## Интеграционный контракт

- вход: поток аудио с VAD-событиями;
- выход: поток PCM/Opus, частичные субтитры, состояние и метрики;
- отмена: interrupt/cancel немедленно останавливает TTS и playback;
- память и тяжёлые инструменты выполняются вне latency-critical path.

## Решение

Включить в первый технический спринт и сравнить с прямым Realtime API на общей таблице задержек.

```powershell
.\scripts\clone-reference-projects.ps1 -Project pipecat
```
