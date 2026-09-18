import bpy
import pathlib
import sys

here = pathlib.Path(__file__).parent
root = here.parent
log = open(here / '_optimize.log', 'w')
sys.stdout = log
sys.stderr = log


def note(s):
    print(s, flush=True)


GLB = str(root / 'assets' / 'mapa_estadio.glb')
OUT = str(root / 'assets' / 'mapa_estadio-opt.glb')

bpy.ops.wm.read_factory_settings(use_empty=True)
try:
    bpy.ops.import_scene.gltf(filepath=GLB)
except Exception:
    bpy.ops.preferences.addon_enable(module='io_scene_gltf2')
    bpy.ops.import_scene.gltf(filepath=GLB)

for img in bpy.data.images:
    w, h = img.size
    note('image %r %s' % (img.name, (w, h)))
    if w and h and max(w, h) > 1024:
        s = 1024 / max(w, h)
        img.scale(int(w * s), int(h * s))
        note('  scaled -> %s' % (img.size,))
    img.pack()

obj = [o for o in bpy.context.scene.objects if o.type == 'MESH'][0]
bpy.context.view_layer.objects.active = obj
obj.select_set(True)
mod = obj.modifiers.new('Decimate', 'DECIMATE')
mod.ratio = 0.5
try:
    bpy.ops.object.modifier_apply(modifier='Decimate')
    obj.data.calc_loop_triangles()
    note('decimated -> tris %d' % len(obj.data.loop_triangles))
except Exception as e:
    note('decimate skipped: %r' % e)

bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=False)
note('exported %s' % OUT)
note('DONE')
