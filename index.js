document.addEventListener('DOMContentLoaded', () => {
    // 0. Mark JS as enabled for animations
    document.body.classList.add('js-enabled');

    /* 1. Reveal animations using IntersectionObserver */
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    /* 2. Scroll Progress Bar */
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        });
    }

    /* 3. Mouse Trailer */
    const trailer = document.getElementById('mouse-trailer');
    if (trailer) {
        window.addEventListener('mousemove', e => {
            const x = e.clientX - trailer.offsetWidth / 2,
                y = e.clientY - trailer.offsetHeight / 2;

            trailer.animate({
                transform: `translate(${x}px, ${y}px)`
            }, {
                duration: 800,
                fill: "forwards"
            });
            trailer.style.opacity = "1";
        });
    }

    /* 4. Typewriter Effect */
    const typewriter = document.getElementById('typewriter-text');
    if (typewriter) {
        const textToType = typewriter.getAttribute('data-text');
        typewriter.textContent = ''; // Clear initial text
        let idx = 0;
        function type() {
            if (idx < textToType.length) {
                typewriter.textContent += textToType.charAt(idx);
                idx++;
                setTimeout(type, 30);
            }
        }
        setTimeout(type, 1000);
    }

    /* 5. Magnetic CTA Buttons */
    const magneticElements = document.querySelectorAll('.cta-button, .logo, .service-category, .project-card');
    magneticElements.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const pos = item.getBoundingClientRect();
            const x = e.clientX - pos.left - pos.width / 2;
            const y = e.clientY - pos.top - pos.height / 2;

            item.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            if (trailer) {
                trailer.style.transform = `scale(3)`;
                trailer.style.background = "rgba(100, 255, 218, 0.3)";
            }
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translate(0px, 0px)';
            if (trailer) {
                trailer.style.transform = `scale(1)`;
                trailer.style.background = "var(--accent-color)";
            }
        });
    });

    /* 6. Background Particle System */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function initCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }
            draw() {
                ctx.fillStyle = 'rgba(100, 255, 218, 0.15)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function handleParticles() {
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        ctx.strokeStyle = 'rgba(100, 255, 218, 0.05)';
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < 80; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            handleParticles();
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', initCanvas);
        initCanvas();
        animate();
    }

    /* Smooth scroll for navigation links */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
