// 플랫폼 및 하위 옵션 데이터
export const PLATFORM_DATA = [
    {
        name: "배달의민족",
        options: ["배민1플러스", "울트라콜", "우리가게클릭"]
    },
    {
        name: "쿠팡이츠",
        options: ["스마트요금제", "매출 연동"]
    },
    {
        name: "요기요",
        options: ["요기요 라이트", "추천광고"]
    },
    {
        name: "네이버",
        options: ["플레이스 상위 노출", "파워링크", "블로그 마케팅 대행"]
    },
    {
        name: "SNS/커뮤니티",
        options: ["인스타그램 마케팅 대행", "당근마켓 마케팅 대행", "유튜브 마케팅 대행"]
    }
];

// HTML 생성 함수
export function generatePlatformUI() {
    return PLATFORM_DATA.map((platform, pIdx) => `
        <div class="mb-6">
            <h3 class="font-bold text-gray-900 mb-3 ml-1">${platform.name}</h3>
            <div class="grid grid-cols-1 gap-2">
                ${platform.options.map((opt, oIdx) => `
                    <label class="flex items-center justify-between p-4 border border-gray-200 bg-white rounded-2xl cursor-pointer transition-all" 
                           onclick="window.toggleChannel(this)">
                        <span class="font-bold text-gray-500">${opt}</span>
                        <div class="w-6 h-6 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-white transition-all">
                            <i data-lucide="check" class="w-4 h-4 opacity-0"></i>
                        </div>
                    </label>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// 채널 토글 함수 (전역으로 노출)
export function toggleChannel(el) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const checkbox = el.querySelector('.w-6');
    const icon = checkbox.querySelector('i');
    const text = el.querySelector('span');
    const channelName = text.textContent.trim();
    
    // 선택된 채널 관리 (동적 import)
    import('./js/app.js').then(module => {
        // Check current state by border color
        if (el.classList.contains('border-brand-main')) {
            // Uncheck
            el.classList.remove('border-brand-main', 'bg-blue-50', 'border-2');
            el.classList.add('border-gray-200', 'bg-white', 'border');
            
            checkbox.classList.remove('bg-brand-main', 'border-transparent');
            checkbox.classList.add('bg-gray-100', 'border-gray-200', 'border');
            
            icon.classList.add('opacity-0');
            
            text.classList.remove('text-gray-900');
            text.classList.add('text-gray-500');
            
            // 선택된 채널에서 제거
            module.selectedChannels = module.selectedChannels.filter(name => name !== channelName);
        } else {
            // Check
            el.classList.remove('border-gray-200', 'bg-white', 'border');
            el.classList.add('border-brand-main', 'bg-blue-50', 'border-2');
            
            checkbox.classList.remove('bg-gray-100', 'border-gray-200', 'border');
            checkbox.classList.add('bg-brand-main', 'border-transparent');
            
            icon.classList.remove('opacity-0');
            
            text.classList.remove('text-gray-500');
            text.classList.add('text-gray-900');
            
            // 선택된 채널에 추가
            if (!module.selectedChannels.includes(channelName)) {
                module.selectedChannels.push(channelName);
            }
        }
        
        console.log('선택된 채널:', module.selectedChannels);
    });
}

// 전역으로 노출
if (typeof window !== 'undefined') {
    window.toggleChannel = toggleChannel;
}