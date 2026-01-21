// Эффекты курсора и анимации
class CursorEffects {
    constructor() {
        this.cursorTrail = document.querySelector('.cursor-trail');
        this.floatingHearts = document.querySelector('.floating-hearts');
        this.sparkleBtn = document.getElementById('sparkle-btn');
        
        this.init();
    }

    init() {
        this.createFloatingHearts();
        this.initCursorTrail();
        this.initSparkleEffect();
        this.initClickEffects();
    }

    // Создаем плавающие сердечки
    createFloatingHearts() {
        const heartCount = 15;
        
        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = '❤️';
            
            // Случайная позиция и анимация
            const left = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = 6 + Math.random() * 4;
            
            heart.style.left = `${left}vw`;
            heart.style.top = `${Math.random() * 100}vh`;
            heart.style.fontSize = `${15 + Math.random() * 15}px`;
            heart.style.animationDelay = `${delay}s`;
            heart.style.animationDuration = `${duration}s`;
            heart.style.opacity = `${0.3 + Math.random() * 0.4}`;
            
            this.floatingHearts.appendChild(heart);
        }
    }

    // След за курсором
    initCursorTrail() {
        let lastX = 0;
        let lastY = 0;
        let trail = [];
        const maxTrail = 20;
        
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            // Создаем пузырек
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.style.left = `${x}px`;
            bubble.style.top = `${y}px`;
            bubble.style.background = this.getRandomPastelColor();
            
            this.cursorTrail.appendChild(bubble);
            
            // Удаляем старые пузырьки
            setTimeout(() => {
                if (bubble.parentNode) {
                    bubble.remove();
                }
            }, 4000);
            
            // Создаем след из точек
            const dot = document.createElement('div');
            dot.style.position = 'fixed';
            dot.style.left = `${x}px`;
            dot.style.top = `${y}px`;
            dot.style.width = '8px';
            dot.style.height = '8px';
            dot.style.background = this.getRandomPastelColor();
            dot.style.borderRadius = '50%';
            dot.style.pointerEvents = 'none';
            dot.style.zIndex = '9999';
            
            document.body.appendChild(dot);
            
            // Анимация исчезновения
            let opacity = 1;
            const fadeInterval = setInterval(() => {
                opacity -= 0.05;
                dot.style.opacity = opacity;
                dot.style.transform = `scale(${opacity})`;
                
                if (opacity <= 0) {
                    clearInterval(fadeInterval);
                    dot.remove();
                }
            }, 30);
            
            lastX = x;
            lastY = y;
        });
    }

    // Эффект искр при нажатии кнопки
    initSparkleEffect() {
        if (!this.sparkleBtn) return;
        
        this.sparkleBtn.addEventListener('click', () => {
            this.createConfetti();
            this.createSparkles();
            this.playMagicSound();
            
            // Анимация всех виджетов
            document.querySelectorAll('.widget').forEach(widget => {
                widget.style.animation = 'none';
                setTimeout(() => {
                    widget.style.animation = 'bounce 0.5s ease';
                }, 10);
            });
        });
    }

    // Эффекты при клике
    initClickEffects() {
        document.addEventListener('click', (e) => {
            // Создаем искры при клике
            for (let i = 0; i < 5; i++) {
                this.createSparkle(e.clientX, e.clientY);
            }
        });
    }

    createConfetti() {
        const colors = ['#ff9ec6', '#ff6b9d', '#c8a2e6', '#e6c2ff', '#ffc9b5'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            const left = Math.random() * 100;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const delay = Math.random() * 2;
            const duration = 3 + Math.random() * 3;
            const size = 5 + Math.random() * 15;
            const shape = Math.random() > 0.5 ? '50%' : '0';
            
            confetti.style.left = `${left}vw`;
            confetti.style.background = color;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.borderRadius = shape;
            confetti.style.animationDelay = `${delay}s`;
            confetti.style.animationDuration = `${duration}s`;
            
            document.body.appendChild(confetti);
            
            // Удаляем конфетти после анимации
            setTimeout(() => {
                confetti.remove();
            }, duration * 1000);
        }
    }

    createSparkles() {
        const sparkleCount = 30;
        
        for (let i = 0; i < sparkleCount; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            this.createSparkle(x, y);
        }
    }

    createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }

    getRandomPastelColor() {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 70%, 85%)`;
    }

    playMagicSound() {
        // Создаем звуковой эффект
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        } catch (e) {
            console.log('Аудио контекст не поддерживается');
        }
    }
}

// Инициализация эффектов
document.addEventListener('DOMContentLoaded', () => {
    new CursorEffects();
    
    // Добавляем случайные анимации элементам
    setInterval(() => {
        const randomWidget = document.querySelector('.widget');
        if (randomWidget && Math.random() > 0.7) {
            randomWidget.style.transform = `translateY(${Math.random() * 10 - 5}px) rotate(${Math.random() * 5 - 2.5}deg)`;
            setTimeout(() => {
                randomWidget.style.transform = '';
            }, 500);
        }
    }, 2000);
});