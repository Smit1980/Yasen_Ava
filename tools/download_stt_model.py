"""Однократно загружает faster-whisper small в локальный кэш Hugging Face."""

from faster_whisper import WhisperModel


def main() -> None:
    WhisperModel("small", device="cpu", compute_type="int8")
    print("Модель faster-whisper small загружена и готова к офлайн-работе.")


if __name__ == "__main__":
    main()
