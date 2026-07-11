from __future__ import annotations

import os
import sys
import tempfile
from pathlib import Path


ENV_PATH = Path("/opt/personal-portfolio/.env")


def main() -> None:
    key = sys.stdin.read().strip()
    if not key.startswith("re_") or len(key) < 16 or "\n" in key:
        raise SystemExit("The supplied Resend key is not valid.")

    existing = ENV_PATH.read_text().splitlines() if ENV_PATH.exists() else []
    retained = [
        line for line in existing
        if not line.startswith(("RESEND_API_KEY=", "RESEND_FROM=", "SMTP_USER=", "SMTP_APP_PASSWORD="))
    ]
    retained.extend([
        f"RESEND_API_KEY={key}",
        'RESEND_FROM="Wilson Huang Portfolio <onboarding@resend.dev>"',
    ])

    stat = ENV_PATH.stat() if ENV_PATH.exists() else None
    with tempfile.NamedTemporaryFile("w", dir=ENV_PATH.parent, delete=False) as temporary:
        temporary.write("\n".join(retained) + "\n")
        temporary_path = Path(temporary.name)
    os.chmod(temporary_path, 0o640)
    if stat:
        os.chown(temporary_path, stat.st_uid, stat.st_gid)
    os.replace(temporary_path, ENV_PATH)
    print("Resend key installed securely.")


if __name__ == "__main__":
    main()
