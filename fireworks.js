var NUM_ROCKETS = 20;
var NUM_SPARKLES_PER_ROCKET = 100;
var m_maxExplosionPower = 1.5;
var m_maxInitialVerticalVelocity;
var m_maxInitialHorizontalVelocity;
var verticalAcceleration = 0.1;

// Contructs a 2D vector object
function Vector2D(x, y)
{
    this.x = x;
    this.y = y;
}

// Constructs a rocket object
function Rocket(position, velocity)
{
    this.position = new Vector2D(position.x, position.y);
    this.velocity = new Vector2D(velocity.x, velocity.y);
    this.exploded = false;
    this.activeSparkles = 0;
    this.sparkles = new Array(NUM_SPARKLES_PER_ROCKET);
    this.alpha = 1.0;
    this.color = "rgba(0,0,0,";
}

// Constructs a sparkle object
function Sparkle(position, velocity)
{
    this.position = new Vector2D(position.x, position.y);
    this.velocity = new Vector2D(velocity.x, velocity.y);
}

// Creates a random color intensity in the range 0 - 255
function randomColorIntensity()
{
    var intensity = parseInt(Math.random() * 255);
    return intensity.toString();
}//end function randomColorIntensity

// Resets a rocket back to its firing position
function resetRocket(rocket)
{
    rocket.alpha = 1.0;
    rocket.position.x = (window.innerWidth - 25)/ 2;
    rocket.position.y = (window.innerHeight - 25);
    rocket.velocity.x = (Math.random() - 0.5) * m_maxInitialHorizontalVelocity;
    rocket.velocity.y = (0.5 + 0.5 * Math.random()) * m_maxInitialVerticalVelocity;
    rocket.exploded = false;
    rocket.activeSparkles = NUM_SPARKLES_PER_ROCKET;
    rocket.color = "rgba(";
    rocket.color += randomColorIntensity();
    rocket.color += ",";
    rocket.color += randomColorIntensity();
    rocket.color += ",";
    rocket.color += randomColorIntensity();
    rocket.color += ",";
}//end function resetRocket

// Updates the position of a rocket or sparkle
function moveParticle(particle, gravity)
{
    particle.velocity.y += gravity;
    particle.position.x += particle.velocity.x;
    particle.position.y += particle.velocity.y;
}

// Explodes a rocket - reseting the sparkles to the rockets last position
// and give them random velocities in all directions
function explodeRocket(rocket)
{
    rocket.exploded = true;
    rocket.activeSparkles = NUM_SPARKLES_PER_ROCKET;
    for(var countS=0; countS < NUM_SPARKLES_PER_ROCKET; countS += 1)
    {
        rocket.sparkles[countS].position.x = rocket.position.x;
        rocket.sparkles[countS].position.y = rocket.position.y;
        var xVelocity = ((2.0 * Math.random()) - 1.0);
        var yVelocity = Math.sqrt(1.0 - (xVelocity*xVelocity)) * ((2.0 * Math.random()) - 1.0);

        rocket.sparkles[countS].velocity.x = xVelocity * m_maxExplosionPower;
        rocket.sparkles[countS].velocity.y = yVelocity * m_maxExplosionPower;
    }// end for - loop through each of the rockets sparkles
}// end function explodeRocket

// Create an array for the particles
var rockets = new Array(NUM_ROCKETS);

// Initialize the rockets and sparkles
function initializeFireworks()
{
    onResize();
    for(var count=0; count < NUM_ROCKETS; count += 1)
    {
        rockets[count] = new Rocket(new Vector2D(0, 0), new Vector2D(0, 0));
        for(var countS=0; countS < NUM_SPARKLES_PER_ROCKET; countS += 1)
        {
            rockets[count].sparkles[countS] = new Sparkle(new Vector2D(0, 0), new Vector2D(0, 0));
        }//end for - loop through each of the rockets sparkles
        resetRocket(rockets[count]);
    }// end for - loop through each rocket
    setInterval(animateFireworks, 10);
}//end initialize function

// Update the rockets and sparkles
function animateFireworks()
{
    var canvas = document.getElementById('fireworks');
    if (canvas.getContext)
    {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for(var count=0; count < NUM_ROCKETS; count += 1)
        {
            // If the rocket hasn't exploded update its position
            if(rockets[count].exploded === false)
            {
                if(rockets[count].velocity.y >= 0.5)
                {
                    explodeRocket(rockets[count]);
                }//end if - rocket is moving down so make it explode

                moveParticle(rockets[count], verticalAcceleration);
                ctx.fillStyle = rockets[count].color + rockets[count].alpha + ")";
                ctx.fillRect(rockets[count].position.x, rockets[count].position.y, 5, 5);
            }// end if - check rocket exploded
            else
            {
                // The rocket has exploded - if the particles have faded out reset the rocket
                // otherwise update the particle positions
                rockets[count].alpha -= 0.02;

                if(rockets[count].alpha <= 0.0)
                {
                    resetRocket(rockets[count]);
                }// end if - check if the sparkles have faded away
                else
                {
                    ctx.fillStyle = rockets[count].color + rockets[count].alpha + ")";
                    for(var countS=0; countS < NUM_SPARKLES_PER_ROCKET; countS += 1)
                    {
                        moveParticle(rockets[count].sparkles[countS], 0.05);
                        ctx.fillRect(rockets[count].sparkles[countS].position.x, rockets[count].sparkles[countS].position.y, 3, 3);
                    }// end for - loop through all the rocket's sparkles
                }// end else - sparkles are still visible
            }// end else - rocket has exploded
        }//end for - loop through all rockets
    }// end if - check canvas is accessible
}// end animate funciton

function onResize()
{
    var canvas = document.getElementById('fireworks');
    canvas.width = window.innerWidth - 25;
    canvas.height = window.innerHeight - 25;
    m_maxInitialVerticalVelocity = -Math.sqrt(2 * verticalAcceleration * canvas.height);
    m_maxInitialHorizontalVelocity = canvas.width / (m_maxInitialVerticalVelocity / verticalAcceleration);
    m_maxExplosionPower = (window.innerWidth + window.innerHeight ) * 0.002;
}