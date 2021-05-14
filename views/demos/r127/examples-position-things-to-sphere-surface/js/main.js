var scene = new THREE.Scene();
scene.add(new THREE.GridHelper(10, 10));

// camera and renderer
var camera = new THREE.PerspectiveCamera(60, 320 / 240, 0.1, 1000);
camera.position.set(3.0, 3.0, 3.0);
camera.lookAt(0, 0, 0);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(640, 480);
document.getElementById('demo').appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

// add wrap the the scene
var wrap = SphereWrap.createWrap();
scene.add(wrap);
SphereWrap.addObjectToWrap(wrap, 'cube');
SphereWrap.addObjectToWrap(wrap, 'cube2');
var cone = new THREE.Mesh(
        new THREE.ConeGeometry(0.25, 0.5, 30, 30),
        new THREE.MeshNormalMaterial({
            wireframe: true
        }));
cone.geometry.rotateX(Math.PI * 1.5);
SphereWrap.addObjectToWrap(wrap, 'cone', cone);
// dist and lat log values
var dist = 1.25, // radius + half of mesh height
latPer = 0.75, // 0 - 1
longPer = 0.5; // 0 - 1
SphereWrap.setObjToLatLong(wrap, 'cube', latPer, longPer, dist);
SphereWrap.setObjToLatLong(wrap, 'cube2', 0, 0, 1.25);
SphereWrap.setObjToLatLong(wrap, 'cone', 0.9, 1, 1.25);
// loop
var lt = new Date(),
frame = 0,
maxFrame = 600,
fps = 30;
var loop = function () {
    var now = new Date(),
    per = frame / maxFrame,
    bias = 1 - Math.abs(per - 0.5) / 0.5,
    secs = (now - lt) / 1000;
    requestAnimationFrame(loop);
    if (secs > 1 / fps) {
        latPer = 0.25 + Math.sin(Math.PI * bias) * 0.5;
        longPer = per;
        SphereWrap.setObjToLatLong(wrap, 'cube', latPer, longPer, dist);
        renderer.render(scene, camera);
        frame += fps * secs;
        frame %= maxFrame;
        lt = now;
    }
}
loop();
