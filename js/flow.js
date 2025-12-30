import { generatePlatformUI } from '../ad-data.js';

// 플로우 단계별 HTML 생성 함수
export function getFlowStepHTML(step, selectedChannels = [], ocrData = {}) {
    let html = '';

    // STEP 0: Channel Select
    if (step === 0) {
        html = `
            <div class="animate-fade-in space-y-8">
                <div class="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-4 mb-4">
                    <div class="flex items-center gap-2 mb-2">
                        <i data-lucide="gift" class="w-5 h-5 text-yellow-600"></i>
                        <span class="text-sm font-black text-yellow-700">초기 고객 확보 특별 혜택</span>
                    </div>
                    <p class="text-xs text-gray-700 font-bold leading-relaxed">분석 → 진단 → 행동 솔루션까지 <span class="text-yellow-600 text-sm">100% 무료</span>로 제공합니다</p>
                </div>
                <div>
                    <h2 class="text-2xl font-black text-gray-900 mb-2">어떤 광고를 분석할까요?</h2>
                    <p class="text-gray-500 text-sm">이용 중인 광고 상품을 모두 선택해주세요.</p>
                </div>
                
                <div class="space-y-4">
                    ${generatePlatformUI()}
                </div>

                <button onclick="window.renderFlowStep(1)" class="w-full bg-brand-main text-white py-4 rounded-2xl font-bold text-lg mt-10 btn-press shadow-lg">다음</button>
            </div>
        `;
    }
    // STEP 1: Upload (OCR) - 여러 채널 지원
    else if (step === 1) {
        const channelCount = selectedChannels.length || 1;
        html = `
            <div class="animate-fade-in space-y-8">
                <div>
                    <h2 class="text-2xl font-black text-gray-900 mb-2">데이터 입력</h2>
                    <p class="text-gray-500 text-sm">선택하신 ${channelCount}개 채널의 관리자 페이지 화면을 캡처해서 올려주세요.<br>AI가 숫자를 자동으로 읽어옵니다.</p>
                </div>
                
                <div class="space-y-4" id="upload-containers">
                    ${selectedChannels.length > 0 ? selectedChannels.map((channelName, index) => `
                        <div class="upload-item" data-channel-index="${index}">
                            <div class="mb-2">
                                <span class="text-sm font-bold text-gray-700">${channelName}</span>
                                <span class="text-xs text-gray-500 ml-2">(${index + 1}/${channelCount})</span>
                            </div>
                            <div class="relative">
                                <input type="file" id="image-upload-${index}" accept="image/*" class="hidden" onchange="window.handleImageUpload(event, ${index}, '${channelName}')">
                                <div id="upload-area-${index}" class="border-2 border-dashed border-gray-300 rounded-[2rem] min-h-48 flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden group cursor-pointer hover:border-brand-main transition-colors" 
                                     onclick="document.getElementById('image-upload-${index}').click()"
                                     ondrop="window.handleDrop(event, ${index}, '${channelName}')" 
                                     ondragover="window.handleDragOver(event, ${index})" 
                                     ondragleave="window.handleDragLeave(event, ${index})">
                                    <div id="ocr-placeholder-${index}" class="flex flex-col items-center p-6">
                                        <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                            <i data-lucide="camera" class="w-6 h-6 text-gray-400"></i>
                                        </div>
                                        <p class="text-xs font-bold text-gray-400 mb-1">사진 촬영 또는 앨범 선택</p>
                                        <span class="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded font-bold">OCR 자동 인식</span>
                                    </div>
                                    <div id="ocr-preview-${index}" class="hidden w-full p-3">
                                        <img id="preview-image-${index}" src="" alt="업로드된 이미지" class="w-full max-h-48 object-contain rounded-xl mb-2">
                                        <button onclick="document.getElementById('image-upload-${index}').click()" class="w-full bg-gray-100 text-gray-600 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors">
                                            다른 이미지 선택
                                        </button>
                                    </div>
                                    <div id="ocr-loading-${index}" class="absolute inset-0 bg-black/70 backdrop-blur-sm hidden flex flex-col items-center justify-center z-10 rounded-[2rem]">
                                        <div class="w-full absolute top-0 h-1 bg-green-400 shadow-[0_0_15px_#4ade80] animate-scan"></div>
                                        <div class="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-3"></div>
                                        <p class="text-white font-bold text-sm mb-1 animate-pulse">이미지 분석 중...</p>
                                        <p id="ocr-progress-${index}" class="text-white/80 text-xs">OCR 엔진 로딩 중...</p>
                                    </div>
                                    <div id="ocr-result-${index}" class="hidden w-full p-4 bg-white rounded-xl border border-gray-200 shadow-lg">
                                        <div class="flex items-center gap-2 mb-3 text-green-600 font-bold text-sm">
                                            <i data-lucide="check-circle" class="w-4 h-4"></i>
                                            <span>인식 완료</span>
                                        </div>
                                        <div class="space-y-2">
                                            <div class="flex justify-between items-center p-2 bg-blue-50 rounded-lg border border-blue-100">
                                                <span class="text-gray-600 font-medium text-xs">노출수</span>
                                                <span id="ocr-impression-${index}" class="text-lg font-black text-brand-main">-</span>
                                            </div>
                                            <div class="flex justify-between items-center p-2 bg-purple-50 rounded-lg border border-purple-100">
                                                <span class="text-gray-600 font-medium text-xs">클릭수</span>
                                                <span id="ocr-click-${index}" class="text-lg font-black text-purple-600">-</span>
                                            </div>
                                            <div class="flex justify-between items-center p-2 bg-green-50 rounded-lg border border-green-100">
                                                <span class="text-gray-600 font-medium text-xs">전환수</span>
                                                <span id="ocr-conversion-${index}" class="text-lg font-black text-green-600">-</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="relative">
                            <input type="file" id="image-upload" accept="image/*" class="hidden" onchange="window.handleImageUpload(event)">
                            <div id="upload-area" class="border-2 border-dashed border-gray-300 rounded-[2rem] min-h-64 flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden group cursor-pointer hover:border-brand-main transition-colors" 
                                 onclick="document.getElementById('image-upload').click()"
                                 ondrop="window.handleDrop(event)" 
                                 ondragover="window.handleDragOver(event)" 
                                 ondragleave="window.handleDragLeave(event)">
                                <div id="ocr-placeholder" class="flex flex-col items-center p-8">
                                    <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                        <i data-lucide="camera" class="w-8 h-8 text-gray-400"></i>
                                    </div>
                                    <p class="text-sm font-bold text-gray-400 mb-2">사진 촬영 또는 앨범 선택</p>
                                    <span class="text-[10px] bg-gray-200 text-gray-500 px-2 py-1 rounded font-bold">OCR 자동 인식</span>
                                    <p class="text-xs text-gray-400 mt-4">JPG, PNG, WEBP 형식 지원</p>
                                </div>
                                <div id="ocr-preview" class="hidden w-full p-4">
                                    <img id="preview-image" src="" alt="업로드된 이미지" class="w-full max-h-64 object-contain rounded-xl mb-4">
                                    <button onclick="document.getElementById('image-upload').click()" class="w-full bg-gray-100 text-gray-600 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                                        다른 이미지 선택
                                    </button>
                                </div>
                                <div id="ocr-loading" class="absolute inset-0 bg-black/70 backdrop-blur-sm hidden flex flex-col items-center justify-center z-10 rounded-[2rem]">
                                    <div class="w-full absolute top-0 h-1 bg-green-400 shadow-[0_0_15px_#4ade80] animate-scan"></div>
                                    <div class="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
                                    <p class="text-white font-bold text-lg mb-2 animate-pulse">이미지 분석 중...</p>
                                    <p id="ocr-progress" class="text-white/80 text-sm">OCR 엔진 로딩 중...</p>
                                </div>
                                <div id="ocr-result" class="hidden w-full p-6 bg-white rounded-xl border border-gray-200 shadow-lg">
                                    <div class="flex items-center gap-2 mb-4 text-green-600 font-bold">
                                        <i data-lucide="check-circle" class="w-5 h-5"></i>
                                        <span>인식 완료</span>
                                    </div>
                                    <div class="space-y-3">
                                        <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <span class="text-gray-600 font-medium">노출수 (Impression)</span>
                                            <span id="ocr-impression" class="text-xl font-black text-brand-main">-</span>
                                        </div>
                                        <div class="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                                            <span class="text-gray-600 font-medium">클릭수 (Click)</span>
                                            <span id="ocr-click" class="text-xl font-black text-purple-600">-</span>
                                        </div>
                                        <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                                            <span class="text-gray-600 font-medium">전환수 (Conversion)</span>
                                            <span id="ocr-conversion" class="text-xl font-black text-green-600">-</span>
                                        </div>
                                    </div>
                                    <button onclick="document.getElementById('image-upload').click()" class="w-full mt-4 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                                        다시 분석하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    `}
                </div>
                
                <button id="btn-analyze" onclick="window.proceedToAnalysis()" class="w-full bg-gray-200 text-gray-500 py-4 rounded-2xl font-bold text-lg transition-all hidden hover:bg-brand-main hover:text-white btn-press">분석 시작하기</button>
            </div>
        `;
    }
    // STEP 2, 3, 4, 5는 기존 코드와 동일하게 유지 (나중에 분리 가능)
    // 현재는 기존 HTML에서 직접 사용
    
    return html;
}

