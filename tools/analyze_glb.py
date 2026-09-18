import bpy
import json
import pathlib
import sys

import numpy as np

here = pathlib.Path(__file__).parent
root = here.parent
log = open(here / '_analyze.log', 'w')
sys.stdout = log
sys.stderr = log


def note(s):
    print(s, flush=True)


GLB = str(root / 'assets' / 'mapa_estadio.glb')

bpy.ops.wm.read_factory_settings(use_empty=True)
try:
    bpy.ops.import_scene.gltf(filepath=GLB)
except Exception:
    bpy.ops.preferences.addon_enable(module='io_scene_gltf2')
    bpy.ops.import_scene.gltf(filepath=GLB)

objs = [o for o in bpy.context.scene.objects if o.type == 'MESH']
note('mesh objects: %d' % len(objs))
obj = objs[0]
obj.data.calc_loop_triangles()
note('obj name: %r' % obj.name)
note('verts %d  tris %d' % (len(obj.data.vertices), len(obj.data.loop_triangles)))
note('matrix_world:\n%s' % np.array(obj.matrix_world))

n = len(obj.data.vertices)
co = np.zeros(n * 3, dtype=np.float32)
obj.data.vertices.foreach_get('co', co)
co = co.reshape(-1, 3).astype(np.float64)

M = np.array(obj.matrix_world, dtype=np.float64)
hom = np.hstack([co, np.ones((n, 1), dtype=np.float64)])
w = (M @ hom.T).T[:, :3]

mn = w.min(axis=0)
mx = w.max(axis=0)
size = mx - mn
center = (mn + mx) / 2
note('bbox min %s' % mn.round(4))
note('bbox max %s' % mx.round(4))
note('size (X,Y,Z) %s' % size.round(4))
note('center %s' % center.round(4))

rx = float(size[0] / 2)
ry = float(size[1] / 2)
note('half-extents X %.4f  Y %.4f  Z %.4f' % (rx, ry, float(size[2] / 2)))

nr = np.sqrt(((w[:, 0] - center[0]) / rx) ** 2 + ((w[:, 1] - center[1]) / ry) ** 2)
z = w[:, 2]

bins = np.linspace(0.0, 1.0, 41)
profile = []
for i in range(len(bins) - 1):
    m = (nr >= bins[i]) & (nr < bins[i + 1])
    if int(m.sum()) > 20:
        profile.append([round(float((bins[i] + bins[i + 1]) / 2), 4), round(float(z[m].mean()), 4), int(m.sum())])
note('profile (nr, meanZ, verts):')
for p in profile:
    note('   %s' % p)

out = {
    'center': [round(float(c), 4) for c in center],
    'rx': round(rx, 4),
    'ry': round(ry, 4),
    'rimZ': round(float(mx[2]), 4),
    'pitchZ': round(float(mn[2]), 4),
    'profile': profile,
}
dst = root / 'src' / 'data' / 'seatLayout.json'
dst.parent.mkdir(parents=True, exist_ok=True)
dst.write_text(json.dumps(out, indent=2))
note('wrote %s' % dst)
note('DONE')
