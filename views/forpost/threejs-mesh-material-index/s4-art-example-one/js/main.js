(function () {
    //-------- ----------
    // SCENE, CAMERA, RENDERER
    //-------- ----------
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, 4 / 3, .5, 1000);
    camera.position.set(2, 2, 4);
    camera.lookAt(0, 0, 0);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(640, 480);
    document.getElementById('demo').appendChild(renderer.domElement);
    //-------- ----------
    // LIGHT
    //-------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 0.2);
    dl.position.set(3, 2, 1);
    scene.add(dl);
    const al = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(al);
    const pl = new THREE.PointLight(0xffffff, 1);
    pl.position.set(-3, 2, -3);
    scene.add(pl);
    //-------- ----------
    // PLANE MATERIAL INDEX DATA
    //-------- ----------
    const images = [
        [
            1,2,2,0,0,0,0,0,0,0,0,0,0,2,2,1,
            2,2,0,0,0,1,1,2,2,1,1,0,0,0,2,2,
            2,0,0,0,1,2,2,0,0,2,2,1,0,0,0,2,
            0,0,0,1,2,0,0,0,0,0,0,2,1,0,0,0,
            0,0,0,2,0,1,2,0,0,2,1,0,2,0,0,0,
            0,0,0,0,0,1,2,0,0,2,1,0,0,0,0,0,
            0,0,0,0,1,1,2,0,0,2,1,1,0,0,0,0,
            0,0,0,0,1,1,2,0,0,2,1,1,0,0,0,0,
            0,0,0,0,2,2,2,1,1,2,2,2,0,0,0,0,
            0,0,0,0,0,0,2,1,1,2,0,0,0,0,0,0,
            0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,
            0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,
            0,0,0,0,2,1,1,1,1,1,1,0,0,0,0,0,
            2,0,0,0,0,2,2,1,1,2,2,0,0,0,0,2,
            2,2,0,0,0,0,0,2,2,0,0,0,0,0,2,2,
            1,2,2,0,0,0,0,0,0,0,0,0,0,2,2,1
        ],
        [
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,1,1,1,2,0,1,1,1,2,0,0,0,
            0,0,0,0,0,2,2,1,1,2,2,2,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,1,1,0,2,1,1,0,0,0,0,0,
            0,0,0,1,1,1,1,0,2,1,1,1,1,2,0,0,
            0,0,0,2,2,2,2,2,2,2,2,2,2,0,0,0,
            0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,
            0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,
            0,0,0,0,0,1,2,0,0,2,1,0,0,0,0,0,
            0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
        ]
    ]
    //-------- ----------
    // HELPERS
    //-------- ----------
    // create a plane geo with groups set up to work with images
    const createPlaneGeo = () => {
        const geometry = new THREE.PlaneGeometry(5, 5, 16, 16);
        geometry.rotateX(Math.PI * 1.5);
        let pxIndex = 0, len = 256;
        while(pxIndex < len){
            geometry.addGroup(pxIndex * 6, 6, 0);
            pxIndex += 1;
        }
        return geometry;
    };
    // update plane geo to given imageindex and images array
    const updatePlaneGeo = (geometry, images, imageIndex) => {
        const img = images[imageIndex];
        let pxIndex = 0, len = 256;
        while(pxIndex < len){
            const group = geometry.groups[pxIndex]
            group.materialIndex = img[pxIndex];
            pxIndex += 1;
        }
        return geometry;
    };
    const mkMaterial = (color, opacity, texture) => {
        return new THREE.MeshPhongMaterial({
            color: color,
            map: texture || null,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: opacity
        })
    };
    // create plane mesh to use with images
    const createPlaneMesh = () => {
        // new plane geometry
        var geometry = createPlaneGeo(images, 1);
        var mesh = new THREE.Mesh(
            // geometry as first argument
            geometry,
            // array of materials as the second argument
            [
                mkMaterial(0xffffff, 1, null),
                mkMaterial(0x000000, 1, null),
                mkMaterial(0x888888, 1, null)
            ]
        );
        return mesh;
    };
    //-------- ----------
    // MESH
    //-------- ----------
    var mesh = new THREE.Mesh(
        // geometry as first argument
        new THREE.BoxGeometry(1, 1, 1),
        // array of materials as the second argument
        [
            mkMaterial(0xff0000, 1),
            mkMaterial(0x00ff00, 1),
            mkMaterial(0x0000ff, 1),
            mkMaterial(0xff00ff, 1),
            mkMaterial(0xffff00, 1),
            mkMaterial(0x00ffff, 1)
        ]
    );
    mesh.position.set(0, 1.5, 0);
    scene.add(mesh);
    // plane
    const plane = createPlaneMesh();
    updatePlaneGeo(plane.geometry, images, 0);
    scene.add(plane);
    // sphere
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(200, 30, 15),
        new THREE.MeshBasicMaterial({wireframe:true, wireframeLinewidth: 3}))
    scene.add(sphere);
    // ---------- ----------
    // ANIMATION LOOP
    // ---------- ----------
    const FPS_UPDATE = 20, // fps rate to update ( low fps for low CPU use, but choppy video )
    FPS_MOVEMENT = 30;     // fps rate to move object by that is independent of frame update rate
    FRAME_MAX = 300;
    let secs = 0,
    frame = 0,
    lt = new Date();
    // update
    const update = function(frame, frameMax){
        const alpha = frame / frameMax;

        updatePlaneGeo(plane.geometry, images, [0,1,0,1,0,1][ Math.floor(alpha * 6)] );
        mesh.rotation.y = Math.PI * 2 * alpha;
        sphere.rotation.y = Math.PI * 2 * alpha;
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
}
    ());