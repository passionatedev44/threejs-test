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
scene.add( new THREE.GridHelper(10, 10) );
const geo = new THREE.SphereGeometry(1, 20, 20);
const material = new THREE.MeshNormalMaterial();
const mesh1 = new THREE.Mesh( geo, material);
mesh1.position.z = -2.5;
scene.add(mesh1);
const mesh2 = new THREE.Mesh( geo, material);
scene.add(mesh2);
const mesh3 = new THREE.Mesh( geo, material);
mesh3.position.z = 2.5;
scene.add(mesh3);
//-------- ----------
// BREATH GROUP - creating with default settings
//-------- ----------
const BREATH_SECS = 60;
const group = BreathMod.create({
    totalBreathSecs: BREATH_SECS,
    breathsPerMinute: 6,
    breathParts: {restLow: 1, breathIn: 1, restHigh: 1, breathOut: 1},
    before: (group, a1, a2, a_fullvid, a_breathPart, breathPart, gud) => {
        mesh1.position.x = -5 + 10 * a1;
        mesh2.position.x = -5 + 10 * a2;
        mesh3.position.x = -5 + 10 * a_fullvid;
        scene.background = new THREE.Color(0,0,0);
        if(gud.breath){
            scene.background = new THREE.Color(0,1,1);
        }
    },
    hooks: {
        breathIn : (group, a_breathPart, a_fullvid, gud) => {
        },
        breathOut : (group, a_breathPart, a_fullvid, gud) => {
        }
    }

});
scene.add(group);

const gud = group.userData;
console.log(gud.secsPerBreathCycle)
console.log(gud.breathPartsString);
console.log(gud.totalTimeString);
console.log(gud.timeString);

// ---------- ----------
// ANIMATION LOOP
// ---------- ----------
camera.position.set(4, 4, 8);
camera.lookAt(0, 0, 0);
const FPS_UPDATE = 30, // fps rate to update ( low fps for low CPU use, but choppy video )
FPS_MOVEMENT = 30;     // fps rate to move object by that is independent of frame update rate
FRAME_MAX = 30 * BREATH_SECS;
let secs = 0,
frame = 0,
lt = new Date();
// update
const update = function(frame, frameMax){
    const a1 = frame / frameMax;
    const a_breathPart = a1;
    const a_breath = Math.sin(Math.PI * 0.5 * a_breathPart);
    BreathMod.update(group, a_breath);
};
// loop
const loop = () => {
    const now = new Date(),
    secs = (now - lt) / 1000;
    requestAnimationFrame(loop);
    if(secs > 1 / FPS_UPDATE){
        // update, render
        update( Math.floor(frame), FRAME_MAX);
        renderer.render(scene, camera);
        // step frame
        frame += FPS_MOVEMENT * secs;
        frame %= FRAME_MAX;
        lt = now;
    }
};
loop();