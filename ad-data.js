// 플랫폼 및 하위 옵션 데이터
const PLATFORM_DATA = [
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
function generatePlatformUI() {
    return PLATFORM_DATA.map((platform, pIdx) => `
        <div class="mb-6">
            <h3 class="font-bold text-gray-900 mb-3 ml-1">${platform.name}</h3>
            <div class="grid grid-cols-1 gap-2">
                ${platform.options.map((opt, oIdx) => `
                    <label class="flex items-center justify-between p-4 border border-gray-200 bg-white rounded-2xl cursor-pointer transition-all" 
                           onclick="toggleChannel(this)">
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