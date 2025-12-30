// 초기화 코드
import { renderFlowStep } from './app.js';
import { showLifetimeFreeModal } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    
    // Random Greeting
    const greetings = [
        "좋은 아침입니다",
        "오늘도 힘내세요",
        "기분 좋은 하루 되세요",
        "대박 나세요",
        "반갑습니다"
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    const greetingEl = document.getElementById('greeting-text');
    if(greetingEl) greetingEl.innerText = randomGreeting;

    const nav = document.querySelector('.nav-bar');

    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) splash.style.opacity = '0';
        setTimeout(() => {
            if (splash) splash.remove();
            if (nav) nav.classList.remove('nav-hidden');
            showLifetimeFreeModal();
        }, 700);
    }, 2000);
    renderFlowStep(0); // Initialize Analysis Flow
    
    // Toggle Interactions
    document.querySelectorAll('.toggle-checkbox').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const label = this.nextElementSibling;
            if(this.checked) {
                label.classList.remove('bg-gray-300');
                label.classList.add('bg-brand-main');
                this.classList.remove('border-gray-300', 'right-5');
                this.classList.add('right-0');
            } else {
                label.classList.remove('bg-brand-main');
                label.classList.add('bg-gray-300');
                this.classList.remove('right-0');
                this.classList.add('border-gray-300', 'right-5');
            }
        });
    });
});

