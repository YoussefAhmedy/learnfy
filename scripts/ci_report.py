#!/usr/bin/env python3
"""Expose test diagnostics and small, non-secret generated files via GitHub Checks.

Artifact/log downloads are inaccessible in some sandboxes. This is an additional
reporting channel, not a substitute for test exit codes or normal artifacts.
"""
import base64
import gzip
import json
import os
from pathlib import Path
import sys
import urllib.request
import xml.etree.ElementTree as ET

kind, status = sys.argv[1:3]
root = Path(os.environ.get("GITHUB_WORKSPACE", str(Path.cwd())))
failures = []
summary = []
if kind == "mobile":
    report = root / "mobile/test-results.jsonl"
    passed = failed = 0
    if report.exists():
        for line in report.read_text().splitlines():
            try:
                event = json.loads(line)
            except json.JSONDecodeError:
                continue
            if not isinstance(event, dict):
                continue
            if event.get("type") == "error":
                failures.append(str(event.get("error", "")) + "\n" + str(event.get("stackTrace", "")))
            if event.get("type") == "testDone" and not event.get("hidden", False):
                if event.get("result") == "success":
                    passed += 1
                else:
                    failed += 1
        summary.append(f"Mobile tests: {passed} passed; {failed} failed.")
    else:
        summary.append("Mobile test report was not generated; inspect prior job steps.")
    allowed_files = [root / "mobile/pubspec.lock"]
elif kind == "backend":
    for report in (root / "TestResults").glob("*.trx"):
        tree = ET.parse(report)
        ns = {"t": "http://microsoft.com/schemas/VisualStudio/TeamTest/2010"}
        counts = tree.find(".//t:Counters", ns)
        if counts is not None:
            summary.append("Backend tests: " + json.dumps(counts.attrib, sort_keys=True))
        for error in tree.findall(".//t:ErrorInfo", ns):
            failures.append("\n".join(node.text or "" for node in error))
    allowed_files = list((root / "web/APIs").glob("*/packages.lock.json"))
else:
    raise ValueError("Unknown report kind")

files = {str(path.relative_to(root)): path.read_text() for path in allowed_files if path.is_file()}
encoded = base64.b64encode(gzip.compress(json.dumps(files).encode(), mtime=0)).decode()
text = ("\n\n".join(failures).encode("utf-8", errors="replace")[:20000].decode("utf-8", errors="replace") or "No test failure details recorded.")
text += f"\n\n<!-- learnfy-ci-files:v1:{encoded} -->"
if len(text.encode()) > 65000:
    raise ValueError("Check report too large; do not silently truncate generated files")
payload = {
    "name": f"Learnfy {kind} test report", "head_sha": os.environ["GITHUB_SHA"],
    "status": "completed", "conclusion": "success" if status == "success" and not failures else "failure",
    "output": {"title": f"{kind.title()} validation", "summary": "\n\n".join(summary) or f"Job status: {status}", "text": text},
}
request = urllib.request.Request(
    f'https://api.github.com/repos/{os.environ["GITHUB_REPOSITORY"]}/check-runs',
    data=json.dumps(payload).encode(), method="POST",
    headers={"Authorization": f'Bearer {os.environ["GH_TOKEN"]}', "Accept": "application/vnd.github+json", "Content-Type": "application/json", "X-GitHub-Api-Version": "2022-11-28"},
)
try:
    with urllib.request.urlopen(request, timeout=30) as response:
        result = json.load(response)
except Exception as error:
    # Explicit annotation is accessible even if Check creation fails. Never print headers/token.
    message = f"{type(error).__name__}: {error}".replace("%", "%25").replace("\n", "%0A").replace("\r", "%0D")
    print(f"::error file=scripts/ci_report.py,title=CI report publishing failed::{message}")
    raise
print("\n".join(summary))
print(f'Published {kind} test report: {result["html_url"]}')
