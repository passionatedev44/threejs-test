

(function () {

    // Wave grid helper
    var waveGrid = function (opt) {

        opt = opt || {};
        opt.width = opt.width || 20;
        opt.depth = opt.depth || 20;
        opt.height = opt.height || 1;
        opt.forPoint = opt.forPoint || function () {};
        opt.context = opt.context || opt;
        opt.xStep = opt.xStep || 0.075;
        opt.yStep = opt.yStep || 0.1;
        opt.zStep = opt.zStep || 0.075;
        opt.waveOffset = opt.waveOffset === undefined ? 0 : opt.waveOffset;

        var points = [],
        radPer,
        x = 0,
        i = 0,
        y,
        z;

        // points
        while (x < opt.width) {

            z = 0;
            while (z < opt.depth) {

                // radian percent
                radPer = (z / opt.depth + (1 / opt.width * x) + opt.waveOffset) % 1;

                // y value of point
                y = Math.cos(Math.PI * 4 * radPer) * opt.height;

                // call forPoint
                opt.forPoint.call(opt.context, x * opt.xStep, y * opt.yStep, z * opt.zStep, i);

                // step z, and point index
                z += 1;
                i += 3;
            }
            x += 1;
        };

    };

    // make a new Float32Array of Points to make a buffered geometry
    var makeWaveGrid = function (opt) {
        opt = opt || {};
        var points = [];
        opt.forPoint = function (x, y, z, i) {
            points.push(x, y, z);
        };
        waveGrid(opt);
        return new Float32Array(points);
    };

    // make a points mesh
    var makePoints = function () {

        var geometry = new THREE.BufferGeometry();

        var vertices = makeWaveGrid();

        // itemSize = 3 because there are 3 values (components) per vertex
        geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));

        return new THREE.Points(

            // geometry as first argument
            geometry,

            // then Material
            new THREE.PointsMaterial({

                size: .05

            }));

    };

    // update points
    var updatePoints = function (points, per) {

        var position = points.geometry.getAttribute('position'),
        bias = 1 - Math.abs(per - 0.5) / .5;

        // update points
        waveGrid({
            waveOffset: per,
            forPoint: function (x, y, z, i) {
                position.array[i] = x - 2;
                position.array[i + 1] = y - 2;
                position.array[i + 2] = z - 2;
            }
        });
        position.needsUpdate = true;

    }

    // RENDER
    var renderer = new THREE.WebGLRenderer({
            antialias: true
        });
    renderer.setSize(320, 240);
    document.getElementById('demo').appendChild(renderer.domElement);

    // SCENE
    var scene = new THREE.Scene();

    var points = makePoints();

    scene.add(points);

    // CAMERA
    var camera = new THREE.PerspectiveCamera(40, 320 / 240, .001, 1000);
    camera.position.set(2, 2, 2);

    // CONTROLS
    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    renderer.render(scene, camera);

    // LOOP
    var frame = 0,
    maxFrame = 100;
    var loop = function () {

        requestAnimationFrame(loop);

        updatePoints(points, frame / maxFrame);

        renderer.render(scene, camera);

        frame += 1;
        frame %= maxFrame;

    };

    loop();

}
    ());
