// ---------- ----------
// IMPORT - threejs and any addons I want to use
// ---------- ----------
import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
// ---------- ----------
// SCENE, CAMERA, RENDERER
// ---------- ----------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 32 / 24, 0.1, 1000);
const renderer = new THREE.WebGL1Renderer();
renderer.setSize(640, 480, false);
(document.querySelector('#demo') || document.body).appendChild(renderer.domElement);
// ---------- ----------
// HELPERS
// ---------- ----------
const createLODSphere = ( detail_levels = 5, dist_max = 50, seg_max = 30, seg_min = 5 ) => {
    const lod = new THREE.LOD();
    const seg_delta = seg_max - seg_min;
    const material = new THREE.MeshNormalMaterial({ wireframe: true, wireframeLinewidth: 3 });
    for( let i = 0; i < detail_levels; i++ ) {
        const a_level = i / ( detail_levels - 1);
        const widthSegments = Math.floor( seg_max - seg_delta * a_level );
        const heightSegments = Math.floor( seg_max - seg_delta *  a_level );
        const geometry = new THREE.SphereGeometry( 4, widthSegments, heightSegments );
        const mesh = new THREE.Mesh( geometry, material );
        lod.addLevel( mesh, dist_max / detail_levels * i );
    }
    return lod;
};
// ---------- ----------
// OBJECTS
// ---------- ----------
scene.add( new THREE.GridHelper( 50, 50 ) );
// lod object with levels added
const lod = createLODSphere();
scene.add( lod );
// ---------- ----------
// ANIMATION LOOP
// ---------- ----------
camera.position.set(2, 3, 5);
// constant values and state for main app loop
const FPS_UPDATE = 20, // fps rate to update ( low fps for low CPU use, but choppy video )
FPS_MOVEMENT = 30,     // fps rate to move object by that is independent of frame update rate
FRAME_MAX = 600,
CLOCK = new THREE.Clock(true); // USING THREE.Clock in place of new Date() or Date.now()
let secs = 0,
frame = 0,
lt = CLOCK.getElapsedTime();
// update
const update = (frame, frameMax) => {
    const a1 = frame / frameMax;
    const a2 = 1 - Math.abs(0.5 - a1 ) / 0.5;
    const a3 = THREE.MathUtils.smoothstep(a2, 0, 1);
    lod.position.z = 100 * -1 + 100 * a3;
    camera.lookAt(lod.position);
};
// loop
const loop = () => {
    const now = CLOCK.getElapsedTime(),
    secs = (now - lt);
    requestAnimationFrame(loop);
    if(secs > 1 / FPS_UPDATE){
        update( Math.floor(frame), FRAME_MAX);
        renderer.render(scene, camera);
        frame += FPS_MOVEMENT * secs;
        frame %= FRAME_MAX;
        lt = now;
    }
};
loop();