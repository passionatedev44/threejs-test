(function(){
    // ---------- ----------
    // SCENE, CAMERA, RENDERER
    // ---------- ----------
    const scene = new THREE.Scene();
    scene.add( new THREE.GridHelper(10, 10) );
    const camera = new THREE.PerspectiveCamera(50, 32 / 24, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGL1Renderer();
    renderer.setSize(640, 480, false);
    (document.getElementById('demo') || document.body).appendChild(renderer.domElement);
    // ---------- ----------
    // TWO GEOS ONE INDEX ONE NOT INDEXED
    // ---------- ----------
    const geo_index = new THREE.BoxGeometry(1,1,1);
    const geo_noindex = geo_index.clone().toNonIndexed();
    console.log(geo_index.index);   // ( buffer attribute object )
    console.log(geo_noindex.index); // null
    // ---------- ----------
    // MESH OBJECTS USING EACH GEO
    // ---------- ----------
    const material = new THREE.MeshNormalMaterial();
    const mesh1 = new THREE.Mesh(geo_index, material);
    const mesh2 = new THREE.Mesh(geo_noindex, material);
    scene.add(mesh1);
    scene.add(mesh2);
    mesh1.position.set(-1, 0, 0);
    mesh2.position.set(1, 0, 0);
    // ---------- ----------
    // ANIMATION LOOP
    // ---------- ----------
    const FPS_UPDATE = 20, // fps rate to update ( low fps for low CPU use, but choppy video )
    FPS_MOVEMENT = 30;     // fps rate to move object by that is independent of frame update rate
    FRAME_MAX = 120;
    let secs = 0,
    frame = 0,
    lt = new Date();
    // update
    const update = function(frame, frameMax){
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
}());