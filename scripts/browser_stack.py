#!/usr/bin/env python3
"""Real migrated API stack for browser integration tests; no mock backend."""
import os
from pathlib import Path
import signal
import subprocess
import sys
import time
import urllib.request

root = Path(__file__).resolve().parent.parent
if not (root / '.env').exists():
    raise SystemExit('Run scripts/setup-development.sh --seed before browser integration tests.')
logs = root / '.cache/browser-stack'
logs.mkdir(parents=True, exist_ok=True)
children = []
files = []
def stop(*_):
    for process in reversed(children):
        if process.poll() is None:
            os.killpg(process.pid, signal.SIGTERM)
    for process in children:
        try:
            process.wait(timeout=10)
        except subprocess.TimeoutExpired:
            os.killpg(process.pid, signal.SIGKILL)
    for file in files:
        file.close()
signal.signal(signal.SIGTERM, lambda *_: sys.exit(0))
signal.signal(signal.SIGINT, lambda *_: sys.exit(0))
try:
    for name, project, port in [('auth', 'Authentication API/IBSRA.csproj', 5204), ('courses', 'Course Recommendations API/IBSRA&2.csproj', 5174), ('categories', 'Categories API/IBSRA&3.csproj', 5058)]:
        log = (logs / f'{name}.log').open('w');files.append(log)
        command = ['bash', '-c', 'set -a; source .env; set +a; exec dotnet run --no-build --configuration Release --no-launch-profile --project "$1"', '_', f'web/APIs/{project}']
        process = subprocess.Popen(command, cwd=root, env={**os.environ, 'ASPNETCORE_URLS': f'http://0.0.0.0:{port}'},
                                   stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
        children.append(process)
        deadline = time.monotonic() + 90
        while time.monotonic() < deadline:
            if process.poll() is not None:
                raise RuntimeError(f'{name} exited before readiness. See .cache/browser-stack/{name}.log.')
            try:
                with urllib.request.urlopen(f'http://127.0.0.1:{port}/health/ready', timeout=2) as response:
                    if response.status == 200:
                        break
            except (OSError, urllib.error.URLError):
                pass
            time.sleep(.4)
        else:
            raise RuntimeError(f'{name} did not become schema-ready within 90 seconds.')
    # Start browser-facing server only after every actual API is ready.
    web = subprocess.Popen(['npm', 'run', 'dev', '--', '--port', '5173', '--strictPort'], cwd=root / 'web', start_new_session=True)
    children.append(web)
    while all(process.poll() is None for process in children):
        time.sleep(.5)
    raise RuntimeError('An integration service exited unexpectedly.')
finally:
    stop()
