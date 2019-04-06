/**
 * Created by Owen on 04/10/2015.
 */

var CAMERA_DIM_X = 1000;
var CAMERA_DIM_Y = 600;
var CAMERA_DIM_Z = 2000;

var canvas;
var scene;
var camera;
var renderer;
var animatedGrid;

function onResize()
{
    if(canvas && camera && renderer)
    {
        canvas.height = Math.max(100,window.innerHeight / 2);
        canvas.width  = canvas.height * (CAMERA_DIM_X / CAMERA_DIM_Y);
        camera.aspect = canvas.width  / canvas.height;
        camera.updateProjectionMatrix();
        renderer.setViewport(0, 0, canvas.width, canvas.height);
        renderer.setSize(canvas.width, canvas.height);
    }
}

function initialize()
{
    canvas = document.getElementById('canvas');
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-CAMERA_DIM_X/2, CAMERA_DIM_X/2, -CAMERA_DIM_Y/2, CAMERA_DIM_Y/2, -CAMERA_DIM_Z/2, CAMERA_DIM_Z/2);
    camera.position.x = -300;
    camera.position.y = 300;
    camera.position.z = 500;
    camera.lookAt(scene.position);
    renderer = new THREE.WebGLRenderer({canvas: canvas});
    onResize();
    renderer.setViewport(0, 0, canvas.width, canvas.height);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-1, 1, -1);
    scene.add(directionalLight);
    var ambientLight = new THREE.AmbientLight( 0x707070 ); // soft white light
    scene.add( ambientLight );
    animatedGrid = new AnimatedGrid(scene, 0xffffff, 33, 11, 30, 30);

    var blackBoxGeometry = new THREE.BoxGeometry(CAMERA_DIM_X * 2, CAMERA_DIM_Y * 2, 1);
    var blackBoxMaterial = new THREE.MeshLambertMaterial({color: 0x000000});
    var blackBoxMesh = new THREE.Mesh(blackBoxGeometry, blackBoxMaterial);
    blackBoxMesh.position.z = 20;
    scene.add(blackBoxMesh);


    animatedGrid.addAnimation(CreateRightToLeftAnimation(animatedGrid, 2, 50));
    animatedGrid.addAnimation(CreateLeftToRightAnimationFromImage(animatedGrid, 2, 'AALogo', 50, 0, 0, 0, 33, 11));
    animatedGrid.addAnimation(CreateLeftToRightAnimation(animatedGrid, 2, 50));
    animatedGrid.addAnimation(CreateRightToLeftAnimation(animatedGrid, 2, 0));
    animatedGrid.addAnimation(CreateRightToLeftAnimation(animatedGrid, 1, 0));

    render();
}

function render()
{
    requestID = requestAnimationFrame(render);
    animatedGrid.render();
    renderer.render(scene, camera);
}