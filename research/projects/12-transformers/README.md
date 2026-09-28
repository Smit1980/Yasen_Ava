# 12 — Hugging Face Transformers

**Исходники:** https://github.com/huggingface/transformers

**Документация:** https://huggingface.co/docs/transformers

**Лицензия библиотеки:** Apache-2.0; лицензии моделей различаются.

## Что это

Крупная библиотека определений и runtime для text, vision, audio и multimodal моделей.

## Польза

- локальные STT/LLM/TTS модели при наличии подходящего hardware;
- единый API и model hub;
- эксперименты с квантованными моделями.

## Ограничение

Не добавлять библиотеку «на всякий случай»: она тяжёлая, а каждая модель имеет собственную лицензию и требования.
Для текущего STT уже используется более узкий `faster-whisper`.

```powershell
.\scripts\clone-reference-projects.ps1 -Project transformers
```
