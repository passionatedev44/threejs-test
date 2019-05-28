
// SCENE
var scene = new THREE.Scene();

// CAMERA
var camera = new THREE.PerspectiveCamera(75, 320 / 240, 1, 1000);
camera.position.set(25, 25, 25);
camera.lookAt(0, 0, 0);
// MESH
var mesh = new THREE.Mesh(
        new THREE.BoxGeometry(20, 20, 20),
        new THREE.MeshStandardMaterial({
            color: 0xff0000
        }));
scene.add(mesh);
mesh.position.set(0, 0, 60);
camera.lookAt(mesh.position);

// add AmbientLight
var light = new THREE.AmbientLight(0xffffff);
scene.add(light);

var pointLight = new THREE.PointLight(0xffffff);
scene.add(pointLight);

var lightProbe = new THREE.LightProbe();
console.log(mesh);
scene.add(lightProbe);

// LOAD CUBE TEXTURE
new THREE.CubeTextureLoader()
.setPath('/img/cube/skybox/')
.load(

    // urls of images used in the cube texture
    [
        'px.jpg',
        'nx.jpg',
        'py.jpg',
        'ny.jpg',
        'pz.jpg',
        'nz.jpg'
    ],

    // what to do when loading is over
    function (cubeTexture) {

    scene.background = cubeTexture;

    console.log(THREE.LightProbeGenerator)
    console.log(lightProbe.copy);

    // RENDERER
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(320, 240);

    //renderer.physicallyCorrectLights = true;
    document.getElementById('demo').appendChild(renderer.domElement);
    renderer.render(scene, camera);

});
