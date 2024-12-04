const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('container');
const video = document.querySelector('video');
const cursor = document.getElementById('cursor');
const warning = document.getElementById('warning');
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hasStartedDrawing = false;
const cats = [];
const colors = ['#FFD700', '#FFA500', '#FF69B4', '#87CEEB', '#F0E68C'];
const messages = ['Merry Christmas!', 'Happy Holidays!', 'Season\'s Greetings!', 'Joy to the World!'];
const meowSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-domestic-cat-hungry-meow-45.mp3');
const particles = [];
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Initialize video with muted state
video.muted = true;
video.currentTime = 5; // Start at 3 seconds

// Fade out warning after 5 seconds
setTimeout(() => {
    warning.style.opacity = '0';
}, 5000);

// Handle both mouse and touch events
const getEventPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: clientX - rect.left,
        y: clientY - rect.top,
        clientX,
        clientY
    };
};

// Update cursor for mouse devices only
if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
}

function resize() {
    // Set canvas size with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = container.offsetWidth * dpr;
    canvas.height = container.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = container.offsetWidth + 'px';
    canvas.style.height = container.offsetHeight + 'px';
    drawIce();
}

function drawIce() {
    // Ice drawing code remains the same
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
    gradient.addColorStop(0.3, 'rgba(210, 245, 255, 0.95)');
    gradient.addColorStop(0.7, 'rgba(200, 235, 255, 0.95)');
    gradient.addColorStop(1, 'rgba(220, 240, 255, 0.98)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let i = 0; i < 200; i++) {
        ctx.beginPath();
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 4 + 0.5;
        
        if (Math.random() < 0.2) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(Math.random() * Math.PI * 2);
            
            for (let j = 0; j < 6; j++) {
                ctx.rotate(Math.PI / 3);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(size * 3, 0);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
            ctx.restore();
        } else {
            const alpha = Math.random() * 0.3 + 0.1;
            ctx.fillStyle = `rgba(230, 240, 255, ${alpha})`;
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for(let i = 0; i < 50; i++) {
        ctx.beginPath();
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height;
        const length = Math.random() * 20 + 5;
        const angle = Math.random() * Math.PI * 2;
        
        ctx.moveTo(startX, startY);
        ctx.lineTo(
            startX + Math.cos(angle) * length,
            startY + Math.sin(angle) * length
        );
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }
}

function createCat(x, y) {
    const cat = document.createElement('div');
    cat.className = 'cat';
    cat.style.left = `${x - 25}px`;
    cat.style.top = `${y - 25}px`;
    
    const christmasEmoji = document.createElement('img');
    const christmasEmojis = [
        'https://api.iconify.design/twemoji:christmas-tree.svg',
        'https://api.iconify.design/twemoji:wrapped-gift.svg',
        'https://api.iconify.design/twemoji:snowman-without-snow.svg',
        'https://api.iconify.design/twemoji:snowflake.svg',
        'https://api.iconify.design/twemoji:deer.svg'
    ];
    christmasEmoji.src = christmasEmojis[Math.floor(Math.random() * christmasEmojis.length)];
    cat.appendChild(christmasEmoji);
    
    container.appendChild(cat);
    setTimeout(() => cat.style.opacity = '1', 10);
    setTimeout(() => cat.remove(), 5000);
}

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]}, rgba(255, 215, 0, 0.5))`;
    container.appendChild(particle);
    particles.push({
        element: particle,
        startX: x,
        startY: y,
        speed: Math.random() * 2 + 1,
        angle: Math.random() * Math.PI * 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2
    });
    
    if (particles.length > 30) {
        const oldParticle = particles.shift();
        oldParticle.element.remove();
    }
}

function updateParticles() {
    const time = Date.now() * 0.001;
    particles.forEach((particle) => {
        const radius = 50 * Math.sin(time * 0.5);
        const floatX = particle.startX + Math.sin(time * particle.speed + particle.angle) * radius;
        const floatY = particle.startY + Math.cos(time * particle.speed + particle.angle) * radius - time * 20;
        
        particle.rotation += particle.rotationSpeed;
        
        particle.element.style.left = `${floatX}px`;
        particle.element.style.top = `${floatY}px`;
        particle.element.style.transform = `rotate(${particle.rotation}deg)`;
    });
    requestAnimationFrame(updateParticles);
}

function draw(e) {
    if (!isDrawing) return;
    
    if (!hasStartedDrawing) {
        hasStartedDrawing = true;
        video.currentTime = 3; // Reset to 3 seconds when drawing starts
        video.play().then(() => {
            video.style.opacity = '1';
            video.muted = false;
        });
    }

    const pos = getEventPos(e);
    const x = pos.x;
    const y = pos.y;

    ctx.globalCompositeOperation = 'destination-out';
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 45);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 45, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.stroke();

    if (Math.random() < 0.1) {
        createCat(pos.clientX, pos.clientY);
        meowSound.currentTime = 0;
        meowSound.play();
    }

    if (Math.random() < 0.3 && particles.length < 30) {
        createParticle(pos.clientX + (Math.random() - 0.5) * 40, pos.clientY + (Math.random() - 0.5) * 40);
    }

    lastX = x;
    lastY = y;
}

// Mouse events
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    if (!isTouchDevice) cursor.style.transform = 'translate(-50%, -50%) scale(1.2)';
    const pos = getEventPos(e);
    lastX = pos.x;
    lastY = pos.y;
    draw(e);
});
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    if (!isTouchDevice) cursor.style.transform = 'translate(-50%, -50%) scale(1)';
});
canvas.addEventListener('mouseout', () => {
    isDrawing = false;
    if (!isTouchDevice) cursor.style.transform = 'translate(-50%, -50%) scale(1)';
});

// Touch events
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDrawing = true;
    const pos = getEventPos(e);
    lastX = pos.x;
    lastY = pos.y;
    draw(e);
});
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e);
});
canvas.addEventListener('touchend', () => {
    isDrawing = false;
});

window.addEventListener('resize', resize);

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        video.pause();
    } else if (hasStartedDrawing) {
        video.play();
    }
});

resize();
updateParticles();

