// scene
var scene = new THREE.Scene();

// mesh
var box = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({
            color: new THREE.Color(1, 1, 1),
            emissiveIntensity: 0.8,
            emissive: new THREE.Color(1, 0, 0)
        }));
scene.add(box);

// light
var light = new THREE.PointLight(new THREE.Color(1, 1, 1));
light.position.set(1, 3, 2);
scene.add(light);

// camera, render
var camera = new THREE.PerspectiveCamera(60, 320 / 240, 0.1, 1000);
camera.position.set(1, 1, 1);
camera.lookAt(0, 0, 0);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(640, 480);
document.getElementById('demo').appendChild(renderer.domElement);
renderer.render(scene, camera);
