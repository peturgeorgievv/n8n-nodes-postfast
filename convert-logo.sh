#!/bin/bash

# Script to help convert and optimize your logo for n8n

echo "🎨 PostFast Logo Converter for n8n"
echo "================================="

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Installing ImageMagick..."
    brew install imagemagick
fi

# Input file
INPUT_LOGO=$1

if [ -z "$INPUT_LOGO" ]; then
    echo "Usage: ./convert-logo.sh /path/to/your/logo.png"
    exit 1
fi

if [ ! -f "$INPUT_LOGO" ]; then
    echo "Error: File $INPUT_LOGO not found!"
    exit 1
fi

echo "Converting $INPUT_LOGO to SVG..."

# Convert to PNG first if needed (for consistency)
convert "$INPUT_LOGO" -resize 60x60 -gravity center -extent 60x60 temp_logo.png

# Create SVG with embedded image
cat > icons/postfast.svg << EOF
<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="rounded">
      <rect width="60" height="60" rx="8" ry="8"/>
    </clipPath>
  </defs>

  <g clip-path="url(#rounded)">
    <image href="data:image/png;base64,$(base64 -i temp_logo.png)"
           x="0" y="0" width="60" height="60"/>
  </g>
</svg>
EOF

# Clean up
rm temp_logo.png

echo "✅ Logo converted successfully!"
echo "📁 Saved to: icons/postfast.svg"
echo ""
echo "Next steps:"
echo "1. Run: npm run build"
echo "2. Run: npm run dev"
echo "3. Check your node in n8n at http://localhost:5678"