# Первичные источники

Проверено 2026-09-28. Все ссылки ведут на официальный репозиторий, документацию или демо владельца проекта.

| Проект | Исходники | Документация / демо |
| --- | --- | --- |
| Ясень | локальный репозиторий, этот каталог | [README](../README.md) |
| APEX-UI | https://github.com/RubenM1990/APEX-UI | https://apex-ui-xi.vercel.app |
| Pipecat | https://github.com/pipecat-ai/pipecat | https://docs.pipecat.ai |
| LiveKit Agents | https://github.com/livekit/agents | https://docs.livekit.io/agents |
| OpenAI Realtime Agents | https://github.com/openai/openai-realtime-agents | https://developers.openai.com/api/docs/guides/realtime |
| Fay | https://github.com/xszyou/Fay | документация связана из README проекта |
| Vach | https://github.com/Hujiazeng/Vach | README проекта |
| OpenTalking | https://github.com/datascale-ai/opentalking | https://datascale-ai.github.io/opentalking |
| LiveTalking | https://github.com/lipku/LiveTalking | README и демо проекта |
| Rasa | https://github.com/RasaHQ/rasa | https://rasa.com/docs |
| Botpress | https://github.com/botpress/botpress | https://botpress.com/docs |
| ParlAI | https://github.com/facebookresearch/ParlAI | https://parl.ai |
| Transformers | https://github.com/huggingface/transformers | https://huggingface.co/docs/transformers |
| Whisper | https://github.com/openai/whisper | README, paper и model card в репозитории |

## Проверенные существенные факты

- APEX-UI содержит orb/reasoning graph, но не содержит Apex Humanoid или голосовой слой.
- Pipecat позиционируется как open-source framework для realtime voice и multimodal agents.
- LiveKit Agents даёт серверных realtime-участников и WebRTC-клиенты; модели требуют отдельной проверки лицензии.
- OpenTalking и LiveTalking содержат полноценные контуры цифрового человека, но их производительные локальные модели
  ориентированы на современные NVIDIA/CUDA GPU.
- Vach использует ветку `dev`, заявляет Ubuntu 18.04, PyTorch 1.12.1 и CUDA 11.3; явной лицензии нет.
- ParlAI находится в режиме read-only archive с 30 июля 2026 года.

Сведения могут измениться. Перед началом интеграции выполнить повторную проверку ссылок, веток и лицензий.
