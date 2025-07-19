document.addEventListener('DOMContentLoaded', () => {
    // --- General Elements ---
    const scenes = document.querySelectorAll('.scene');
    const bgMusic = document.getElementById('bg-music');
    let musicPlayed = false;

    // --- Scene 1: Catch the Button ---
    const catchBtn = document.getElementById('catch-btn');
    const tapCounterEl = document.getElementById('tap-counter');
    let tapCount = 0;
    let requiredTaps = Math.floor(Math.random() * 5) + 5; // Random taps between 5 and 9

    // --- Scene 2: Letter Modal ---
    const letterModal = document.getElementById('letter-modal');
    const closeModalBtn = document.querySelector('.close-btn');

    // --- Scene 3: Constellation ---
    const stars = document.querySelectorAll('.star');
    const constellationSVG = document.getElementById('constellation-svg');
    const constellationReveal = document.getElementById('constellation-reveal');
    const nextToWishingJarBtn = document.getElementById('next-to-wishing-jar');
    const constellationInstruction = document.getElementById('constellation-instruction');
    let starOrder = 1;
    let lastStarCoords = null;

    // --- Scene 4: Wishing Jar ---
    const wishInput = document.getElementById('wish-input');
    const sendToJarBtn = document.getElementById('send-to-jar-btn');
    const jarContainer = document.getElementById('jar-container');
    const finalMessage = document.getElementById('final-message');

    // --- Utility Function to Change Scenes ---
    function switchScene(sceneId) {
        scenes.forEach(scene => {
            if (scene.id === sceneId) {
                scene.classList.remove('hidden');
                scene.classList.add('active');
            } else {
                scene.classList.remove('active');
                // Use a timeout to add 'hidden' after the fade-out transition
                setTimeout(() => scene.classList.add('hidden'), 800);
            }
        });
    }
    
    // --- Music Control ---
    // Start music on the first user interaction
    document.body.addEventListener('click', () => {
        if (!musicPlayed) {
            bgMusic.play().catch(error => console.log("Audio autoplay was blocked."));
            musicPlayed = true;
        }
    }, { once: true });


    // --- Scene 1 Logic ---
    function moveButton() {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

        const btnWidth = catchBtn.offsetWidth;
        const btnHeight = catchBtn.offsetHeight;

        const newTop = Math.random() * (vh - btnHeight * 2) + btnHeight;
        const newLeft = Math.random() * (vw - btnWidth * 2) + btnWidth;

        catchBtn.style.top = `${newTop}px`;
        catchBtn.style.left = `${newLeft}px`;
    }

    catchBtn.addEventListener('click', () => {
        tapCount++;
        tapCounterEl.classList.remove('hidden');
        tapCounterEl.textContent = `Taps: ${tapCount}`;

        if (tapCount >= requiredTaps) {
            catchBtn.textContent = '✅';
            catchBtn.style.cursor = 'default';
            // Disable further clicks/moves
            catchBtn.removeEventListener('mouseover', moveButton); 
            setTimeout(() => {
                letterModal.classList.add('active');
            }, 500);
        } else {
            moveButton();
        }
    });
    
    // For a better mobile experience, we can also use 'mouseover' on desktop
    if (window.innerWidth > 768) {
       catchBtn.addEventListener('mouseover', moveButton);
    }


    // --- Scene 2 Logic ---
    closeModalBtn.addEventListener('click', () => {
        letterModal.classList.remove('active');
        setTimeout(() => switchScene('scene3'), 500);
    });

    // --- Scene 3 Logic ---
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const currentOrder = parseInt(star.dataset.order);

            if (currentOrder === starOrder) {
                star.classList.add('connected');
                
                const rect = star.getBoundingClientRect();
                const currentCoords = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                };

                if (lastStarCoords) {
                    drawLine(lastStarCoords, currentCoords);
                }

                lastStarCoords = currentCoords;
                starOrder++;
                
                // Check for completion
                if (starOrder > stars.length) {
                    setTimeout(() => {
                        constellationInstruction.style.opacity = '0';
                        constellationReveal.classList.remove('hidden');
                        constellationReveal.style.opacity = '1';
                        nextToWishingJarBtn.classList.remove('hidden');
                    }, 500);
                }
            }
        });
    });

    function drawLine(from, to) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', from.x);
        line.setAttribute('y1', from.y);
        line.setAttribute('x2', to.x);
        line.setAttribute('y2', to.y);
        line.setAttribute('stroke', 'rgba(255, 255, 255, 0.7)');
        line.setAttribute('stroke-width', '3');
        line.style.opacity = '0';
        constellationSVG.appendChild(line);

        // Animate the line drawing
        setTimeout(() => {
            line.style.transition = 'opacity 0.5s';
            line.style.opacity = '1';
        }, 10);
    }
    
    nextToWishingJarBtn.addEventListener('click', () => {
        switchScene('scene4');
    });


    // --- Scene 4 Logic ---
    sendToJarBtn.addEventListener('click', () => {
        if (wishInput.value.trim() === "") {
            alert("Please write a wish first!");
            return;
        }

        // Create the glowing orb
        const orb = document.createElement('div');
        orb.classList.add('wish-orb');
        
        // Position it over the textarea
        const inputRect = wishInput.getBoundingClientRect();
        orb.style.left = `${inputRect.left + inputRect.width / 2 - 12.5}px`;
        orb.style.top = `${inputRect.top}px`;
        
        document.body.appendChild(orb);

        // Hide input elements
        wishInput.style.display = 'none';
        sendToJarBtn.style.display = 'none';

        // Animate the orb into the jar
        setTimeout(() => {
            const jarRect = jarContainer.getBoundingClientRect();
            orb.style.top = `${jarRect.top + jarRect.height / 2}px`;
            orb.style.opacity = '0';
        }, 100);

        // Remove the orb after animation and show the final message
        setTimeout(() => {
            orb.remove();
            finalMessage.classList.remove('hidden');
            finalMessage.style.opacity = '1';
        }, 2100);
    });

    // --- Initial Setup ---
    switchScene('scene1'); // Start with the first scene
    tapCounterEl.classList.add('hidden'); // Hide counter initially
    moveButton(); // Set initial button position
});
