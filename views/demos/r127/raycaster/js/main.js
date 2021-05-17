var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(1, 1);

function onMouseMove( event ) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    var canvas = event.target,
    box = canvas.getBoundingClientRect(),
    x = event.clientX - box.left,
    y = event.clientY - box.top;
    // set mouse Vector2 values
    mouse.x = ( x / canvas.scrollWidth ) * 2 - 1;
    mouse.y = - ( y / canvas.scrollHeight ) * 2 + 1;
    //console.log(mouse.x.toFixed(2), mouse.y.toFixed(2));
};

// creating a scene
var scene = new THREE.Scene();
scene.add(new THREE.GridHelper(9, 9));


var boxGroup = new THREE.Group();
scene.add(boxGroup);

// box 1
var box = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshNormalMaterial());
box.position.set(0, 0, 0);
boxGroup.add(box);
// box 2
box = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshNormalMaterial());
box.position.set(3, 0, 0);
boxGroup.add(box);
// box 3
box = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshNormalMaterial());
box.position.set(-3, 0, 0);
boxGroup.add(box);


// camera and renderer
var camera = new THREE.PerspectiveCamera(60, 320 / 240, 0.1, 1000);
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(640, 480);
document.getElementById('demo').appendChild(renderer.domElement);


renderer.domElement.addEventListener( 'mousemove', onMouseMove, false );


// loop
var lt = new Date(),
//frame = 0,
//maxFrame = 300,
fps = 5;
var loop = function () {
    var now = new Date(),
    //per = frame / maxFrame,
    //bias = 1 - Math.abs(per - 0.5) / 0.5,
    secs = (now - lt) / 1000;
    requestAnimationFrame(loop);
    if (secs > 1 / fps) {

        // default scale
        boxGroup.children.forEach(function(obj){
            obj.scale.set(1, 1, 1);
        });

        // update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );
        var intersects = raycaster.intersectObjects(boxGroup.children, true );
        if(intersects.length > 0){
            var mesh = intersects[0].object;
            mesh.scale.set(2, 2, 2);
        }

        // render
        renderer.render(scene, camera);
        //frame += fps * secs;
        //frame %= maxFrame;
        lt = now;
    }
}
loop();


