/**
 * Created by Owen on 04/10/2015.
 */

function GridCell(position, mesh)
{
    this.position = new THREE.Vector3(position.x, position.y, position.z);
    this.offset = 0;
    this.mesh = mesh;
}

function AnimatedGrid(scene, boxColor, xDim, yDim, cellSize, cellDepth)
{
    this.GRID_DIM_X = xDim;
    this.GRID_DIM_Y = yDim;
    this.GRID_CELL_SIZE = cellSize;
    this.GRID_SIZE_X = this.GRID_DIM_X * this.GRID_CELL_SIZE;
    this.GRID_SIZE_Y = this.GRID_DIM_Y * this.GRID_CELL_SIZE;
    this.gridAnimation = [];
    this.currentAnimationIndex = 0;
    this.repeat = true;
    var gridBoxGeometry = new THREE.BoxGeometry(this.GRID_CELL_SIZE * 0.5, this.GRID_CELL_SIZE * 0.5, cellDepth * 0.5);
    var gridBoxMaterial = new THREE.MeshLambertMaterial({color: boxColor});

    // Create the arrays for the grid cells
    this.gridCell = new Array(this.GRID_DIM_X);
    for (var x = 0; x < this.GRID_DIM_X; ++x)
    {
        this.gridCell[x] = new Array(this.GRID_DIM_Y);
        for (var y = 0; y < this.GRID_DIM_Y; ++y)
        {
            this.gridCell[x][y] = new GridCell(new THREE.Vector3(this.GRID_CELL_SIZE*0.5 + x * this.GRID_CELL_SIZE - this.GRID_SIZE_X * 0.5,this.GRID_CELL_SIZE*0.5 + y * this.GRID_CELL_SIZE - this.GRID_SIZE_Y * 0.5, 0), new THREE.Mesh(gridBoxGeometry, gridBoxMaterial));
            this.gridCell[x][y].mesh.position.copy(this.gridCell[x][y].position);
            scene.add(this.gridCell[x][y].mesh);
        }
    }
}

AnimatedGrid.prototype.addAnimation = function(animation)
{
    this.gridAnimation.push(animation);
}

AnimatedGrid.prototype.animate = function()
{
    if(this.gridAnimation.length > 0)
    {
        if(this.gridAnimation[this.currentAnimationIndex].complete)
        {
            this.gridAnimation[this.currentAnimationIndex].complete = false;
            if(this.currentAnimationIndex < (this.gridAnimation.length - 1))
            {
                ++this.currentAnimationIndex;
            }
            else if(this.repeat)
            {
                this.currentAnimationIndex = 0;
            }
        }

        if(!this.gridAnimation[this.currentAnimationIndex].complete)
        {
            if(!this.gridAnimation[this.currentAnimationIndex].started)
            {
                for (var x = 0; x < this.GRID_DIM_X; ++x)
                {
                    for (var y = 0; y < this.GRID_DIM_Y; ++y)
                    {
                        this.gridAnimation[this.currentAnimationIndex].cellTargets[x][y].startOffset = this.gridCell[x][y].offset;
                    }
                }
            }

            this.gridAnimation[this.currentAnimationIndex].animate();
        }

        for (var x = 0; x < this.GRID_DIM_X; ++x)
        {
            for (var y = 0; y < this.GRID_DIM_Y; ++y)
            {
                this.gridCell[x][y].offset = this.gridAnimation[this.currentAnimationIndex].cellTargets[x][y].offset;
                this.gridCell[x][y].mesh.position.z = this.gridCell[x][y].position.z + this.gridCell[x][y].offset;
            }
        }
    }
}

AnimatedGrid.prototype.render = function()
{
    this.animate();

    for (var x = 0; x < this.GRID_DIM_X; ++x)
    {
        for (var y = 0; y < this.GRID_DIM_Y; ++y)
        {
            this.gridCell[x][y].mesh.position.z = this.gridCell[x][y].position.z + this.gridCell[x][y].offset;
        }
    }
}

function CellAnimationTarget(startTimeRelative, endTimeRelative, targetOffset)
{
    this.startTimeRelative = startTimeRelative;
    this.endTimeRelative = endTimeRelative;
    this.targetOffset = targetOffset;
    this.startOffset = 0;
    this.offset = 0;

}

function GridAnimation(cellTargets, duration)
{
    this.cellTargets = cellTargets;
    this.duration = duration;
    this.startTimeAbsolute = 0;
    this.started = false;
    this.complete = false;
}

GridAnimation.prototype.animate = function()
{
    var currentAbsoluteTimeSeconds = Date.now() / 1000;

    if(!this.started)
    {
        this.startTimeAbsolute = currentAbsoluteTimeSeconds;
        for (var x = 0; x < this.cellTargets.length; ++x)
        {
            for (var y = 0; y < this.cellTargets[x].length; ++y)
            {
                this.cellTargets[x][y].offset = this.cellTargets[x][y].startOffset;
            }
        }
        this.started = true;
    }
    else if(!this.complete)
    {
        var currentTimeRelative = currentAbsoluteTimeSeconds - this.startTimeAbsolute;
        this.complete = true;
        if(currentTimeRelative < this.duration)
        {
            for (var x = 0; x < this.cellTargets.length; ++x)
            {
                for (var y = 0; y < this.cellTargets[x].length; ++y)
                {
                    if(this.cellTargets[x][y].endTimeRelative < currentTimeRelative)
                    {
                        this.cellTargets[x][y].offset = this.cellTargets[x][y].targetOffset;
                    }
                    else if(this.cellTargets[x][y].startTimeRelative < currentTimeRelative)
                    {
                        this.complete = false;
                        this.cellTargets[x][y].offset = this.cellTargets[x][y].startOffset + (this.cellTargets[x][y].targetOffset - this.cellTargets[x][y].startOffset) * ((currentTimeRelative - this.cellTargets[x][y].startTimeRelative)/(this.cellTargets[x][y].endTimeRelative - this.cellTargets[x][y].startTimeRelative));
                    }
                    else
                    {
                        this.complete = false;
                    }
                }
            }
        }
    }

    if(this.complete)
    {
        this.started = false;
        for (var x = 0; x < this.cellTargets.length; ++x)
        {
            for (var y = 0; y < this.cellTargets[x].length; ++y)
            {
                this.cellTargets[x][y].offset = this.cellTargets[x][y].targetOffset;
            }
        }
    }
}

function CreateLeftToRightAnimation(grid, duration, offset)
{
    var cellAnimation = new Array(grid.GRID_DIM_X);
    var startTime = 0;
    for (var x = 0; x < grid.GRID_DIM_X; ++x)
    {
        var endTime = startTime + duration / grid.GRID_DIM_X;
        cellAnimation[x] = new Array(grid.GRID_DIM_Y);
        for (var y = 0; y < grid.GRID_DIM_Y; ++y)
        {
            cellAnimation[x][y] = new CellAnimationTarget(startTime, endTime, offset);
        }
        startTime = endTime;
    }

    return new GridAnimation(cellAnimation, duration);
}

function CreateRightToLeftAnimation(grid, duration, offset)
{
    var cellAnimation = new Array(grid.GRID_DIM_X);
    var startTime = 0;
    for (var x = grid.GRID_DIM_X - 1; x >= 0; --x)
    {
        var endTime = startTime + duration / grid.GRID_DIM_X;
        cellAnimation[x] = new Array(grid.GRID_DIM_Y);
        for (var y = 0; y < grid.GRID_DIM_Y; ++y)
        {
            cellAnimation[x][y] = new CellAnimationTarget(startTime, endTime, offset);
        }
        startTime = endTime;
    }

    return new GridAnimation(cellAnimation, duration);
}

function CreateAnimationFromImage(grid, duration, imageName, scale, offset, xOffset, yOffset, xDim, yDim)
{
    var offscreen = document.createElement('canvas');
    var context=offscreen.getContext("2d");
    var image = document.getElementById(imageName);
    offscreen.width = xDim;
    offscreen.height = yDim;
    context.drawImage(image, xOffset, yOffset, xDim, yDim, 0, 0, image.width, image.height);
    var imgd = context.getImageData(0, 0, xDim, yDim);
    var pix = imgd.data;

    var cellAnimation = new Array(grid.GRID_DIM_X);
    var i = 0;
    for (var x = 0; x < grid.GRID_DIM_X; ++x)
    {
        cellAnimation[x] = new Array(grid.GRID_DIM_Y);
    }

    for (var y = 0; y < grid.GRID_DIM_Y; ++y)
    {
        for (var x = 0; x < grid.GRID_DIM_X; ++x)
        {
            cellAnimation[x][y] = new CellAnimationTarget(0, duration, ((pix[i]*scale)/255) + offset);
            i += 4
        }
    }

    return new GridAnimation(cellAnimation, duration);
}

function CreateLeftToRightAnimationFromImage(grid, duration, imageName, scale, offset, xOffset, yOffset, xDim, yDim)
{
    var imageAnimation = CreateAnimationFromImage(grid, duration, imageName, scale, offset, xOffset, yOffset, xDim, yDim);
    var startTime = 0;
    for (var x = 0; x < xDim; ++x)
    {
        var endTime = startTime + duration / grid.GRID_DIM_X;
        for (var y = 0; y < yDim; ++y)
        {
            imageAnimation.cellTargets[x][y].startTimeRelative = startTime;
            imageAnimation.cellTargets[x][y].endTimeRelative = endTime;
        }
        startTime = endTime;
    }

    return imageAnimation;
}