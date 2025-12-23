#!/usr/bin/env python3
"""Remove white background from profissionais icon."""

from PIL import Image

input_path = '/Users/bruno/Documents/kourt-mobile/assets/icons/3d/profissionais.png'

img = Image.open(input_path).convert('RGBA')
pixels = img.load()
width, height = img.size

print(f"Processing: {input_path}")
print(f"Size: {width}x{height}")

removed_count = 0

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]

        if a == 0:
            continue

        # Remove light backgrounds (white/light gray)
        # Check if all RGB values are high and similar
        is_light = r >= 230 and g >= 230 and b >= 230
        is_gray_similar = abs(r - g) <= 15 and abs(g - b) <= 15

        if is_light and is_gray_similar:
            pixels[x, y] = (r, g, b, 0)
            removed_count += 1

print(f"Removed {removed_count} pixels")

img.save(input_path, 'PNG')
print(f"Saved: {input_path}")
