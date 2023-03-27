// ---------- ----------
// SCENE, CAMERA, RENDERER
// ---------- ----------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 32 / 24, 0.1, 1000);
const renderer = new THREE.WebGL1Renderer();
renderer.setSize(640, 480, false);
(document.getElementById('demo') || document.body).appendChild(renderer.domElement);
// ---------- ----------
// OBJECTS
// ---------- ----------
scene.add( new THREE.GridHelper( 10,10 ) );
const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshNormalMaterial());
scene.add(box);
// ---------- ----------
// CONTROLS
// ---------- ----------
if(THREE.OrbitControls){
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
}
// ---------- ----------
// ANIMATION LOOP
// ---------- ----------
camera.position.set(2, 2, 2);
camera.lookAt(0,0,0);
const FPS_UPDATE = 2, // fps rate to update ( low fps for low CPU use, but choppy video )
FPS_MOVEMENT = 30;     // fps rate to move object by that is independent of frame update rate
FRAME_MAX = 450;
let secs = 0,
frame_frac = 0,
frame = 0,
tick = 0,
lt = new Date();
const update = function(frame, frameMax){
    const a1 = frame / frameMax;
    const degree = 360 * a1;
    box.rotation.x = THREE.MathUtils.degToRad(degree);
};
const loop = () => {
    const now = new Date(),
    secs = (now - lt) / 1000;
    requestAnimationFrame(loop);
    if(secs > 1 / FPS_UPDATE){
        // update, render
        update( frame, FRAME_MAX);
        renderer.render(scene, camera);
        console.log(tick, frame_frac, frame)
        // step frame
        frame_frac += FPS_MOVEMENT * secs;
        frame_frac %= FRAME_MAX;
        frame = Math.floor(frame_frac);
        tick = (tick += 1) % FRAME_MAX;
        lt = now;
    }
};
loop();
