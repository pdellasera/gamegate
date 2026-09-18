import sys, pathlib, math, traceback

here = pathlib.Path(__file__).parent
log = open(here / '_render.log', 'w')
sys.stdout = log
sys.stderr = log
marker = here / '_render_done.txt'
marker.write_text('running\n')


def note(s):
    print(s, flush=True)


try:
    import bpy
    from mathutils import Vector

    note('bpy ' + bpy.app.version_string)

    ROOT = here.parent
    GLB = str(ROOT / 'assets' / 'mapa_estadio.glb')
    OUT = str(ROOT / 'assets' / 'estadio-3d')

    bpy.ops.wm.read_factory_settings(use_empty=True)
    note('factory settings ok')

    try:
        bpy.ops.import_scene.gltf(filepath=GLB)
    except Exception:
        bpy.ops.preferences.addon_enable(module='io_scene_gltf2')
        bpy.ops.import_scene.gltf(filepath=GLB)
    note('import ok')

    objs = [o for o in bpy.context.scene.objects if o.type == 'MESH']
    note('meshes ' + str(len(objs)))

    mn = Vector((1e18, 1e18, 1e18))
    mx = Vector((-1e18, -1e18, -1e18))
    for o in objs:
        for c in o.bound_box:
            w = o.matrix_world @ Vector(c)
            mn.x = min(mn.x, w.x)
            mn.y = min(mn.y, w.y)
            mn.z = min(mn.z, w.z)
            mx.x = max(mx.x, w.x)
            mx.y = max(mx.y, w.y)
            mx.z = max(mx.z, w.z)
    center = (mn + mx) / 2
    size = mx - mn
    radius = size.length / 2
    note('radius ' + str(round(radius, 3)))

    cam_data = bpy.data.cameras.new('Cam')
    cam = bpy.data.objects.new('Cam', cam_data)
    bpy.context.scene.collection.objects.link(cam)
    bpy.context.scene.camera = cam
    cam_data.lens = 40
    cam_data.sensor_width = 36

    dist = radius * 2.4
    cam.location = center + Vector((dist * 0.75, -dist * 0.75, dist * 0.62))
    look = center - cam.location
    cam.rotation_euler = look.to_track_quat('-Z', 'Y').to_euler()
    note('camera ok')

    world = bpy.data.worlds.new('World')
    bpy.context.scene.world = world
    world.use_nodes = True
    nt = world.node_tree
    bg = nt.nodes.get('Background')
    bg.inputs[0].default_value = (0.16, 0.67, 0.88, 1.0)
    bg.inputs[1].default_value = 0.5

    sun_data = bpy.data.lights.new('Sun', 'SUN')
    sun = bpy.data.objects.new('Sun', sun_data)
    bpy.context.scene.collection.objects.link(sun)
    sun.rotation_euler = (math.radians(55), math.radians(15), math.radians(35))
    sun_data.energy = 3.5

    fill_data = bpy.data.lights.new('Fill', 'SUN')
    fill = bpy.data.objects.new('Fill', fill_data)
    bpy.context.scene.collection.objects.link(fill)
    fill.rotation_euler = (math.radians(75), math.radians(-160), math.radians(-25))
    fill_data.energy = 1.2
    note('lights ok')

    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'CPU'
    scene.cycles.samples = 64
    scene.cycles.use_denoising = True
    scene.cycles.use_adaptive_sampling = True
    scene.render.resolution_x = 1600
    scene.render.resolution_y = 1200
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.image_settings.color_depth = '8'
    scene.render.filepath = OUT
    scene.render.use_file_extension = True
    note('settings ok, rendering...')

    bpy.ops.render.render(write_still=True)
    note('render done -> ' + OUT + '.png')
    marker.write_text('ok\n')
except Exception:
    note('ERROR\n' + traceback.format_exc())
    marker.write_text('error\n')
