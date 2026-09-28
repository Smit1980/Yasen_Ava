# 04 — OpenAI Realtime Agents

**Исходники примера:** https://github.com/openai/openai-realtime-agents

**Официальная документация:** https://developers.openai.com/api/docs/guides/realtime

**Лицензия примера:** MIT. **Сервис:** внешний API с отдельными условиями и оплатой.

## Что это

Официальный пример низколатентного streaming-диалога, handoff между агентами, guardrails и инструментов поверх Realtime
API и Agents SDK.

## Роль в пилоте

Эталонная ветка speech-to-speech для измерения естественности, задержки и перебиваний. Не считать её open-source
заменой самому hosted API.

## Безопасность

- постоянный API-ключ остаётся в локальном Python-мосте;
- renderer получает только короткоживущую сессию;
- инструменты, изменяющие внешний мир, требуют подтверждения;
- логирование аудио и транскриптов выключено по умолчанию.

```powershell
.\scripts\clone-reference-projects.ps1 -Project openai-realtime-agents
```
