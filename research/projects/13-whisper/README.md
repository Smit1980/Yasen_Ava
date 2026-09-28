# 13 — Whisper

**Исходники:** https://github.com/openai/whisper

**Документация:** README, paper и model card в репозитории

**Лицензия:** MIT.

## Что это

Многоязычная модель распознавания речи и перевода. Текущий Ясень использует оптимизированный runtime
`faster-whisper`, а не оригинальный пакет напрямую.

## Роль в пилоте

- локальный privacy-friendly fallback;
- базовая точка качества распознавания русского языка;
- batch/offline режим при недоступности streaming-провайдера.

## Ограничение

Оригинальная batch-модель не решает full-duplex сама по себе. Для моментального общения нужны streaming transport,
incremental transcription, VAD и cancellation.

```powershell
.\scripts\clone-reference-projects.ps1 -Project whisper
```
