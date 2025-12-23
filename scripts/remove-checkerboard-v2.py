#!/usr/bin/env python3
"""
Remove checkerboard background from PNG images more aggressively.
"""

from PIL import Image
import os

def remove_checkerboard(input_path, output_path):
    """Remove checkerboard background using color-based detection."""
    print(f"Processing: {input_path}")

    img = Image.open(input_path).convert('RGBA')
    pixels = img.load()
    width, height = img.size

    print(f"  Size: {width}x{height}")

    removed_count = 0

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]

            # Skip already transparent pixels
            if a == 0:
                continue

            # Checkerboard detection:
            # The checkerboard has two alternating colors based on position
            # Light squares (~204, 204, 204) at even positions
            # Dark squares (~153, 153, 153) at odd positions

            is_even_position = ((x // 8) + (y // 8)) % 2 == 0

            # Check if it's a gray color (R ≈ G ≈ B)
            is_gray = abs(r - g) <= 5 and abs(g - b) <= 5 and abs(r - b) <= 5

            if is_gray:
                # Light gray checkerboard square (around 200-210)
                is_light_checker = 195 <= r <= 215
                # Dark gray checkerboard square (around 150-160)
                is_dark_checker = 145 <= r <= 165

                if is_light_checker or is_dark_checker:
                    # Make transparent
                    pixels[x, y] = (r, g, b, 0)
                    removed_count += 1

    print(f"  Removed {removed_count} pixels")

    img.save(output_path, 'PNG')
    print(f"  Saved: {output_path}")

# Process the icons
icons_dir = '/Users/bruno/Documents/kourt-mobile/assets/icons/3d'
icons = ['matchs.png', 'torneios.png', 'profissionais.png']

for icon in icons:
    # Use backup as source
    backup_path = os.path.join(icons_dir, f'{icon}.backup')
    output_path = os.path.join(icons_dir, icon)

    if os.path.exists(backup_path):
        remove_checkerboard(backup_path, output_path)
    else:
        input_path = os.path.join(icons_dir, icon)
        if os.path.exists(input_path):
            remove_checkerboard(input_path, output_path)
        else:
            print(f"File not found: {input_path}")

print("\nDone!")
