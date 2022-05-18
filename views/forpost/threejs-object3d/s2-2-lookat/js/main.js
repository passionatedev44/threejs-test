(function () {
    // scene
    var scene = new THREE.Scene();
    scene.add( new THREE.GridHelper(10, 10) )
 
    // camera
    var camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.5, 100);
    camera.position.set(2, 2, 2);
    camera.lookAt(0, 0, 0);
 
    var mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshNormalMaterial());
    scene.add(mesh);
    // making the mesh look at the position of the camera
    mesh.lookAt(camera.position);
 
    // render
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(640, 480);
    document.getElementById('demo').appendChild(renderer.domElement);
    renderer.render(scene, camera);
}
    ());