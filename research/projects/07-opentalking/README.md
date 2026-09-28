# 07 — OpenTalking

**Исходники:** https://github.com/datascale-ai/opentalking

**Документация:** https://datascale-ai.github.io/opentalking

**Лицензия:** Apache-2.0 для framework-кода; модели и ассеты проверяются отдельно.

## Что это

Полный realtime digital-human pipeline: frontend, session state, LLM, STT, TTS, прерывания, субтитры, WebRTC,
локальные и удалённые model backends.

## Что полезно

- эталон границ между voice pipeline и avatar backend;
- контракт событий прерывания и субтитров;
- mock-режим для тестирования без тяжёлой модели;
- схема переключаемых локальных/облачных компонентов.

## Ограничение пилота

Высококачественные talking-head backends рассчитаны на современную NVIDIA/CUDA GPU. На текущей RX 580 использовать
архитектурные идеи и mock/удалённый backend, но не заменять частичный аватар Ясеня локальным neural renderer.

```powershell
.\scripts\clone-reference-projects.ps1 -Project opentalking
```
