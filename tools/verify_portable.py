"""Проверяет, что визуал, мимика и голосовые эффекты Yasen_Ava не изменились."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "PORTABLE_MANIFEST.json"


def normalized_bytes(path: Path, mode: str) -> bytes:
    if mode == "binary":
        return path.read_bytes()
    if mode == "text-lf":
        text = path.read_text(encoding="utf-8")
        return text.replace("\r\n", "\n").replace("\r", "\n").encode("utf-8")
    raise ValueError(f"Неизвестный режим хеширования: {mode}")


def main() -> int:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    failed = []
    for relative, meta in manifest["files"].items():
        path = (ROOT / relative).resolve()
        if ROOT.resolve() not in path.parents:
            failed.append(f"опасный путь: {relative}")
            continue
        if not path.is_file():
            failed.append(f"нет файла: {relative}")
            continue
        actual = hashlib.sha256(normalized_bytes(path, meta["mode"])).hexdigest()
        if actual != meta["sha256"]:
            failed.append(f"изменён: {relative}\n  ожидался {meta['sha256']}\n  получен  {actual}")

    if failed:
        print("Проверка Yasen_Ava: ОШИБКА")
        print("\n".join(failed))
        return 1
    print(f"Проверка Yasen_Ava: OK ({len(manifest['files'])} файлов)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
