var GRID_SIZE = 40;
var GRID_EDGE_LENGTH = 10;
var FADE_FACTOR = 255 / (GRID_SIZE * 0.8);

function convertColorToString(red, green, blue)
{
    var color = "rgb(";
    color += parseInt(Math.min(red,255)).toString();
    color += ",";
    color += parseInt(Math.min(green,255)).toString();
    color += ",";
    color += parseInt(Math.min(blue,255)).toString();
    color += ")";
    return color;
}

// Constructs a particle object
function Cell(red, green, blue)
{
    this.red = red;
    this.green = green;
    this.blue = blue;
}

// Create an array for the particles
var gridCell = new Array(GRID_SIZE);
var backGridCell = new Array(GRID_SIZE);

// Initialize the particles array and perform the first draw
function initializeFire()
{
    for (i = 0; i < GRID_SIZE; ++i)
    {
        gridCell[i] = new Array(GRID_SIZE);
        backGridCell[i] = new Array(GRID_SIZE);
        for (j = 0; j < GRID_SIZE; ++j)
        {
            gridCell[i][j] = new Cell(0,0,0);
            backGridCell[i][j] = new Cell(0,0,0);
        }
    }

    onResize();
    setInterval(updateFire, 100);
}

function updateFire()
{
    var i;
    var j;
    var canvas = document.getElementById('firecanvas');
    if (canvas.getContext)
    {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width,canvas.height);

        for (i = 0; i < GRID_SIZE; ++i)
        {
            for (j = 1; j < GRID_SIZE; ++j)
            {
                backGridCell[i][j].red = 0;
                backGridCell[i][j].green = 0;
                backGridCell[i][j].blue = 0;
            }
        }

        for (i = 0; i < GRID_SIZE; ++i)
        {
            backGridCell[i][0].red = 127 + (Math.random() * 128);
            backGridCell[i][0].green = 0;
            backGridCell[i][0].blue = 0;
        }

        for (j = 0; j < (GRID_SIZE - 1); ++j)
        {
            for (i = 0; i < GRID_SIZE; ++i)
            {
                var contrib = Math.random();
                var inverseContrib = 1.0 - contrib;
                backGridCell[i][j+1].red  += gridCell[i][j].red * contrib;
                backGridCell[i][j+1].green += gridCell[i][j].green * contrib;
                backGridCell[i][j+1].blue += gridCell[i][j].blue * contrib;
                gridCell[i][j].red *= inverseContrib;
                gridCell[i][j].green *= inverseContrib;
                gridCell[i][j].blue *= inverseContrib;

                if(i > 0 && i < (GRID_SIZE - 1))
                {
                    if(Math.random() <= 0.5)
                    {
                        backGridCell[i+1][j+1].red += gridCell[i][j].red;
                        backGridCell[i+1][j+1].green += gridCell[i][j].green;
                        backGridCell[i+1][j+1].blue += gridCell[i][j].blue;
                    }
                    else
                    {
                        backGridCell[i-1][j+1].red += gridCell[i][j].red;
                        backGridCell[i-1][j+1].green += gridCell[i][j].green;
                        backGridCell[i-1][j+1].blue += gridCell[i][j].blue;
                    }
                }
                else
                {
                    if(i < (GRID_SIZE - 1))
                    {
                        backGridCell[i+1][j+1].red += gridCell[i][j].red;
                        backGridCell[i+1][j+1].green += gridCell[i][j].green;
                        backGridCell[i+1][j+1].blue += gridCell[i][j].blue;
                    }
                    else
                    {
                        backGridCell[i-1][j+1].red += gridCell[i][j].red;
                        backGridCell[i-1][j+1].green += gridCell[i][j].green;
                        backGridCell[i-1][j+1].blue += gridCell[i][j].blue;
                    }
                }
            }
        }

        var temp = gridCell;
        gridCell = backGridCell;
        backGridCell = temp;

        for (i = 0; i < GRID_SIZE; ++i)
        {
            for (j = 0; j < GRID_SIZE; ++j)
            {
                if(gridCell[i][j].red > FADE_FACTOR)
                {
                    gridCell[i][j].red -= FADE_FACTOR;
                }
                else
                {
                    gridCell[i][j].red = 0;
                }

                if(gridCell[i][j].green > FADE_FACTOR)
                {
                    gridCell[i][j].green -= FADE_FACTOR;
                }
                else
                {
                    gridCell[i][j].green = 0;
                }

                if(gridCell[i][j].blue > FADE_FACTOR)
                {
                    gridCell[i][j].blue -= FADE_FACTOR;
                }
                else
                {
                    gridCell[i][j].blue = 0;
                }
                ctx.fillStyle = convertColorToString(gridCell[i][j].red, gridCell[i][j].green, gridCell[i][j].blue);
                ctx.fillRect(i * GRID_EDGE_LENGTH, parseInt(((GRID_SIZE - 0.5) * GRID_EDGE_LENGTH) - j * GRID_EDGE_LENGTH), GRID_EDGE_LENGTH, GRID_EDGE_LENGTH);
            }
        }
    }
}

function onResize()
{
    var canvas = document.getElementById('firecanvas');
    var minDimension = Math.min(window.innerWidth, window.innerHeight) - 25;
    canvas.width = Math.max(minDimension, GRID_SIZE);
    canvas.height = Math.max(minDimension, GRID_SIZE);
    GRID_EDGE_LENGTH = minDimension / (GRID_SIZE + 1);
}