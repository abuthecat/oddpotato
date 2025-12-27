const isMobile = window.matchMedia("(pointer: coarse)").matches; // detect small height screens
let isImageViewerOpen = false;

const messages = [
    {
        type: "video",
        src: "assets/messages/phoebi.mov",
        name: "Phoebi"
    },
    {
        type: "text",
        image: "assets/messages/nana.png",
        name: "Nana"

    },
    {
        type: "text",
        text: "Happy birthday Ieqa!! Apologies for being unable to record a video as I am still recovering from a horrible viral fever, my voice is goneee 🤣 wishing you a very happy and blessed birthday 🎂🎈 catch up soon!!",
        image: "assets/messages/jon.png",
        name: "Jon"
    },
    {
        type: "text",
        text: `Happy Birthday, Potato. \n
                You are now a year older than before. May you live long and happy. And may you stop attracting red flags and toxic people from approaching you. May you one day be able to confidently say no and not feel bad about it. You can be kind and emphatic and that's a good thing but you should never let people use that as a weapon against you. You should also be kind and emphatic to yourself. Don't allow yourself to get hurt by others.\n
                May you continue to grow as a stronger person than you were before. You've done better then when you were 10 years ago. And I hope you will continue to do better 10 years from now too.`,
        image: "assets/messages/ryn.jpeg",
        name: "Ryn",
        long: true
    },
];

// ===== Audio Setup =====
const bgMusic = new Audio('assets/music/birthday_song.mp3');
bgMusic.volume = 0.3;
bgMusic.loop = true;

function fadeBgMusic(target, duration = 300) {
    const start = bgMusic.volume;
    const steps = 20;
    let step = 0;

    const interval = setInterval(() => {
        step++;
        bgMusic.volume = start + (target - start) * (step / steps);

        if (step >= steps) {
            bgMusic.volume = target;
            clearInterval(interval);
        }
    }, duration / steps);
}
document.addEventListener('DOMContentLoaded', () => {

    // Helper to get ordinal suffix
    function getOrdinal(n) {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    // 👉 SET DATE OF BIRTH HERE
    const birthDate = new Date(1999, 11, 27);
    // ⚠️ Month is 0-based (0 = Jan, 5 = June)

    function calculateAge(dob) {
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();

        const hasHadBirthdayThisYear =
            today.getMonth() > dob.getMonth() ||
            (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

        if (!hasHadBirthdayThisYear) age--;

        return age;
    }

    // Update title
    const age = calculateAge(birthDate);
    const ageText = document.getElementById('ageText');
    ageText.textContent = `Happy ${getOrdinal(age)}`;

    // ===== Canvas Setup =====
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    });

    // ===== Particles (Twinkling Sparkles) =====
    const particles = [];
    const particleCount = isMobile ? 25 : 60;

    const colors = ['#F6C1CC', '#C9C3E6', '#FFE0B5', '#FFF6EC', '#FFD7E0', '#A3D9FF'];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: window.innerWidth < 768 ? Math.random() * 4 + 1.5 : Math.random() * 3 + 1, // bigger radius on mobile
            dx: (Math.random() - 0.5) * 0.6,
            dy: (Math.random() - 0.5) * 0.6,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.5 + 0.5,
            pulse: Math.random() * 0.03 + 0.01
        });
    }


    // ===== Shooting Stars =====
    const shootingStars = [];
    function createShootingStar() {

        // Mobile-friendly parameters
        const maxLength = isMobile ? 60 : 150;
        const minLength = isMobile ? 30 : 50;
        const speed = isMobile ? Math.random() * 3 + 2 : Math.random() * 10 + 5;
        const angle = isMobile ? (Math.random() * 0.15 + 0.05) : (Math.random() * 0.2 - 0.1);

        // Spawn somewhere visible
        const x = Math.random() * (w * 0.8) + w * 0.1;  // avoid extreme edges
        const y = Math.random() * (h * 0.3);            // spawn in top 30% of screen

        shootingStars.push({
            x: x,
            y: y,
            length: Math.random() * (maxLength - minLength) + minLength,
            speed: speed,
            angle: angle,
            alpha: 0.9
        });
    }

    // ===== Draw Loop =====
    function draw() {
        // Background Gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, '#ffead2ff'); // top slightly darker
        gradient.addColorStop(1, '#FFF6EC'); // bottom lighter
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Draw particles as hearts
        particles.forEach(p => {
            p.alpha += p.pulse * (Math.random() > 0.5 ? 1 : -1);
            if (p.alpha > 1) p.alpha = 1;
            if (p.alpha < 0.3) p.alpha = 0.3;

            ctx.save(); // save current state
            ctx.translate(p.x, p.y); // move origin to particle position
            ctx.scale(p.r / 10, p.r / 10); // scale heart to particle radius

            // Draw heart shape
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-5, -5, -10, 0, 0, 10);
            ctx.bezierCurveTo(10, 0, 5, -5, 0, 0);
            ctx.closePath();

            ctx.fillStyle = `rgba(${hexToRgb(p.color)},${p.alpha})`;
            ctx.shadowBlur = 6;
            ctx.shadowColor = p.color; // glow effect
            ctx.fill();

            ctx.restore(); // restore state

            // Update position
            p.x += p.dx;
            p.y += p.dy;

            if (p.x < 0 || p.x > w) p.dx *= -1;
            if (p.y < 0 || p.y > h) p.dy *= -1;
        });

        // Draw shooting stars
        shootingStars.forEach((s, i) => {
            ctx.save();
            ctx.strokeStyle = `rgba(255, 255, 255, ${s.alpha})`;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 12;
            ctx.shadowColor = 'white';
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x + s.length * Math.cos(s.angle), s.y + s.length * Math.sin(s.angle));
            ctx.stroke();
            ctx.closePath();
            ctx.restore();

            s.x += Math.cos(s.angle) * s.speed;
            s.y += Math.sin(s.angle) * s.speed;

            if (s.y > h + 50 || s.x > w + 50) shootingStars.splice(i, 1);
        });

        requestAnimationFrame(draw);
    }

    draw();

    // Create shooting stars more frequently
    setInterval(createShootingStar, isMobile ? 2500 : 1500);

    // Helper to convert hex color to RGB
    function hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : '255,255,255';
    }

    // ===== Animate Landing Elements =====
    gsap.fromTo('#landing h1',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }
    );
    gsap.fromTo('#startBtn',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power2.out' }
    );
    // Animate sound note
    gsap.fromTo('#soundNote',
        { opacity: 0, y: 10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1, delay: 0.6, ease: "power2.out" }
    );


    const animSounds = [
        new Audio('assets/music/pop-3.mp3'),
        new Audio('assets/music/pop-6.mp3'),
        new Audio('assets/music/pop-7.mp3'),
        new Audio('assets/music/swoosh-1.mp3'),
        new Audio('assets/music/swoosh-6.mp3'),
        new Audio('assets/music/swoosh-10.mp3'),
    ];

    // Set volume
    animSounds.forEach(sound => sound.volume = 0.5);

    const birthdayMessages = [
        "Wishing you a life full of laughter, fun, and endless happiness ✨🎉",
        "May your days be filled with joy, love, and wonderful experiences 🌸✨",
        "Here’s to a life of happiness, success, and all the things that make you smile 🎉😊",
        "May your journey ahead be bright, joyful, and full of love 🌟✨",
        "Hoping your life is filled with laughter, love, and unforgettable moments 🥳💖"
    ];

    // ===== Flash Sequence =====
    const flashPool = [
        "Joy", "Bliss", "Glow", "Shine", "Radiance", "Sparkle", "Gleam", "Dream",
        "Magic", "Wonder", "Adventure", "Smile", "Happiness", "Cheer", "Serenity",
        "Harmony", "Radiant", "Laughter", "Delight", "Bloom", "Flourish", "Thrive",
        "Courage", "Hope", "Prosperity", "Brilliance", "Clarity", "Inspire", "Victory",
        "Charm", "Elegance", "Grace", "Wisdom", "Peace", "Freedom", "Kindness",
        "Love", "Passion", "Glowup", "Success", "Bright", "Tranquility", "Optimism",
        "Creativity", "Fortune", "Aspire", "Joyful", "Radiate", "Blissful", "Elevate"
    ];

    const animationStyles = [
        "popBig", "popTiny", "spinTwist", "floatUp", "floatDown", "twirlSpin", "bounceUp", "bounceDown",
        "elasticPop", "shakeX", "shakeY", "glowFlash", "blurZoom", "wiggle", "flip3D", "slideSpin",
        "floatWave", "sparklePop", "zoomBounce", "swayTwist", "twistFade", "spinBlur", "popGlowTwist",
        "floatSpin", "bounceFlip", "jumpTwirl"
    ];

    const flashOverlay = document.getElementById('flashOverlay');
    const flashCount = 10;
    // Store the interval ID
    let sparkleInterval; // global scope
    function playFlashSequence(callback) {
        flashOverlay.style.display = 'flex';

        // Start background music
        bgMusic.currentTime = 0;
        bgMusic.play();

        // Start creating sparkles
        sparkleInterval = setInterval(createSparkle, 150);
        // Pick flashCount unique words
        const wordsToShow = [...flashPool].sort(() => Math.random() - 0.5).slice(0, flashCount);

        const colors = ['#F6C1CC', '#C9C3E6', '#FFE0B5', '#FFF6EC', '#A3D9FF', '#FFB3BA', '#BFFCC6', '#FFD7E0', '#D0FFE0'];

        const recentlyUsedAnimations = [];
        const minBeforeRepeat = 3;

        const getRandomAnimation = () => {
            let style;
            let attempts = 0;
            do {
                style = animationStyles[Math.floor(Math.random() * animationStyles.length)];
                attempts++;
                if (attempts > 50) break;
            } while (recentlyUsedAnimations.includes(style));
            recentlyUsedAnimations.push(style);
            if (recentlyUsedAnimations.length > minBeforeRepeat) recentlyUsedAnimations.shift();
            return style;
        };

        let currentIndex = 0;

        function showNextWord() {
            if (currentIndex >= wordsToShow.length) {
                gsap.to(flashOverlay, {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        flashOverlay.style.display = 'none';
                        flashOverlay.style.opacity = 1;

                        // Stop sparkles
                        clearInterval(sparkleInterval);

                        // Remove any remaining sparkles in DOM
                        document.querySelectorAll('.flash-sparkle').forEach(el => el.remove());
                        // Hide the "Wishing you" header
                        flashHeader.style.display = 'none';

                        callback();
                    }
                });
                return;
            }

            const word = wordsToShow[currentIndex];
            currentIndex++;

            const wrapper = document.createElement('div');
            wrapper.style.position = 'absolute';
            wrapper.style.top = '50%';
            wrapper.style.left = '50%';
            wrapper.style.transform = 'translate(-50%, -50%)';
            flashOverlay.appendChild(wrapper);

            const span = document.createElement('span');
            span.textContent = word;
            span.style.display = 'inline-block';
            span.style.fontSize = '3.5rem';
            span.style.fontFamily = 'Quicksand,sans-serif';
            span.style.letterSpacing = '5px';
            span.style.color = colors[Math.floor(Math.random() * colors.length)];
            wrapper.appendChild(span);

            const style = getRandomAnimation();
            // Play a random sound
            const soundToPlay = animSounds[Math.floor(Math.random() * animSounds.length)];
            soundToPlay.currentTime = 0;
            soundToPlay.play();

            // Default from/to variables
            let fromVars = { opacity: 0, x: 0, y: 0, scale: 1, rotation: 0, rotationX: 0, rotationY: 0, skewX: 0, skewY: 0, filter: "none", textShadow: "none", transformOrigin: "50% 50%" };
            let toVars = { opacity: 1, duration: 0.35, ease: "power2.out", x: 0, y: 0, scale: 1, rotation: 0, rotationX: 0, rotationY: 0, skewX: 0, skewY: 0, filter: "none", textShadow: "none", transformOrigin: "50% 50%" };

            switch (style) {
                case "popBig": fromVars.scale = 0; toVars.scale = 1.5; toVars.ease = "power4.out"; break;
                case "popTiny": fromVars.scale = 0.3; toVars.scale = 1; toVars.ease = "back.out(2)"; break;
                case "spinTwist": fromVars.rotation = 360; fromVars.scale = 0; toVars.rotation = 0; toVars.scale = 1; break;
                case "floatUp": fromVars.y = 50; toVars.y = 0; toVars.duration = 0.5; break;
                case "floatDown": fromVars.y = -50; toVars.y = 0; toVars.duration = 0.5; break;
                case "twirlSpin": fromVars.rotation = -720; fromVars.opacity = 0; toVars.rotation = 0; toVars.opacity = 1; break;
                case "bounceUp": fromVars.y = 100; toVars.y = 0; toVars.ease = "bounce.out"; break;
                case "bounceDown": fromVars.y = -100; toVars.y = 0; toVars.ease = "bounce.out"; break;
                case "elasticPop": fromVars.scale = 0; toVars.scale = 1; toVars.ease = "elastic.out(1,0.5)"; break;
                case "shakeX": fromVars.x = -20; toVars.x = 0; toVars.duration = 0.3; toVars.ease = "elastic.out(1,0.3)"; break;
                case "shakeY": fromVars.y = -20; toVars.y = 0; toVars.duration = 0.3; toVars.ease = "elastic.out(1,0.3)"; break;
                case "glowFlash": fromVars.textShadow = "0px 0px 0px #fff"; toVars.textShadow = "0px 0px 25px #fff"; break;
                case "blurZoom": fromVars.filter = "blur(10px)"; fromVars.scale = 0.5; toVars.filter = "blur(0px)"; toVars.scale = 1; break;
                case "wiggle": fromVars.rotation = -15; toVars.rotation = 0; toVars.duration = 0.5; toVars.ease = "elastic.out(1,0.5)"; break;
                case "flip3D": fromVars.rotationY = 180; toVars.rotationY = 0; break;
                case "slideSpin": fromVars.x = -100; fromVars.rotation = 180; toVars.x = 0; toVars.rotation = 0; break;
                case "floatWave": fromVars.y = 30; fromVars.x = -20; toVars.y = 0; toVars.x = 0; break;
                case "sparklePop": fromVars.scale = 0; fromVars.opacity = 0; toVars.scale = 1; toVars.opacity = 1; toVars.textShadow = "0px 0px 15px #fff"; break;
                case "zoomBounce": fromVars.scale = 0.5; toVars.scale = 1; toVars.ease = "bounce.out"; break;
                case "swayTwist": fromVars.x = -30; fromVars.rotation = -20; toVars.x = 0; toVars.rotation = 0; break;
                case "twistFade": fromVars.rotation = 180; fromVars.opacity = 0; toVars.rotation = 0; toVars.opacity = 1; break;
                case "spinBlur": fromVars.rotation = 360; fromVars.filter = "blur(10px)"; toVars.rotation = 0; toVars.filter = "blur(0px)"; break;
                case "popGlowTwist": fromVars.scale = 0; fromVars.rotation = 180; fromVars.textShadow = "0px 0px 0px #fff"; toVars.scale = 1; toVars.rotation = 0; toVars.textShadow = "0px 0px 20px #fff"; break;
                case "floatSpin": fromVars.y = 50; fromVars.rotation = 180; toVars.y = 0; toVars.rotation = 0; break;
                case "bounceFlip": fromVars.y = 50; fromVars.rotationX = 180; toVars.y = 0; toVars.rotationX = 0; break;
                case "jumpTwirl": fromVars.y = 80; fromVars.rotation = 360; toVars.y = 0; toVars.rotation = 0; toVars.ease = "power2.out"; break;
            }

            gsap.fromTo(span, fromVars, {
                ...toVars,
                onComplete: () => {
                    gsap.to(wrapper, {
                        opacity: 0,
                        duration: 0.25,
                        delay: 0.05,
                        onComplete: () => {
                            wrapper.remove();
                            showNextWord();
                        }
                    });
                }
            });
        }

        showNextWord();
    }

    // ===== Landing Button Click =====
    const startBtn = document.getElementById('startBtn');
    startBtn.addEventListener('click', () => {
        gsap.to('#landing', {
            opacity: 0, duration: 0.5, onComplete: () => {
                document.getElementById('landing').style.display = 'none';
                playFlashSequence(() => {
                    // Show birthday card (main page)
                    const birthdayCard = document.getElementById('birthdayCard');
                    birthdayCard.style.display = 'flex';
                    gsap.fromTo(birthdayCard, { opacity: 0 }, { opacity: 1, duration: 1 });
                    createConfetti();

                    // Pick a random message
                    const randomMessage = birthdayMessages[Math.floor(Math.random() * birthdayMessages.length)];

                    // Set it in paragraph
                    const messageParagraph = document.querySelector('#birthdayCard .card-center p');
                    messageParagraph.textContent = randomMessage;

                    addBirthdayImages();
                    // Close button
                    const closeBtn = document.getElementById('closeBtn');
                    closeBtn.addEventListener('click', () => {
                        gsap.to(birthdayCard, { opacity: 0, duration: 0.5, onComplete: () => birthdayCard.style.display = 'none' });
                    });

                    gsap.from('.video-hint', {
                        opacity: 0,
                        y: 6,
                        duration: 1,
                        delay: 5,
                        ease: 'power2.out'
                    });

                });

            }
        });
    });

    // Replace Lucide icons
    lucide.replace();
});

const flashHeader = document.getElementById('flashHeader');

// Function to create a sparkle
function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.classList.add('flash-sparkle');

    // Random position around the header
    const rect = flashHeader.getBoundingClientRect();
    const offsetX = Math.random() * rect.width;
    const offsetY = Math.random() * rect.height;
    sparkle.style.left = `${offsetX}px`;
    sparkle.style.top = `${offsetY}px`;

    flashHeader.appendChild(sparkle);

    // Animate sparkle
    gsap.fromTo(sparkle,
        { opacity: 0, scale: 0 },
        {
            opacity: Math.random() * 0.8 + 0.2,
            scale: Math.random() * 1 + 0.5,
            duration: Math.random() * 0.5 + 0.3,
            ease: "power1.out",
            yoyo: true,
            repeat: 1,
            onComplete: () => sparkle.remove()
        }
    );
}

function createConfetti() {
    const confettiContainer = document.getElementById('birthdayCard');
    const confettiCount = isMobile ? 40 : 80;
    const confettiColors = ['#F6C1CC', '#C9C3E6', '#FFE0B5', '#FFF6EC', '#FFD7E0', '#A3D9FF'];

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.width = `${Math.random() * 8 + 4}px`;
        confetti.style.height = `${Math.random() * 8 + 4}px`;
        confetti.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.left = `${Math.random() * window.innerWidth}px`;
        confetti.style.top = `-${Math.random() * 20}px`;
        confetti.style.opacity = Math.random() * 0.8 + 0.3;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confettiContainer.appendChild(confetti);

        animateConfetti(confetti);
    }
}

function animateConfetti(el) {
    const duration = Math.random() * 3 + 2; // fall speed
    const xMovement = (Math.random() - 0.5) * 100; // side sway

    gsap.to(el, {
        y: window.innerHeight + 20,
        x: `+=${xMovement}`,
        rotation: Math.random() * 360,
        duration: duration,
        ease: "power1.in",
        repeat: -1,
        delay: Math.random() * 2
    });
}

let frameImages = [];

function addBirthdayImages() {
    fetch('genshin-emotes.json')
        .then(res => res.json())
        .then(data => {
            frameImages = data.images;
            const card = document.getElementById('birthdayCard');
            const titleWrapper = document.querySelector('.title-wrapper');
            const birthdayTitle = document.getElementById('birthdayTitle');
            const bottomActions = document.querySelector('.bottom-actions');

            function pickRandomImage() {
                return frameImages[Math.floor(Math.random() * frameImages.length)];
            }

            // ===== TOP IMAGE =====
            const topWrapper = document.createElement('div');
            topWrapper.style.display = 'flex';
            topWrapper.style.justifyContent = 'center';
            topWrapper.style.pointerEvents = 'none';
            topWrapper.style.marginBottom = 'clamp(1.5rem, 6vw, 3rem)';

            const topImg = document.createElement('img');
            topImg.src = pickRandomImage();
            topImg.classList.add('frame-img');
            topImg.style.width = 'clamp(150px, 25vw, 250px)';
            topImg.style.height = 'auto';
            topImg.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;

            topWrapper.appendChild(topImg);
            titleWrapper.insertBefore(topWrapper, birthdayTitle);

            gsap.to(topImg, {
                y: '+=5px',
                rotation: '+=2deg',
                duration: 3 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            // ===== BOTTOM LEFT & RIGHT IMAGES =====
            const leftImg = document.createElement('img');
            const rightImg = document.createElement('img');

            [leftImg, rightImg].forEach(img => {
                img.src = pickRandomImage();
                img.classList.add('frame-img');
                img.style.width = 'clamp(100px, 10vw, 150px)';
                img.style.height = 'auto';
                img.style.position = 'absolute';
                img.style.pointerEvents = 'none';
                img.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
                card.appendChild(img);

                img.onload = () => {
                    positionBottomImages();
                };
            });

            function positionBottomImages() {
                const cardRect = card.getBoundingClientRect();
                const bottomRect = bottomActions.getBoundingClientRect();
                const spacing = 10;
                const buffer = -10;

                const leftY = Math.min(
                    bottomRect.top - cardRect.top + (bottomRect.height - leftImg.offsetHeight) / 2,
                    cardRect.height - leftImg.offsetHeight - buffer
                );
                const rightY = Math.min(
                    bottomRect.top - cardRect.top + (bottomRect.height - rightImg.offsetHeight) / 2,
                    cardRect.height - rightImg.offsetHeight - buffer
                );

                leftImg.style.left = `${bottomRect.left - cardRect.left - leftImg.offsetWidth - spacing}px`;
                leftImg.style.top = `${leftY}px`;

                rightImg.style.left = `${bottomRect.right - cardRect.left + spacing}px`;
                rightImg.style.top = `${rightY}px`;
            }

            positionBottomImages();
            window.addEventListener('resize', positionBottomImages);

            // Floating animations
            gsap.to(leftImg, { x: '+=5px', rotation: '+=2deg', duration: 3 + Math.random() * 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
            gsap.to(rightImg, { x: '-=5px', rotation: '+=2deg', duration: 3 + Math.random() * 2, repeat: -1, yoyo: true, ease: "sine.inOut" });

            // // ===== CLICK TO CHANGE IMAGES =====
            // card.addEventListener('click', () => {
            //     topImg.src = pickRandomImage();
            //     leftImg.src = pickRandomImage();
            //     rightImg.src = pickRandomImage();
            // });
        })
        .catch(err => console.error('Error loading frame images:', err));
}

const loopBtn = document.getElementById('loopBtn');

loopBtn.addEventListener('click', () => {
    // Spin icon briefly
    const icon = loopBtn.querySelector('svg');
    gsap.fromTo(icon, { rotation: 0 }, { rotation: 360, duration: 0.6, ease: "power2.inOut" });

    // Your existing loop functionality
    const card = document.getElementById('birthdayCard');
    const topImg = card.querySelector('.title-wrapper img');
    const bottomImgs = card.querySelectorAll('.frame-img:not(.title-wrapper img)');

    function pickRandomImage() {
        return frameImages[Math.floor(Math.random() * frameImages.length)];
    }

    if (topImg) topImg.src = pickRandomImage();
    bottomImgs.forEach(img => img.src = pickRandomImage());
});

// Pause/Resume animations on tab visibility change
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});



// ===== Message Gallery =====
const videoBtn = document.getElementById('videoBtn');
const messageGallery = document.getElementById('messageGallery');
const galleryContent = document.querySelector('.gallery-content');

// Invisible tap zones for left/right navigation
let leftZone = document.createElement('div');
leftZone.classList.add('gallery-tap-zone', 'left');
let rightZone = document.createElement('div');
rightZone.classList.add('gallery-tap-zone', 'right');
document.body.appendChild(leftZone);
document.body.appendChild(rightZone);

leftZone.style.display = 'none';
rightZone.style.display = 'none';
let galleryIndex = 0;

videoBtn.addEventListener('click', () => {
    // Reset gallery
    galleryIndex = 0;
    galleryContent.innerHTML = '';
    messageGallery.style.display = 'flex';

    fadeBgMusic(0.125);
    // Show navigation zones only on non-mobile
    if (!isMobile) {
        leftZone.style.display = 'block';
        rightZone.style.display = 'block';
    } else {
        leftZone.style.display = 'none';
        rightZone.style.display = 'none';
    }

    showMessage();

    // // Play surprise video first
    // const firstVideo = document.createElement('video');
    // firstVideo.src = messages[0].src;
    // firstVideo.autoplay = true;
    // firstVideo.controls = false;
    // firstVideo.style.maxHeight = '70vh';
    // galleryContent.appendChild(firstVideo);

    // firstVideo.addEventListener('ended', () => {
    //     galleryIndex = 1; // start from second message
    //     showMessage();
    //     leftZone.style.display = 'block';
    //     rightZone.style.display = 'block';
    // });
});
function showMessage() {
    // 🔴 END OF GALLERY → CLOSE EVERYTHING
    if (galleryIndex >= messages.length) {
        messageGallery.style.display = 'none';
        galleryContent.innerHTML = '';

        // hide navigation zones
        leftZone.style.display = 'none';
        rightZone.style.display = 'none';

        fadeBgMusic(0.3); // 🔊 restore volume
        return;
    }

    galleryContent.innerHTML = '';
    const msg = messages[galleryIndex];

    // 🎥 VIDEO MESSAGE
    if (msg.type === 'video') {
        const vid = document.createElement('video');
        vid.src = msg.src;
        vid.autoplay = true;
        vid.controls = true;
        vid.style.maxHeight = '70vh';
        vid.style.maxWidth = '100%';

        vid.addEventListener('ended', () => {
            galleryIndex++;
            showMessage();
        });

        galleryContent.appendChild(vid);
        return;
    }


    // 📝 TEXT / IMAGE MESSAGE
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper');

    const hasText = msg.text && msg.text.trim() !== '';
    const hasImage = !!msg.image;

    // 🔥 mark image-only messages
    if (hasImage && !hasText) {
        wrapper.classList.add('image-only');
    }


    // Image
    if (hasImage) {
        const img = document.createElement('img');
        img.src = msg.image;
        img.alt = msg.name || 'message image';
        img.classList.add('message-image');

        // 🔍 enable tap-to-zoom only for image-only messages
        if (!hasText) {
            img.classList.add('zoomable');

            img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // 🚫 STOP slide trigger
                openImageViewer(msg.image);
            });

            // 🔒 Stop swipe from starting on image
            img.addEventListener('touchstart', e => {
                e.stopPropagation();
            }, { passive: true });

            img.addEventListener('touchmove', e => {
                e.stopPropagation();
            }, { passive: true });
        }


        wrapper.appendChild(img);
    }


    // Text (only if it exists)
    if (hasText) {
        const txt = document.createElement('div');
        txt.classList.add('text-message');

        if (msg.long) {
            txt.classList.add('long-message');
        }

        txt.textContent = msg.text;
        wrapper.appendChild(txt);
    }


    // Author (optional)
    if (msg.name) {
        const author = document.createElement('div');
        author.classList.add('text-author');
        author.textContent = `— ${msg.name}`;
        wrapper.appendChild(author);
    }

    galleryContent.appendChild(wrapper);

}

// Left / right navigation
leftZone.addEventListener('click', () => {
    if (isImageViewerOpen) return;
    if (galleryIndex > 0) {
        galleryIndex--;
        showMessage();
    }
});

rightZone.addEventListener('click', () => {
    if (isImageViewerOpen) return;
    galleryIndex++;
    showMessage();
});


let startX = 0;
let currentX = 0;
let isSwiping = false;
const swipeThreshold = 60; // px needed to trigger swipe

if (isMobile) {
    messageGallery.addEventListener('touchstart', e => {
        if (isImageViewerOpen) return;

        // 🧠 If touching zoomable image, do NOT start swipe
        if (e.target.closest('.zoomable')) return;

        startX = e.touches[0].clientX;
        isSwiping = true;
    });

    messageGallery.addEventListener('touchmove', e => {
        if (!isSwiping || isImageViewerOpen) return;
        currentX = e.touches[0].clientX;
    });

    messageGallery.addEventListener('touchend', () => {
        if (!isSwiping || isImageViewerOpen) return;

        const deltaX = currentX - startX;
        isSwiping = false;

        if (Math.abs(deltaX) < swipeThreshold) return;

        if (deltaX < 0) swipeNext();
        else swipePrev();
    });

}


function swipeNext() {
    if (isImageViewerOpen) return;
    if (galleryIndex >= messages.length) return;

    animateOut(-1, () => {
        galleryIndex++;
        showMessage();
        animateIn(1);
    });
}

function swipePrev() {
    if (isImageViewerOpen) return;
    if (galleryIndex <= 0) return;

    animateOut(1, () => {
        galleryIndex--;
        showMessage();
        animateIn(-1);
    });
}


document.addEventListener('keydown', (e) => {
    if (isMobile) return;
    if (messageGallery.style.display !== 'flex') return;
    if (isImageViewerOpen) return;

    if (e.key === 'ArrowRight') swipeNext();
    if (e.key === 'ArrowLeft') swipePrev();
});


function animateOut(direction, onComplete) {
    const el = galleryContent.firstElementChild;
    if (!el) return;

    gsap.to(el, {
        x: direction * 100,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete
    });
}

function animateIn(direction) {
    const el = galleryContent.firstElementChild;
    if (!el) return;

    gsap.fromTo(el,
        { x: direction * -100, opacity: 0 },
        {
            x: 0,
            opacity: 1,
            duration: 0.45,
            ease: "power2.out"
        }
    );
}


messageGallery.addEventListener('touchmove', e => {
    if (!isSwiping) return;

    const deltaX = currentX - startX;
    const deltaY = e.touches[0].clientY - e.touches[0].clientY;

    // Only block scrolling if horizontal swipe is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && !e.target.closest('.long-message')) {
        e.preventDefault();
    }
}, { passive: false });

function openImageViewer(src) {
    isImageViewerOpen = true; // 🔒 lock gallery

    const overlay = document.createElement('div');
    overlay.className = 'image-viewer';

    const img = document.createElement('img');
    img.src = src;

    overlay.appendChild(img);
    document.body.appendChild(overlay);

    // prevent background scrolling
    document.body.style.overflow = 'hidden';

    // ⛔ disable tap zones while fullscreen
    leftZone.style.pointerEvents = 'none';
    rightZone.style.pointerEvents = 'none';

    overlay.addEventListener('click', () => {
        overlay.remove();
        document.body.style.overflow = '';

        // 🔓 unlock gallery
        isImageViewerOpen = false;

        leftZone.style.pointerEvents = '';
        rightZone.style.pointerEvents = '';
    });
}
