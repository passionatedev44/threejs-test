(function () {
    // SCENE, CAMERA, RENDERER
    var scene = new THREE.Scene();
    scene.background = new THREE.Color('#0f0f0f');
    var camera = new THREE.PerspectiveCamera(50, 320 / 240, 0.1, 1000);
    camera.position.set(5, 8, 12);
    camera.lookAt(0,0,0);
    var renderer = new THREE.WebGLRenderer();
    document.getElementById('demo').appendChild(renderer.domElement);
    renderer.setSize(640, 480);
    // SPOTLIGHT
    var color = new THREE.Color('white'),
    intensity = 1,
    distance = 30,
    angle = Math.PI * 0.05,
    penumbra = 0.25,
    decay = 0.5;
    var spotLight = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
    spotLight.position.set(8, 8, 0);
    scene.add(spotLight);
    scene.add( new THREE.AmbientLight(0xffffff, 0.07));
   // MESH OBJECTS
    var cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({
                color: 0xff0000
            }));
    cube.position.set(0, 1, 0);
    scene.add(cube);
    var floor = new THREE.Mesh(
            new THREE.BoxGeometry(10, 1, 10),
            new THREE.MeshStandardMaterial({
                color: 0x008800
            }));
    scene.add(floor);
    // ---------- ----------
    // CALLING RENDER OF RENDERER IN AN ANIMATION LOOP
    // ---------- ----------
    // APP LOOP
    var secs = 0,
    fps_update = 30,   // fps rate to update ( low fps for low CPU use, but choppy video )
    fps_movement = 60, // fps rate to move camera
    frame = 0,
    frameMax = 600,
    lt = new Date(),
    spotTarget = new THREE.Object3D(); // spotlight target
    spotLight.target = spotTarget; // set spotLight target for spotLight
    scene.add(spotTarget); // add spotLight target to the scene
    // update
    var update = function(){
        var per = Math.round(frame) / frameMax,
        bias = 1 - Math.abs(0.5 - per) / 0.5,
        radian = Math.PI * 2 * per,
        x = Math.cos(radian) * 8, 
        y = 10,
        z = Math.sin(radian) * 8;
        spotLight.position.set(x, y, z);
        spotTarget.position.set(0, 0, -3 + 6 * bias);
    };
    // loop
    var loop = function () {
        var now = new Date(),
        secs = (now - lt) / 1000;
        requestAnimationFrame(loop);
        if(secs > 1 / fps_update){
            update();
            renderer.render(scene, camera);
            frame += fps_movement * secs;
            frame %= frameMax;
            lt = now;
        }
    };
    loop();
 
}
    ());