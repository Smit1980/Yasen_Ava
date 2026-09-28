# 01 — APEX-UI

**Исходники:** https://github.com/RubenM1990/APEX-UI

**Демо:** https://apex-ui-xi.vercel.app

**Лицензия:** MIT для кода; название Apex и брендинг Reznikov Engineering исключены.

## Что это

Next.js 15 + React 19 интерфейс с orb, WebGL-фоном и reasoning graph. Репозиторий прямо предупреждает, что Apex
Humanoid и голосовой слой не входят в исходники.

## Что полезно Ясеню

- организация reasoning graph и карточек навыков;
- состояния idle/thinking/speaking;
- доступность и `prefers-reduced-motion`;
- референс композиции HUD.

## Что не переносить напрямую

- имя Apex, брендинг и визуальные обозначения Reznikov Engineering;
- ожидание, что репозиторий содержит humanoid или голосовой backend.

## Решение

Использовать как UI-референс. Если переносится MIT-код, сохранить copyright/license notices и переработать под бренд Ясень.

```powershell
.\scripts\clone-reference-projects.ps1 -Project apex-ui
```
