"""Genera los iconos (favicon) de GameGate a partir del icono del águila.

Usa ``assets/icon.png`` (el águila), la convierte en silueta blanca y la centra
sobre un cuadrado con degradado azul de marca y esquinas redondeadas.

Salida (en ``public/``, servida por Vite en la raíz):
    - favicon.ico             (16/32/48)
    - apple-touch-icon.png    (180x180)
    - icon-192.png            (192x192)
    - icon-512.png            (512x512)

Uso:  python tools/make_favicon.py
"""

from pathlib import Path

from PIL import Image, ImageDraw

RAIZ = Path(__file__).resolve().parents[1]
ICONO = RAIZ / 'assets' / 'icon.png'
PUBLIC = RAIZ / 'public'

# Colores de marca (degradado vertical).
GRAD_TOP = (11, 122, 240)    # #0B7AF0
GRAD_BOTTOM = (0, 85, 230)   # #0055E6

# Proporciones de diseño.
CORNER_RADIUS = 0.22   # radio de esquina relativo al lado
PADDING = 0.12         # margen del águila relativo al lado

PNG_SIZES = {
    'apple-touch-icon.png': 180,
    'icon-192.png': 192,
    'icon-512.png': 512,
}
ICO_SIZES = [16, 32, 48]


def make_base(size: int) -> Image.Image:
    """Cuadrado con degradado azul vertical y esquinas redondeadas (fondo transparente)."""
    grad = Image.new('RGBA', (size, size))
    draw = ImageDraw.Draw(grad)
    for y in range(size):
        t = y / (size - 1)
        color = tuple(round(GRAD_TOP[i] + (GRAD_BOTTOM[i] - GRAD_TOP[i]) * t) for i in range(3))
        draw.line([(0, y), (size, y)], fill=color + (255,))

    mask = Image.new('L', (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, size - 1, size - 1], radius=round(size * CORNER_RADIUS), fill=255
    )

    base = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    base.paste(grad, (0, 0), mask)
    return base


def paste_eagle(base: Image.Image, eagle: Image.Image, size: int) -> Image.Image:
    """Pega el águila como silueta blanca, centrada y con el padding definido."""
    max_dim = round(size * (1 - 2 * PADDING))

    ratio = max_dim / max(eagle.width, eagle.height)
    e = eagle.resize((round(eagle.width * ratio), round(eagle.height * ratio)), Image.LANCZOS)

    silueta = Image.new('RGBA', e.size, (255, 255, 255, 255))
    silueta.putalpha(e.getchannel('A'))

    x = (size - silueta.width) // 2
    y = (size - silueta.height) // 2
    base.alpha_composite(silueta, (x, y))
    return base


def main() -> None:
    PUBLIC.mkdir(exist_ok=True)

    eagle = Image.open(ICONO).convert('RGBA')
    eagle = eagle.crop(eagle.getchannel('A').getbbox())

    for filename, size in PNG_SIZES.items():
        base = paste_eagle(make_base(size), eagle, size)
        base.save(PUBLIC / filename, 'PNG')
        print(f'{filename}  {size}x{size}')

    # favicon.ico multi-tamaño (Pillow escala desde 48).
    base = paste_eagle(make_base(ICO_SIZES[-1]), eagle, ICO_SIZES[-1])
    base.save(PUBLIC / 'favicon.ico', format='ICO', sizes=[(s, s) for s in ICO_SIZES])
    print('favicon.ico', ICO_SIZES)


if __name__ == '__main__':
    main()
