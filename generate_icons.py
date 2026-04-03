import struct
import zlib
import math
import os

def create_png(filename, size):
    def write_chunk(chunk_type, data):
        chunk = chunk_type + data
        return struct.pack('>I', len(data)) + chunk + struct.pack('>I', zlib.crc32(chunk) & 0xffffffff)

    def pack_pixel(r, g, b, a):
        return bytes([r, g, b, a])

    pixels = []
    cx, cy = size // 2, size // 2
    radius = int(size * 0.42)
    corner = int(size * 0.22)

    for y in range(size):
        row = b'\x00'
        for x in range(size):
            # Rounded rect background
            dx = max(corner - x, 0, x - (size - corner))
            dy = max(corner - y, 0, y - (size - corner))
            in_bg = (dx*dx + dy*dy) <= corner*corner

            # Gold circle
            dist = math.sqrt((x - cx)**2 + (y - cy)**2)
            in_circle = dist <= radius

            # Cross/book shape inside circle
            rel_x = (x - cx) / radius
            rel_y = (y - cy) / radius
            in_cross = (abs(rel_x) < 0.12 or abs(rel_y) < 0.12) and dist < radius * 0.75

            if not in_bg:
                row += pack_pixel(0, 0, 0, 0)
            elif in_circle:
                if in_cross:
                    row += pack_pixel(12, 10, 9, 255)
                else:
                    row += pack_pixel(251, 191, 36, 255)
            else:
                row += pack_pixel(12, 10, 9, 255)

        pixels.append(row)

    raw = b''.join(pixels)
    compressed = zlib.compress(raw, 9)

    png = b'\x89PNG\r\n\x1a\n'
    png += write_chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0))
    png += write_chunk(b'IDAT', compressed)
    png += write_chunk(b'IEND', b'')

    with open(filename, 'wb') as f:
        f.write(png)
    print(f"Created {filename}")

os.makedirs('public/icons', exist_ok=True)
create_png('public/icons/icon-192.png', 192)
create_png('public/icons/icon-512.png', 512)
print("Done!")
