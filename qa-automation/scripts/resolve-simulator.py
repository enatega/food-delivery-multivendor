#!/usr/bin/env python3
"""Print the UDID of the simulator the nightly should drive.

`xcrun simctl list devices available` lists one entry per NAME PER RUNTIME, so
a plain name match plus `head -1` can pick "iPhone 17 Pro" on iOS 26.3 while
the booted device carrying the app is the 26.5 one. Shutting that device down
and reinstalling on another is a silent way to lose a night's run, so the
choice is made explicitly here:

  1. a booted device with the wanted name wins, so a run never migrates off the
     device somebody already prepared;
  2. otherwise the highest iOS runtime with that name.
"""
import json
import re
import subprocess
import sys


def runtime_key(identifier):
    # com.apple.CoreSimulator.SimRuntime.iOS-26-5 -> (26, 5)
    found = re.findall(r"(\d+)", identifier.rsplit(".", 1)[-1])
    return tuple(int(part) for part in found) if found else (0,)


def main():
    wanted = sys.argv[1] if len(sys.argv) > 1 else "iPhone 17 Pro"
    raw = subprocess.run(
        ["xcrun", "simctl", "list", "devices", "available", "--json"],
        capture_output=True, text=True, check=True,
    ).stdout
    devices = json.loads(raw)["devices"]

    matches = []
    for runtime, entries in devices.items():
        if "iOS" not in runtime:
            continue
        for entry in entries:
            if entry.get("name") == wanted and entry.get("isAvailable", True):
                matches.append((runtime, entry))

    if not matches:
        print(f"no available simulator named {wanted!r}", file=sys.stderr)
        return 1

    booted = [m for m in matches if m[1].get("state") == "Booted"]
    runtime, entry = (booted or sorted(matches, key=lambda m: runtime_key(m[0])))[-1]
    print(entry["udid"])
    return 0


if __name__ == "__main__":
    sys.exit(main())
