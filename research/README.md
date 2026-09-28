# База проектов для Ясеня

Актуализировано: 2026-09-28. Каталог отделяет факты из первичных источников от архитектурной рекомендации.

## Рекомендуемая сборка пилота

| Слой | Основной выбор | Резерв/сравнение |
| --- | --- | --- |
| Визуал | текущий Ясень | элементы reasoning graph из APEX-UI |
| Realtime-оркестрация | Pipecat + SmallWebRTC | LiveKit Agents |
| Речь | streaming STT/LLM/TTS | OpenAI Realtime speech-to-speech |
| Локальное STT | faster-whisper/Whisper | облачный streaming STT |
| Цифровой человек | частицы Ясеня | OpenTalking/LiveTalking только как исследование |
| Диалоговые сценарии | собственный агентный слой | Rasa для детерминированных процессов |

## Все блоки

### Текущая система

- [00 — Ясень](projects/00-yasen/README.md)

### Realtime-голос и транспорт

- [02 — Pipecat](projects/02-pipecat/README.md) — основной кандидат.
- [03 — LiveKit Agents](projects/03-livekit-agents/README.md) — альтернатива для удалённых клиентов и телефонии.
- [04 — OpenAI Realtime Agents](projects/04-openai-realtime-agents/README.md) — официальный пример, требует API.

### Визуальный интерфейс и цифровые люди

- [01 — APEX-UI](projects/01-apex-ui/README.md)
- [05 — Fay](projects/05-fay/README.md)
- [06 — Vach](projects/06-vach/README.md)
- [07 — OpenTalking](projects/07-opentalking/README.md)
- [08 — LiveTalking](projects/08-livetalking/README.md)

### Диалог и модели

- [09 — Rasa](projects/09-rasa/README.md)
- [10 — Botpress](projects/10-botpress/README.md)
- [11 — ParlAI](projects/11-parlai/README.md)
- [12 — Transformers](projects/12-transformers/README.md)

### Распознавание речи

- [13 — Whisper](projects/13-whisper/README.md)

## Форматы базы

- `project-catalog.json` — каноническая машиночитаемая база.
- `project-catalog.csv` — быстрый импорт в Excel/Google Sheets.
- `projects/*/README.md` — отдельная карточка каждого проекта.
- `SOURCES.md` — единый список первоисточников.
- `source-report/deep-research-report.md` — исходный документ пользователя без редакторских указаний.

## Работа с исходниками

Внешний код не вендорится. Скрипт помещает независимые Git-клоны в `reference-src/<slug>`; папка исключена из Git.

```powershell
.\scripts\clone-reference-projects.ps1 -List
.\scripts\clone-reference-projects.ps1 -Group pilot
.\scripts\clone-reference-projects.ps1 -Project apex-ui
```

Перед переносом кода из внешнего проекта прочитайте его лицензию на выбранном commit/tag. Статус лицензии в каталоге —
навигационная справка, не юридическое заключение.
