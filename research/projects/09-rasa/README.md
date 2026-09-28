# 09 — Rasa

**Исходники:** https://github.com/RasaHQ/rasa

**Документация:** https://rasa.com/docs

**Лицензия репозитория:** Apache-2.0.

## Что это

Зрелый Python framework для NLU, dialogue management и детерминированных conversational workflows. Не содержит
визуальный avatar renderer.

## Когда полезен Ясеню

- строгие бизнес-сценарии и формы;
- намерения, слоты и контролируемые переходы;
- интеграции, где генеративного LLM недостаточно.

## Почему не нужен в первом пилоте

Проблема пилота — latency, streaming и interruption, а не отсутствие NLU-фреймворка. Добавление Rasa увеличит стек,
не устранив задержку речи.

```powershell
.\scripts\clone-reference-projects.ps1 -Project rasa
```
