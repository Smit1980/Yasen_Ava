# 10 — Botpress

**Исходники:** https://github.com/botpress/botpress

**Документация:** https://botpress.com/docs

**Лицензия текущего репозитория:** MIT.

## Что это

Текущий GitHub-репозиторий — open-source hub пакетов, integrations, interfaces, plugins и примеров для Botpress.
Он не равен исторической полностью self-hosted платформе Botpress v12.

## Польза

- примеры внешних интеграций;
- интерфейсы и плагины для bot workflows;
- референс инструментов и каналов.

## Решение

Не использовать как основу realtime-голоса. Возвращаться к нему, если конкретная интеграция экономит разработку,
проверив условия соответствующего облачного продукта.

```powershell
.\scripts\clone-reference-projects.ps1 -Project botpress
```
