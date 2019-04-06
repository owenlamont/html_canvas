/**
 * Created by Owen on 04/10/2015.
 */

var CAMERA_DIM_X = 900;
var CAMERA_DIM_Y = 900;
var CAMERA_DIM_Z = 2500;

var canvas;
var imageCanvas;
var scene;
var camera;
var renderer;
var animatedGrid;

function onResize()
{
    if(canvas && camera && renderer && imageCanvas)
    {
        canvas.height = Math.max(100,window.innerHeight * 0.55);
        canvas.width  = canvas.height * (CAMERA_DIM_X / CAMERA_DIM_Y);
        imageCanvas.height = Math.max(100,window.innerHeight * 0.35);
        imageCanvas.width = imageCanvas.height;
        camera.aspect = canvas.width  / canvas.height;
        camera.updateProjectionMatrix();
        renderer.setViewport(0, 0, canvas.width, canvas.height);
        renderer.setSize(canvas.width, canvas.height);
    }
}

function initialize()
{
    canvas = document.getElementById('canvas');
    imageCanvas = document.getElementById('imageCanvas');
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-CAMERA_DIM_X/1.5, CAMERA_DIM_X/1.5, -CAMERA_DIM_Y/1.5, CAMERA_DIM_Y/1.5, -CAMERA_DIM_Z/1.5, CAMERA_DIM_Z/1.5);
    camera.position.x = -100;
    camera.position.y = -100;
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
    animatedGrid = new AnimatedGrid(scene, 0xffffff, 50, 50, 16, 16);

    var blackBoxGeometry = new THREE.BoxGeometry(CAMERA_DIM_X * 2, CAMERA_DIM_Y * 2, 1);
    var blackBoxMaterial = new THREE.MeshLambertMaterial({color: 0x000000});
    var blackBoxMesh = new THREE.Mesh(blackBoxGeometry, blackBoxMaterial);
    blackBoxMesh.position.z = 1;
    //scene.add(blackBoxMesh);

    for(var i = 0; i < 50; ++i)
    {
        animatedGrid.addAnimation(CreateAnimationFromImage(animatedGrid, 0.02, 'heightfield', 1000, 0, i, 0, 50, 50));
    }

    for(var i = 0; i < 50; ++i)
    {
        animatedGrid.addAnimation(CreateAnimationFromImage(animatedGrid, 0.02, 'heightfield', 1000, 0, 49, i, 50, 50));
    }

    for(var i = 49; i >= 0; --i)
    {
        animatedGrid.addAnimation(CreateAnimationFromImage(animatedGrid, 0.02, 'heightfield', 1000, 0, i, 49, 50, 50));
    }

    for(var i = 49; i >= 0; --i)
    {
        animatedGrid.addAnimation(CreateAnimationFromImage(animatedGrid, 0.02, 'heightfield', 1000, 0, 0, i, 50, 50));
    }

    render();
}

function render()
{
    requestID = requestAnimationFrame(render);
    animatedGrid.render();
    renderer.render(scene, camera);
    var context=imageCanvas.getContext("2d");
    var image = document.getElementById('heightfield');
    context.clearRect(0,0,imageCanvas.width,imageCanvas.height);
    context.beginPath();
    context.drawImage(image, 0, 0, imageCanvas.width, imageCanvas.height);
    context.strokeStyle = "rgb(255,0,0)";
    var maxXOffset = imageCanvas.width / 2;
    var maxYOffset = imageCanvas.height / 2;

    if(animatedGrid.currentAnimationIndex < 49)
    {
        context.rect(maxXOffset * ((animatedGrid.currentAnimationIndex + 1) / 50), 0, maxXOffset, maxYOffset);
    }
    else if (animatedGrid.currentAnimationIndex < 99)
    {
        context.rect(maxXOffset, maxYOffset * ((animatedGrid.currentAnimationIndex - 49) / 50), maxXOffset, maxYOffset);
    }
    else if(animatedGrid.currentAnimationIndex < 149)
    {
        context.rect(maxXOffset * (1 - ((animatedGrid.currentAnimationIndex - 99) / 50)), maxYOffset, maxXOffset, maxYOffset);
    }
    else if (animatedGrid.currentAnimationIndex < 199)
    {
        context.rect(0, maxYOffset * (1 - ((animatedGrid.currentAnimationIndex - 149) / 50)), maxXOffset, maxYOffset);
    }

    context.stroke();
}