document.addEventListener('DOMContentLoaded', () => {

    // ===== Canvas Setup =====
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    });

    // ===== Floating Sparkles =====
    const sparkles = [];
    const sparkleCount = 20;
    const colors = ['#F6C1CC', '#C9C3E6', '#FFE0B5', '#FFF6EC'];

    for (let i = 0; i < sparkleCount; i++) {
        sparkles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 2 + 1,
            dx: (Math.random() - 0.5) * 0.3,
            dy: (Math.random() - 0.5) * 0.3,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    function draw() {
        // Fill canvas with pastel beige background
        ctx.fillStyle = '#FFF6EC'; // soft pastel beige
        ctx.fillRect(0, 0, w, h);

        // Draw sparkles
        sparkles.forEach(s => {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.fill();
            ctx.closePath();

            // Update positions
            s.x += s.dx;
            s.y += s.dy;
            if (s.x < 0 || s.x > w) s.dx *= -1;
            if (s.y < 0 || s.y > h) s.dy *= -1;
        });

        requestAnimationFrame(draw);
    }

    draw();

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

    // ===== Audio Setup =====
    const bgMusic = new Audio('assets/music/birthday_song.mp3');
    bgMusic.volume = 0.3;
    bgMusic.loop = true;

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
        "Wishing you a life full of laughter, love, and endless happiness ✨💖",
        "May your days be filled with joy, love, and wonderful moments, today and always 🌸✨",
        "Here’s to a life of happiness, love, and all the good things that make you smile 🎉💖",
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
    const confettiCount = 80; // more pieces for effect
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
function addBirthdayImages() {
    fetch('genshin-emotes.json')
        .then(res => res.json())
        .then(data => {
            const frameImages = data.images;
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
            topWrapper.style.marginBottom = 'clamp(1.5rem, 6vw, 3rem)'; // responsive spacing

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

                // Wait for each image to load before positioning
                img.onload = () => {
                    positionBottomImages();
                };
            });


            // Dynamically position bottom images to avoid cropping
            function positionBottomImages() {
                const cardRect = card.getBoundingClientRect();
                const bottomRect = bottomActions.getBoundingClientRect();
                const spacing = 10;
                const buffer = -10; // buffer above bottom of card

                // Calculate Y positions safely
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
            gsap.to(leftImg, {
                x: '+=5px',
                rotation: '+=2deg',
                duration: 3 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            gsap.to(rightImg, {
                x: '-=5px',
                rotation: '+=2deg',
                duration: 3 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        })
        .catch(err => console.error('Error loading frame images:', err));
}



