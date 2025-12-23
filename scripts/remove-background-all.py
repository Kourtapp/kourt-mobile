#!/usr/bin/env python3
"""
Remove white/gray backgrounds from PNG images and make them transparent.
"""

from PIL import Image
import os

def remove_background(input_path, output_path, threshold=240):
    """Remove light backgrounds (white/light gray) and make transparent."""
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

            # Check if it's a light color (close to white or light gray)
            # All RGB values should be high and similar to each other
            is_light = r >= threshold and g >= threshold and b >= threshold
            is_gray_ish = abs(r - g) <= 15 and abs(g - b) <= 15 and abs(r - b) <= 15

            if is_light and is_gray_ish:
                pixels[x, y] = (r, g, b, 0)
                removed_count += 1

    print(f"  Removed {removed_count} pixels")

    img.save(output_path, 'PNG')
    print(f"  Saved: {output_path}")

def remove_checkerboard_aggressive(input_path, output_path):
    """Remove checkerboard pattern more aggressively."""
    print(f"Processing checkerboard: {input_path}")

    img = Image.open(input_path).convert('RGBA')
    pixels = img.load()
    width, height = img.size

    print(f"  Size: {width}x{height}")

    removed_count = 0

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]

            if a == 0:
                continue

            # Check if it's a gray color (R ≈ G ≈ B)
            is_gray = abs(r - g) <= 10 and abs(g - b) <= 10 and abs(r - b) <= 10

            if is_gray:
                # Light gray (around 190-220) - white-ish background
                if 185 <= r <= 225:
                    pixels[x, y] = (r, g, b, 0)
                    removed_count += 1
                # Medium gray checkerboard (around 150-185)
                elif 145 <= r <= 185:
                    pixels[x, y] = (r, g, b, 0)
                    removed_count += 1
                # Dark gray checkerboard (around 90-145)
                elif 85 <= r <= 145:
                    pixels[x, y] = (r, g, b, 0)
                    removed_count += 1

    print(f"  Removed {removed_count} pixels")

    img.save(output_path, 'PNG')
    print(f"  Saved: {output_path}")

# Process the icons
icons_dir = '/Users/bruno/Documents/kourt-mobile/assets/icons/3d'

# Process quadras - remove white background (threshold 235)
print("\n=== Processing Quadras (white background) ===")
remove_background(
    os.path.join(icons_dir, 'quadras.png'),
    os.path.join(icons_dir, 'quadras.png'),
    threshold=235
)

# Process torneios - remove light gray background (threshold 230)
print("\n=== Processing Torneios (gray background) ===")
remove_background(
    os.path.join(icons_dir, 'torneios.png'),
    os.path.join(icons_dir, 'torneios.png'),
    threshold=230
)

# Process profissionais - use backup and remove checkerboard aggressively
print("\n=== Processing Profissionais (checkerboard) ===")
backup_path = os.path.join(icons_dir, 'profissionais.png.backup')
if os.path.exists(backup_path):
    remove_checkerboard_aggressive(
        backup_path,
        os.path.join(icons_dir, 'profissionais.png')
    )
else:
    print("Backup not found, processing current file")
    remove_checkerboard_aggressive(
        os.path.join(icons_dir, 'profissionais.png'),
        os.path.join(icons_dir, 'profissionais.png')
    )

print("\n=== Done! Reload Metro to see changes ===")
