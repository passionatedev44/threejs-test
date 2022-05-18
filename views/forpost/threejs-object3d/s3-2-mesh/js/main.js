(function () {
    // scene, renderer
    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(640, 480);
    document.getElementById('demo').appendChild(renderer.domElement); 
    var gridHelper = new THREE.GridHelper(4, 4);
    gridHelper.scale.set(2.5, 2.5, 2.5);
    scene.add(gridHelper);
    var camera = new THREE.PerspectiveCamera(45, 4 / 3, .5, 100);
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    // MESH OBJECTS ARE BASED OFF OF OBJECT3D
    var box = new THREE.Mesh(
            new THREE.BoxGeometry(1, 5, 2),
            new THREE.MeshNormalMaterial());
    scene.add(box);
    // state object
    var state = {
        frame: 0,
        maxFrame: 100,
        fps: 30,
        lt: new Date()
    };
    // UPDATING THE CAMERA WITH object3d properties and methods
    var update = function (state, secs) {
        var e = new THREE.Euler();
        e.y = Math.PI * 2 * state.per;
        e.x = Math.PI * 0.5 * Math.sin( Math.PI * 0.25 * state.bias );
        box.position.copy( new THREE.Vector3(1, 0, 0).applyEuler(e).normalize().multiplyScalar(3) );
        box.lookAt(0, 0, 0);
    };
    // loop
    var loop = function () {
        state.per = state.frame / state.maxFrame;
        state.bias = 1 - Math.abs(state.per - 0.5) / 0.5;
        var now = new Date();
        secs = (now - state.lt) / 1000;
        requestAnimationFrame(loop);
        if (secs > 1 / state.fps) {
            update(state, secs);
            renderer.render(scene, camera);
            state.frame += state.fps * secs;
            state.frame %= state.maxFrame;
            state.lt = now;
        }
    };
    loop();
}
    ());