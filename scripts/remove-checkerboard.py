#!/usr/bin/env python3
"""
Remove checkerboard background from PNG images and make it transparent.
The checkerboard pattern typically has colors around #C0C0C0 (192) and #808080 (128).
"""

from PIL import Image
import os

def remove_checkerboard(input_path, output_path):
    """Remove checkerboard background and make it transparent."""
    img = Image.open(input_path).convert('RGBA')
    pixels = img.load()
    width, height = img.size

    # Checkerboard colors are typically gray tones
    # We'll detect the checkerboard pattern and make those pixels transparent

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]

            # Check if pixel is part of checkerboard pattern
            # Checkerboard typically alternates between light gray (~200) and dark gray (~150)
            is_gray = abs(r - g) < 10 and abs(g - b) < 10 and abs(r - b) < 10
            is_checkerboard_light = is_gray and 180 <= r <= 220
            is_checkerboard_dark = is_gray and 140 <= r <= 180

            if is_checkerboard_light or is_checkerboard_dark:
                # Check if it's actually part of a checkerboard pattern
                # by looking at neighboring pixels
                neighbors_are_checkerboard = False

                if x > 0 and y > 0 and x < width - 1 and y < height - 1:
                    # Get diagonal neighbor
                    nr, ng, nb, na = pixels[x-1, y-1]
                    neighbor_gray = abs(nr - ng) < 10 and abs(ng - nb) < 10

                    if neighbor_gray:
                        # If current is light and neighbor is dark (or vice versa), it's checkerboard
                        if (is_checkerboard_light and 140 <= nr <= 180) or \
                           (is_checkerboard_dark and 180 <= nr <= 220):
                            neighbors_are_checkerboard = True

                if neighbors_are_checkerboard or (is_checkerboard_light or is_checkerboard_dark):
                    # Make transparent
                    pixels[x, y] = (r, g, b, 0)

    img.save(output_path, 'PNG')
    print(f"Processed: {input_path} -> {output_path}")

def remove_checkerboard_advanced(input_path, output_path):
    """More advanced checkerboard removal using flood fill from edges."""
    img = Image.open(input_path).convert('RGBA')
    pixels = img.load()
    width, height = img.size

    # Create a mask of pixels to make transparent
    to_remove = set()

    def is_checkerboard_color(r, g, b):
        """Check if a color is likely part of the checkerboard."""
        is_gray = abs(r - g) < 15 and abs(g - b) < 15 and abs(r - b) < 15
        # Checkerboard grays are typically 140-220 range
        return is_gray and 130 <= r <= 230 and 130 <= g <= 230 and 130 <= b <= 230

    def flood_fill(start_x, start_y):
        """Flood fill from a starting point to find connected checkerboard pixels."""
        stack = [(start_x, start_y)]
        visited = set()

        while stack:
            x, y = stack.pop()
            if (x, y) in visited or x < 0 or y < 0 or x >= width or y >= height:
                continue

            visited.add((x, y))
            r, g, b, a = pixels[x, y]

            if is_checkerboard_color(r, g, b):
                to_remove.add((x, y))
                # Add neighbors
                stack.extend([(x+1, y), (x-1, y), (x, y+1), (x, y-1)])

    # Start flood fill from edges
    for x in range(width):
        flood_fill(x, 0)
        flood_fill(x, height - 1)
    for y in range(height):
        flood_fill(0, y)
        flood_fill(width - 1, y)

    # Make identified pixels transparent
    for x, y in to_remove:
        r, g, b, a = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)

    img.save(output_path, 'PNG')
    print(f"Processed (advanced): {input_path} -> {output_path}")
    print(f"  Removed {len(to_remove)} pixels")

# Process the icons
icons_dir = '/Users/bruno/Documents/kourt-mobile/assets/icons/3d'
icons = ['matchs.png', 'torneios.png', 'profissionais.png']

for icon in icons:
    input_path = os.path.join(icons_dir, icon)
    if os.path.exists(input_path):
        # Backup original
        backup_path = os.path.join(icons_dir, f'{icon}.backup')
        if not os.path.exists(backup_path):
            import shutil
            shutil.copy(input_path, backup_path)
            print(f"Backed up: {input_path}")

        # Process
        remove_checkerboard_advanced(input_path, input_path)
    else:
        print(f"File not found: {input_path}")

print("\nDone! Restart Metro to see changes.")
