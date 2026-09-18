import cv2
import numpy as np

img = cv2.imread('assets/Distribucion.png')

pts = {
    'SUR_SUPERIOR': (69, 68),
    'SUR_INFERIOR': (69, 129),
    'BALBOA': (69, 186),
    'ESTE_SUPERIOR': (231, 65),
    'ESTE_INFERIOR': (231, 129),
    'OESTE_SUPERIOR_a': (231, 168),
    'OESTE_SUPERIOR_b': (231, 190),
    'OESTE_INFERIOR': (231, 249),
}

for k, (x, y) in pts.items():
    patch = img[y - 8:y + 8, x - 8:x + 8].reshape(-1, 3)
    med = np.median(patch, axis=0).astype(int)
    print(k, '#%02X%02X%02X' % (med[2], med[1], med[0]))

