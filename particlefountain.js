var NUM_PARTICLES = 500;
var m_maxInitialVerticalVelocity;
var m_maxInitialHorizontalVelocity;
var verticalAcceleration = 1;

// Constructs a 2D vector object
function Vector2D(x, y)
{
    this.x = x;
    this.y = y;
}

// Constructs a particle object
function Particle(position, velocity)
{
    this.position = new Vector2D(position.x, position.y);
    this.velocity = new Vector2D(velocity.x, velocity.y);
}

// Resets the particle to the base of the fountain
function resetParticle(particle)
{
    particle.position.x = (window.innerWidth - 25)/ 2;
    particle.position.y = (window.innerHeight - 25);
    particle.velocity.x = (Math.random() - 0.5) * m_maxInitialHorizontalVelocity;
    particle.velocity.y = Math.random() * m_maxInitialVerticalVelocity;
}

// Create an array for the particles
var particles = new Array(NUM_PARTICLES);

// Initialize the particles array and perform the first draw
function draw()
{
    var canvas = document.getElementById('fountain');
    canvas.width = window.innerWidth - 25;
    canvas.height = window.innerHeight - 25;
    onResize();
    if (canvas.getContext)
    {
        var ctx = canvas.getContext('2d');

        ctx.fillStyle = "rgb(0,100,255)";
        for(var count=0; count < NUM_PARTICLES; count += 1)
        {
            particles[count] = new Particle(new Vector2D(0, 0), new Vector2D(0, 0));
            resetParticle(particles[count]);
            ctx.fillRect(particles[count].position.x, particles[count].position.y, 5, 5);
        }
        setInterval(animate, 10);
    }
}

// Update the particle position and reset them if they have fallen below the start height
function animate()
{
    var canvas = document.getElementById('fountain');
    if (canvas.getContext)
    {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "rgb(0,100,255)";
        for(var count=0; count < NUM_PARTICLES; count += 1)
        {
            particles[count].velocity.y += verticalAcceleration;
            particles[count].position.x += particles[count].velocity.x;
            particles[count].position.y += particles[count].velocity.y;

            if(particles[count].position.y >= (window.innerHeight - 25))
            {
                resetParticle(particles[count]);
            }

            ctx.fillRect(particles[count].position.x, particles[count].position.y, 5, 5);
        }
    }
}

function onResize()
{
    var canvas = document.getElementById('fountain');
    canvas.width = window.innerWidth - 25;
    canvas.height = window.innerHeight - 25;
    m_maxInitialVerticalVelocity = -Math.sqrt(2 * verticalAcceleration * canvas.height);
    m_maxInitialHorizontalVelocity = canvas.width / (2 * m_maxInitialVerticalVelocity / verticalAcceleration);
}