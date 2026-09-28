# 08 — LiveTalking

**Исходники:** https://github.com/lipku/LiveTalking

**Документация и демо:** официальный README

**Лицензия:** Apache-2.0 для framework-кода; модели имеют собственные требования и лицензии.

## Что это

Realtime streaming digital human с несколькими avatar-моделями, voice cloning, interruption, WebRTC/RTMP, несколькими
сессиями и API для внешнего frontend.

## Что изучить

- barge-in для talking avatar;
- WebRTC audio/video output;
- разделение LLM, TTS и renderer;
- API управления состоянием и проигрыванием.

## Ограничение пилота

Рекомендуемые проектом модели используют CUDA и GPU уровня RTX 3060/3080 Ti и выше в зависимости от backend.
Текущая RX 580 4 ГБ не является целевой конфигурацией.

```powershell
.\scripts\clone-reference-projects.ps1 -Project livetalking
```
