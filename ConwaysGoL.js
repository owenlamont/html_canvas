var GRID_SIZE = 40;
var GRID_EDGE_LENGTH = 10;

// Constructs a particle object
function Cell(alive, liveNeghbours)
{
    this.alive = alive;
    this.liveNeighbours = liveNeghbours;
}

// Create an array for the particles
var gridCell = new Array(GRID_SIZE);
var backGridCell = new Array(GRID_SIZE);

// Update an index to be within the grid bounds
function BoundsCheckIndex(index)
{
    var newIndex = index;

    if(index < 0)
    {
        newIndex = GRID_SIZE - 1;
    }
    else
    {
        newIndex = index % GRID_SIZE;
    }

    return newIndex;
}

// Increment the alive neighbour counts of all cell's adjacent to pos i, j
function UpdateNeighbourCounts(gridCells, i, j)
{
    var iMinus = BoundsCheckIndex(i - 1);
    var iPlus = BoundsCheckIndex(i + 1);
    var jMinus = BoundsCheckIndex(j - 1);
    var jPlus = BoundsCheckIndex(j + 1);

    ++gridCells[iMinus][jMinus].liveNeighbours;
    ++gridCells[iMinus][j].liveNeighbours;
    ++gridCells[iMinus][jPlus].liveNeighbours;
    ++gridCells[i][jMinus].liveNeighbours;
    ++gridCells[i][jPlus].liveNeighbours;
    ++gridCells[iPlus][jMinus].liveNeighbours;
    ++gridCells[iPlus][j].liveNeighbours;
    ++gridCells[iPlus][jPlus].liveNeighbours;
}

// Initialize the grid array and perform the first draw
function initializeGOL()
{
    for (i = 0; i < GRID_SIZE; ++i)
    {
        gridCell[i] = new Array(GRID_SIZE);
        backGridCell[i] = new Array(GRID_SIZE);
        for (j = 0; j < GRID_SIZE; ++j)
        {
            gridCell[i][j] = new Cell(false, 0);
            backGridCell[i][j] = new Cell(false, 0);
        }
    }

    reRandomize();
    onResize();
    render();
    setInterval(updateGOL, 100);
}

// Randomize the live values of all grid cells
function reRandomize()
{
    for (i = 0; i < GRID_SIZE; ++i)
    {
        for (j = 0; j < GRID_SIZE; ++j)
        {
            if(Math.random() > 0.5)
            {
                gridCell[i][j].alive = true;
                UpdateNeighbourCounts(gridCell, i, j);
            }
        }
    }
}

// Render the grid cells
function render()
{
    var i;
    var j;
    var canvas = document.getElementById('canvas');
    if (canvas.getContext)
    {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for (i = 0; i < GRID_SIZE; ++i)
        {
            for (j = 0; j < GRID_SIZE; ++j)
            {
                if(gridCell[i][j].alive)
                {
                    ctx.fillStyle = "rgb(255,255,255)";
                }
                else
                {
                    ctx.fillStyle = "rgb(0,0,0)";
                }

                ctx.fillRect(i * GRID_EDGE_LENGTH, parseInt(((GRID_SIZE - 0.5) * GRID_EDGE_LENGTH) - j * GRID_EDGE_LENGTH), GRID_EDGE_LENGTH, GRID_EDGE_LENGTH);
            }
        }
    }
}

// Create a new generation of live/dead cells
function updateGOL()
{
    var i;
    var j;

    for (i = 0; i < GRID_SIZE; ++i)
    {
        for (j = 0; j < GRID_SIZE; ++j)
        {
            backGridCell[i][j].alive = false;
            backGridCell[i][j].liveNeighbours = 0;
        }
    }

    for (i = 0; i < GRID_SIZE; ++i)
    {
        for (j = 0; j < GRID_SIZE; ++j)
        {
            if(gridCell[i][j].liveNeighbours < 2 || gridCell[i][j].liveNeighbours > 3)
            {
                backGridCell[i][j].alive = false;
            }
            else if((gridCell[i][j].alive == false && gridCell[i][j].liveNeighbours == 3) || (gridCell[i][j].alive == true && (gridCell[i][j].liveNeighbours == 2 || gridCell[i][j].liveNeighbours == 3)))
            {
                backGridCell[i][j].alive = true;
                UpdateNeighbourCounts(backGridCell, i, j);
            }
        }
    }

    var temp = gridCell;
    gridCell = backGridCell;
    backGridCell = temp;

    render();
}

// Handle the browser window resizing
function onResize()
{
    var canvas = document.getElementById('canvas');
    var minDimension = Math.min(window.innerWidth, window.innerHeight) - 25;
    canvas.width = Math.max(minDimension, GRID_SIZE);
    canvas.height = Math.max(minDimension, GRID_SIZE);
    GRID_EDGE_LENGTH = minDimension / (GRID_SIZE + 1);
}