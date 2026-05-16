#!/usr/bin/env python3
"""
Fetches the intermediate certificate chain for student.psu.ru and writes it
to assets/certs/intermediate_cert, following the AIA chain until reaching
a self-signed root.
"""
import re
import ssl
import subprocess
import sys
import urllib.request
from pathlib import Path

HOST = "student.psu.ru"
OUTPUT_FILE = Path("assets/certs/intermediate_cert")


def run_openssl(*args, input_data: bytes = b"") -> str:
    result = subprocess.run(
        ["openssl", *args],
        input=input_data,
        capture_output=True,
    )
    if result.returncode != 0:
        raise RuntimeError(f"openssl {' '.join(args)} failed: {result.stderr.decode()}")
    return result.stdout.decode()


def get_server_certs(host: str, port: int = 443) -> list[str]:
    """Return list of PEM certs sent by the server (leaf first)."""
    result = subprocess.run(
        ["openssl", "s_client", "-connect", f"{host}:{port}", "-showcerts"],
        input=b"",
        capture_output=True,
        timeout=30,
    )
    output = result.stdout.decode("utf-8", errors="replace")

    certs: list[str] = []
    current: list[str] = []
    in_cert = False
    for line in output.splitlines():
        if "-----BEGIN CERTIFICATE-----" in line:
            in_cert = True
            current = [line]
        elif "-----END CERTIFICATE-----" in line:
            current.append(line)
            certs.append("\n".join(current))
            in_cert = False
        elif in_cert:
            current.append(line)
    return certs


def get_aia_issuer_url(pem: str) -> str | None:
    text = run_openssl("x509", "-noout", "-text", input_data=pem.encode())
    m = re.search(r"CA Issuers - URI:(https?://\S+)", text)
    return m.group(1) if m else None


def is_self_signed(pem: str) -> bool:
    out = run_openssl("x509", "-noout", "-subject", "-issuer", input_data=pem.encode())
    lines = out.strip().splitlines()
    if len(lines) == 2:
        return lines[0].replace("subject=", "").strip() == lines[1].replace("issuer=", "").strip()
    return False


def fetch_cert(url: str) -> str:
    """Download a cert from a URL (DER or PEM) and return PEM."""
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    with urllib.request.urlopen(url, context=ctx, timeout=15) as resp:
        data = resp.read()

    for fmt in ("DER", "PEM"):
        result = subprocess.run(
            ["openssl", "x509", "-inform", fmt, "-outform", "PEM"],
            input=data,
            capture_output=True,
        )
        if result.returncode == 0:
            return result.stdout.decode().strip()

    raise RuntimeError(f"Could not decode certificate from {url}")


def cert_subject(pem: str) -> str:
    out = run_openssl("x509", "-noout", "-subject", input_data=pem.encode())
    return out.strip()


def build_chain() -> list[str]:
    """
    Return the intermediate + root certs for HOST.

    Algorithm:
      1. Collect everything the server sends (skip leaf at index 0).
      2. Walk AIA from the last cert in hand until reaching a self-signed root.
    """
    print(f"Connecting to {HOST}:443 …")
    server_certs = get_server_certs(HOST)
    print(f"Server sent {len(server_certs)} certificate(s)")

    if not server_certs:
        raise RuntimeError("No certificates received from server")

    # Skip the leaf (index 0); keep everything the server provided beyond it
    chain: list[str] = server_certs[1:]

    # The starting point for AIA walking is the last cert we have (or the leaf
    # if the server sent nothing beyond it)
    current = chain[-1] if chain else server_certs[0]

    for depth in range(10):
        print(f"  Checking: {cert_subject(current)}")
        if is_self_signed(current):
            print("  → self-signed root reached")
            if current not in chain:
                chain.append(current)
            break

        url = get_aia_issuer_url(current)
        if not url:
            print("  → no AIA CA Issuers URL, chain may be incomplete")
            break

        print(f"  → fetching issuer from {url}")
        issuer = fetch_cert(url)
        chain.append(issuer)
        current = issuer
    else:
        print("WARNING: AIA walk depth limit reached", file=sys.stderr)

    return chain


def main() -> None:
    chain = build_chain()
    if not chain:
        print("ERROR: empty chain", file=sys.stderr)
        sys.exit(1)

    new_content = "\n".join(chain) + "\n"
    old_content = OUTPUT_FILE.read_text() if OUTPUT_FILE.exists() else ""

    if new_content == old_content:
        print("Certificate chain is unchanged.")
        sys.exit(0)

    OUTPUT_FILE.write_text(new_content)
    print(f"Written {len(chain)} certificate(s) to {OUTPUT_FILE}")

    # Signal to the workflow that the file changed
    print("CERT_CHANGED=true")


if __name__ == "__main__":
    main()
