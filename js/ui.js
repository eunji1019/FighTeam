// Note: currentXP, maxXP, provocativeShown, navigateTo, resetFlow are imported dynamically to avoid circular dependencies

// XP System
export function addXP(amount) {
    import('./app.js').then(module => {
        module.currentXP = Math.min(module.currentXP + amount, module.maxXP);
        const percent = (module.currentXP / module.maxXP) * 100;
    
        const xpBar = document.getElementById('xp-bar');
        if (xpBar) xpBar.style.width = percent + '%';
        
        const xpText = document.getElementById('current-xp-text');
        if (xpText) xpText.textContent = module.currentXP.toLocaleString() + ' XP';
        
        const xpRemain = document.getElementById('xp-remaining');
        if (xpRemain) xpRemain.textContent = Math.max(0, module.maxXP - module.currentXP).toLocaleString();
    });
}

export function completeMission(el, amount) {
    // Handle list item click (Home tab)
    if (el.classList.contains('bg-white') && !el.classList.contains('bg-brand-main')) {
        const iconBox = el.querySelector('.icon-box');
        if (!iconBox || el.dataset.completed) return;
        
        el.dataset.completed = "true";
        el.style.transform = 'scale(0.95)';
        setTimeout(() => el.style.transform = 'scale(1)', 150);
        
        iconBox.className = "w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white transition-all duration-500 rotate-[360deg]";
        iconBox.innerHTML = '<i data-lucide="check" class="w-6 h-6"></i>';
        
        el.onclick = null;
        
        setTimeout(() => {
            showRewardModal(amount);
            addXP(amount);
            lucide.createIcons();
        }, 400);
    } 
    // Handle button click (Growth tab)
    else if (el.tagName === 'BUTTON') {
         el.innerHTML = '<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>';
        setTimeout(() => {
            el.textContent = '완료';
            el.className = "bg-green-100 text-green-600 text-xs font-bold px-4 py-2.5 rounded-xl cursor-default";
            el.onclick = null;
            addXP(amount);
            showRewardModal(amount);
        }, 800);
    }
}

export function showRewardModal(xp) {
    const modal = document.getElementById('reward-modal');
    const amountEl = document.getElementById('reward-xp-amount');
    if(modal && amountEl) {
        amountEl.textContent = xp + " XP";
        modal.classList.remove('hidden');
    }
}

export function closeRewardModal() {
    document.getElementById('reward-modal').classList.add('hidden');
}

// Lifetime Free Modal
export function showLifetimeFreeModal() {
    const modal = document.getElementById('lifetime-free-modal');
    const nameEl = document.getElementById('lifetime-free-name');
    
    let userName = '김애드님'; // Default
    const greetingHeader = document.querySelector('#view-home h1');
    if (greetingHeader) {
        const nameMatch = greetingHeader.textContent.match(/(\S+)님/);
        if (nameMatch) {
            userName = nameMatch[1].replace('사장', '애드') + '님';
        }
    }
    
    if (nameEl) {
        nameEl.textContent = userName;
    }
    
    if (modal) {
        modal.classList.remove('hidden');
        lucide.createIcons();
    }
}

export function closeLifetimeFreeModal() {
    const modal = document.getElementById('lifetime-free-modal');
    if (modal) {
        modal.classList.add('hidden');
        setTimeout(() => showRandomAd(), 300);
    }
}

// Ad Popup System
export function showRandomAd() {
    const ads = [
        {
            type: 'loan',
            bg: 'bg-blue-600',
            title: '사장님 든든 대출',
            desc: '최저 금리 3.5%부터<br>한도 조회 조회 기록 없이!',
            icon: 'landmark',
            btn: '한도 확인하기'
        },
        {
            type: 'finance',
            bg: 'bg-emerald-600',
            title: '매출 관리 필수 통장',
            desc: '이체 수수료 평생 0원<br>매일 이자 쌓이는 파킹통장',
            icon: 'wallet',
            btn: '통장 개설하기'
        },
        {
            type: 'beverage',
            bg: 'bg-orange-500',
            title: '힘내라 박카스!',
            desc: '오늘도 고생한 사장님께<br>박카스 1박스 초특가 할인',
            icon: 'coffee',
            btn: '특가 구매하기'
        }
    ];
    
    const ad = ads[Math.floor(Math.random() * ads.length)];
    const adContent = document.getElementById('ad-content');
    
    adContent.innerHTML = `
        <div class="${ad.bg} p-8 pt-12 text-center text-white relative overflow-hidden h-80 flex flex-col justify-between">
            <div class="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
            <div class="absolute bottom-0 left-0 w-32 h-32 bg-black opacity-10 rounded-full blur-2xl transform -translate-x-10 translate-y-10"></div>
            
            <div class="relative z-10">
                <div class="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/10">
                    <i data-lucide="${ad.icon}" class="w-8 h-8 text-white"></i>
                </div>
                <span class="inline-block bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-2 border border-white/10">SPONSORED</span>
                <h3 class="text-2xl font-black leading-tight mb-2">${ad.title}</h3>
                <p class="text-sm opacity-90 leading-relaxed font-medium">${ad.desc}</p>
            </div>
            
            <button onclick="window.closeAdPopup()" class="w-full bg-white text-gray-900 font-bold py-4 rounded-xl shadow-lg hover:bg-gray-50 transition-all active:scale-95 relative z-10">
                ${ad.btn}
            </button>
        </div>
    `;
    
    document.getElementById('ad-popup-modal').classList.remove('hidden');
    lucide.createIcons();
}

export function closeAdPopup() {
    document.getElementById('ad-popup-modal').classList.add('hidden');
    setTimeout(() => showProvocativePopup(), 200);
}

// Provocative Prompt
export function showProvocativePopup() {
    import('./app.js').then(module => {
        if (module.provocativeShown) return;
        const modal = document.getElementById('provocative-modal');
        if (!modal) return;
        module.provocativeShown = true;
        modal.classList.remove('hidden');
        lucide.createIcons();
    });
}

export function closeProvocativeModal() {
    const modal = document.getElementById('provocative-modal');
    if (modal) modal.classList.add('hidden');
}

export function startProvocativeFlow() {
    closeProvocativeModal();
    import('./app.js').then(module => {
        module.navigateTo('analysis');
        setTimeout(() => module.resetFlow(), 50);
    });
}

// AI Reply System
export function openAiReplyModal(type) {
    console.log('openAiReplyModal called with type:', type);
    const modal = document.getElementById('ai-reply-modal');
    const loading = document.getElementById('ai-reply-loading');
    const options = document.getElementById('ai-reply-options');
    
    if (!modal) {
        console.error('AI Reply Modal element not found');
        return;
    }

    modal.classList.remove('hidden');
    loading.classList.remove('hidden');
    options.innerHTML = '';

    void modal.offsetWidth;

    setTimeout(() => {
        loading.classList.add('hidden');
        const replies = getRepliesByType(type);
        
        options.innerHTML = replies.map((reply, index) => `
            <div onclick="window.selectReply(this)" class="p-5 rounded-2xl border border-gray-200 cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all group relative animate-fade-in" style="animation-delay: ${index * 100}ms">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs font-bold ${reply.color} px-2 py-1 rounded-lg bg-white border border-gray-100 shadow-sm">${reply.tone}</span>
                    <i data-lucide="copy" class="w-4 h-4 text-gray-400 group-hover:text-purple-600"></i>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed font-medium">${reply.text}</p>
            </div>
        `).join('');
        lucide.createIcons();
    }, 1500);
}

export function closeAiReplyModal() {
    document.getElementById('ai-reply-modal').classList.add('hidden');
}

export function selectReply(el) {
    el.classList.add('ring-2', 'ring-purple-600', 'bg-purple-50');
    const icon = el.querySelector('i');
    icon.setAttribute('data-lucide', 'check');
    icon.classList.add('text-green-500');
    lucide.createIcons();

    setTimeout(() => {
        closeAiReplyModal();
        alert('답글이 복사되었습니다! (클립보드)');
    }, 500);
}

function getRepliesByType(type) {
    if(type === 'delivery') {
        return [
            { tone: '🙇🏻‍♂️ 정중한 사과', color: 'text-brand-main', text: '고객님, 소중한 점심시간에 불편을 드려 정말 죄송합니다. ㅠㅠ 배달 기사님 배차가 늦어져 지연이 발생했습니다. 다음엔 꼭 따뜻하고 빠르게 받아보실 수 있도록 더 신경 쓰겠습니다!' },
            { tone: '🎁 보상 제안', color: 'text-purple-600', text: '많이 기다리셨죠, 너무 죄송합니다! 😭 너른 양해에 감사드리며, 다음에 주문 주실 때 요청사항에 "리뷰보고 왔어요" 남겨주시면 사이즈업 서비스 챙겨드리겠습니다.' },
            { tone: '💧 공감형', color: 'text-gray-500', text: '맛있게 드셔주셔서 감사해요! 다만 배달이 늦어 속상하셨겠어요.. 저 같아도 화났을 것 같아요. 😢 앞으로는 배달 업체와 더 긴밀히 소통해서 늦지 않게 하겠습니다.' }
        ];
    } else {
        return [
            { tone: '🥰 감동형', color: 'text-purple-600', text: '고객님의 칭찬 한마디에 오늘 피로가 싹 날아가네요! 😍 시그니처 라떼의 고소함을 알아봐 주셔서 감사합니다. 또 오세요!' },
            { tone: '✨ 위트있는', color: 'text-brand-main', text: '라떼 맛집 인정해주시니 어깨가 으쓱으쓱합니다! 💃 춤추면서 커피 내리고 있을게요, 또 주문해주세요!' },
            { tone: '☕️ 짧고 굵게', color: 'text-gray-500', text: '감사합니다 고객님! 변치 않는 맛으로 보답하겠습니다. 좋은 하루 보내세요 :)' }
        ];
    }
}

// Analytics Tabs
export function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const isActive = btn.dataset.tab === tabName;
        btn.classList.toggle('active', isActive);
        if (isActive) {
            btn.classList.remove('text-gray-500');
            btn.classList.add('bg-white', 'shadow-sm', 'text-gray-900');
        } else {
            btn.classList.add('text-gray-500');
            btn.classList.remove('bg-white', 'shadow-sm', 'text-gray-900');
        }
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('hidden', content.id !== `tab-${tabName}`);
    });
}

// Disclaimer Modal
export function openDisclaimerModal() {
    console.log("Opening Disclaimer Modal");
    const modal = document.getElementById('disclaimer-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    } else {
        console.error("Disclaimer modal not found");
    }
}

export function closeDisclaimerModal() {
    const modal = document.getElementById('disclaimer-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}

export function confirmDisclaimer() {
    closeDisclaimerModal();
    navigateTo('analysis');
    setTimeout(() => {
        resetFlow(); 
    }, 100);
}

// 전역으로 노출
window.addXP = addXP;
window.completeMission = completeMission;
window.showRewardModal = showRewardModal;
window.closeRewardModal = closeRewardModal;
window.showLifetimeFreeModal = showLifetimeFreeModal;
window.closeLifetimeFreeModal = closeLifetimeFreeModal;
window.showRandomAd = showRandomAd;
window.closeAdPopup = closeAdPopup;
window.showProvocativePopup = showProvocativePopup;
window.closeProvocativeModal = closeProvocativeModal;
window.startProvocativeFlow = startProvocativeFlow;
window.openAiReplyModal = openAiReplyModal;
window.closeAiReplyModal = closeAiReplyModal;
window.selectReply = selectReply;
window.switchTab = switchTab;
window.openDisclaimerModal = openDisclaimerModal;
window.closeDisclaimerModal = closeDisclaimerModal;
window.confirmDisclaimer = confirmDisclaimer;

