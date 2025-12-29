#!/bin/bash
set -euo pipefail

# Extract all unique font URLs and download them
grep -o 'https://fonts\.gstatic\.com[^)]*' fonts.css | sort -u | while IFS= read -r url; do
  # Extract just the filename from the URL
  filename=$(basename "$url")
  if [ -f "$filename" ]; then
    echo "✓ Already have: $filename"
  else
    echo "Downloading: $filename..."
    curl -s -L "$url" -o "$filename" && echo "  ✓ Downloaded" || echo "  ✗ Failed"
  fi
done

echo ""
echo "Font files now in assets/fonts/:"
ls -lh *.ttf 2>/dev/null | tail -20 || echo "(no .ttf files yet)"
