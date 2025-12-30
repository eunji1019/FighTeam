import { ocrData, ocrDataArray, selectedChannels, renderFlowStep } from './app.js';
import { extractNumbersFromText } from './ocr-utils.js';

// 이미지 업로드 핸들러 (단일 이미지용 - 하위 호환)
export async function handleImageUpload(event, channelIndex = null, channelName = null) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
    }

    // 여러 채널 지원
    if (channelIndex !== null && channelName !== null) {
        await handleMultiChannelUpload(file, channelIndex, channelName);
    } else {
        // 단일 이미지 업로드 (기존 방식)
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewImg = document.getElementById('preview-image');
            const placeholder = document.getElementById('ocr-placeholder');
            const preview = document.getElementById('ocr-preview');
            const result = document.getElementById('ocr-result');
            
            if (previewImg) {
                previewImg.src = e.target.result;
                placeholder.classList.add('hidden');
                preview.classList.remove('hidden');
                result.classList.add('hidden');
            }
        };
        reader.readAsDataURL(file);
        await performOCR(file);
    }
}

// 여러 채널용 이미지 업로드
async function handleMultiChannelUpload(file, channelIndex, channelName) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewImg = document.getElementById(`preview-image-${channelIndex}`);
        const placeholder = document.getElementById(`ocr-placeholder-${channelIndex}`);
        const preview = document.getElementById(`ocr-preview-${channelIndex}`);
        const result = document.getElementById(`ocr-result-${channelIndex}`);
        
        if (previewImg) {
            previewImg.src = e.target.result;
            placeholder.classList.add('hidden');
            preview.classList.remove('hidden');
            result.classList.add('hidden');
        }
    };
    reader.readAsDataURL(file);
    await performOCR(file, channelIndex, channelName);
}

// OCR 수행 함수
export async function performOCR(imageFile, channelIndex = null, channelName = null) {
    const loading = document.getElementById(channelIndex !== null ? `ocr-loading-${channelIndex}` : 'ocr-loading');
    const progress = document.getElementById(channelIndex !== null ? `ocr-progress-${channelIndex}` : 'ocr-progress');
    const result = document.getElementById(channelIndex !== null ? `ocr-result-${channelIndex}` : 'ocr-result');
    const preview = document.getElementById(channelIndex !== null ? `ocr-preview-${channelIndex}` : 'ocr-preview');
    const btn = document.getElementById('btn-analyze');

    // Show loading
    loading.classList.remove('hidden');
    loading.classList.add('flex');
    preview.classList.add('hidden');

    try {
        const imageUrl = URL.createObjectURL(imageFile);

        const worker = await Tesseract.createWorker('kor+eng', 1, {
            logger: m => {
                if (m.status === 'recognizing text') {
                    const progressPercent = Math.round(m.progress * 100);
                    if (progress) {
                        progress.textContent = `텍스트 인식 중... ${progressPercent}%`;
                    }
                } else if (m.status === 'loading language traineddata') {
                    if (progress) {
                        progress.textContent = 'OCR 엔진 로딩 중...';
                    }
                } else if (m.status === 'initializing tesseract') {
                    if (progress) {
                        progress.textContent = 'OCR 엔진 초기화 중...';
                    }
                }
            }
        });

        await worker.setParameters({
            tessedit_char_whitelist: '0123456789,노출수클릭수전환수주문수ImpressionClickConversionOrder',
            tessedit_pageseg_mode: '6',
        });

        const { data: { text, words } } = await worker.recognize(imageUrl);
        
        await worker.terminate();
        URL.revokeObjectURL(imageUrl);

        const extractedData = extractNumbersFromText(text, words);
        
        // 여러 채널 지원
        if (channelIndex !== null && channelName !== null) {
            ocrDataArray[channelIndex] = {
                channelName: channelName,
                impression: extractedData.impression,
                click: extractedData.click,
                conversion: extractedData.conversion
            };
            
            // UI 업데이트
            const impressionEl = document.getElementById(`ocr-impression-${channelIndex}`);
            const clickEl = document.getElementById(`ocr-click-${channelIndex}`);
            const conversionEl = document.getElementById(`ocr-conversion-${channelIndex}`);
            
            if (impressionEl) {
                impressionEl.textContent = extractedData.impression ? extractedData.impression.toLocaleString() : '-';
            }
            if (clickEl) {
                clickEl.textContent = extractedData.click ? extractedData.click.toLocaleString() : '-';
            }
            if (conversionEl) {
                conversionEl.textContent = extractedData.conversion ? extractedData.conversion.toLocaleString() : '-';
            }
            
            // 모든 채널의 데이터가 준비되었는지 확인
            const allReady = ocrDataArray.length === selectedChannels.length && 
                             ocrDataArray.every(data => data && (data.impression || data.click));
            
            if (btn && allReady) {
                btn.classList.remove('hidden', 'bg-gray-200', 'text-gray-500');
                btn.classList.add('bg-brand-main', 'text-white', 'shadow-lg');
            }
        } else {
            // 단일 이미지 업로드 (기존 방식)
            ocrData.impression = extractedData.impression;
            ocrData.click = extractedData.click;
            ocrData.conversion = extractedData.conversion;
            
            const impressionEl = document.getElementById('ocr-impression');
            const clickEl = document.getElementById('ocr-click');
            const conversionEl = document.getElementById('ocr-conversion');
            
            if (impressionEl) {
                impressionEl.textContent = extractedData.impression ? extractedData.impression.toLocaleString() : '-';
            }
            if (clickEl) {
                clickEl.textContent = extractedData.click ? extractedData.click.toLocaleString() : '-';
            }
            if (conversionEl) {
                conversionEl.textContent = extractedData.conversion ? extractedData.conversion.toLocaleString() : '-';
            }
            
            if (btn && (extractedData.impression || extractedData.click || extractedData.conversion)) {
                btn.classList.remove('hidden', 'bg-gray-200', 'text-gray-500');
                btn.classList.add('bg-brand-main', 'text-white', 'shadow-lg');
            }
        }
        
        // Update UI
        loading.classList.add('hidden');
        loading.classList.remove('flex');
        result.classList.remove('hidden');
        
        if (progress) {
            progress.textContent = '✅ 인식 완료!';
            progress.classList.add('text-green-400');
        }

        lucide.createIcons();
    } catch (error) {
        console.error('OCR Error:', error);
        loading.classList.add('hidden');
        loading.classList.remove('flex');
        alert('OCR 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
}

// 분석 진행 함수
export function proceedToAnalysis() {
    // 여러 채널 데이터 합산
    if (ocrDataArray.length > 0) {
        ocrData.impression = ocrDataArray.reduce((sum, data) => sum + (data?.impression || 0), 0);
        ocrData.click = ocrDataArray.reduce((sum, data) => sum + (data?.click || 0), 0);
        ocrData.conversion = ocrDataArray.reduce((sum, data) => sum + (data?.conversion || 0), 0);
    }
    
    console.log('분석 시작 - 통합 OCR 데이터:', ocrData);
    console.log('채널별 데이터:', ocrDataArray);
    
    if (!ocrData.impression && !ocrData.click) {
        alert('노출수 또는 클릭수 데이터가 필요합니다. 이미지를 업로드해주세요.');
        return;
    }
    
    if (!ocrData.impression && ocrData.click) {
        ocrData.impression = Math.round(ocrData.click / 0.03);
        console.log('Impression 추정:', ocrData.impression);
    }
    
    renderFlowStep(2);
}

// Drag and Drop 핸들러
export function handleDragOver(event, channelIndex = null) {
    event.preventDefault();
    event.stopPropagation();
    const uploadArea = document.getElementById(channelIndex !== null ? `upload-area-${channelIndex}` : 'upload-area');
    if (uploadArea) {
        uploadArea.classList.add('border-brand-main', 'bg-blue-50');
    }
}

export function handleDragLeave(event, channelIndex = null) {
    event.preventDefault();
    event.stopPropagation();
    const uploadArea = document.getElementById(channelIndex !== null ? `upload-area-${channelIndex}` : 'upload-area');
    if (uploadArea) {
        uploadArea.classList.remove('border-brand-main', 'bg-blue-50');
    }
}

export function handleDrop(event, channelIndex = null, channelName = null) {
    event.preventDefault();
    event.stopPropagation();
    
    const uploadArea = document.getElementById(channelIndex !== null ? `upload-area-${channelIndex}` : 'upload-area');
    if (uploadArea) {
        uploadArea.classList.remove('border-brand-main', 'bg-blue-50');
    }

    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.match('image.*')) {
            if (channelIndex !== null && channelName !== null) {
                const fakeEvent = {
                    target: {
                        files: [file]
                    }
                };
                handleImageUpload(fakeEvent, channelIndex, channelName);
            } else {
                const fakeEvent = {
                    target: {
                        files: [file]
                    }
                };
                handleImageUpload(fakeEvent);
            }
        } else {
            alert('이미지 파일만 업로드 가능합니다.');
        }
    }
}

// 전역으로 노출
window.handleImageUpload = handleImageUpload;
window.proceedToAnalysis = proceedToAnalysis;
window.handleDragOver = handleDragOver;
window.handleDragLeave = handleDragLeave;
window.handleDrop = handleDrop;

