// OCR 유틸리티 함수

export function extractNumbersFromText(text, words = []) {
    console.log('=== OCR 분석 시작 ===');
    console.log('OCR 전체 텍스트:', text);
    console.log('OCR 단어 수:', words.length);
    
    // Keywords for matching
    const keywords = {
        impression: ['노출', '노출수', 'impression', '노불', '노출 수', '노출수', '노출 수', '노출수:', '노출:', 'impressions'],
        click: ['클릭', '클릭수', 'click', '클릭 수', '클릭수:', '클릭:', 'clicks'],
        conversion: ['전환', '전환수', 'conversion', '주문', '주문수', 'order', '전환 수', '주문 수', '전환수:', '주문수:', '전환:', '주문:', 'orders', 'conversions']
    };

    // 숫자 패턴
    const numberPatterns = [
        /\d{1,3}(?:[,，]\d{3})+/g,
        /\d{1,3}(?:\s\d{3})+/g,
        /\d{1,3}(?:\.\d{3})+/g,
        /\d{4,}/g,
        /\d{1,3}(?:[,，]\d{3})*(?:\.\d+)?/g
    ];
    
    // 모든 숫자 추출
    let allNumberStrings = [];
    numberPatterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
            allNumberStrings = allNumberStrings.concat(matches);
        }
    });
    
    // 중복 제거 및 숫자로 변환
    const uniqueNumbers = [...new Set(allNumberStrings)]
        .map(numStr => {
            const cleaned = numStr.replace(/[,，\s\.]/g, '');
            const num = parseInt(cleaned);
            return isNaN(num) ? null : num;
        })
        .filter(num => num !== null && num >= 10)
        .sort((a, b) => b - a);

    console.log('추출된 모든 숫자:', uniqueNumbers);

    // 결과 객체 초기화
    const result = {
        impression: null,
        click: null,
        conversion: null
    };

    // Method 1: Words 배열을 활용한 위치 기반 매칭
    if (words && words.length > 0) {
        words.forEach((word, index) => {
            const wordText = word.text.toLowerCase();
            
            let matchedType = null;
            if (keywords.impression.some(kw => wordText.includes(kw.toLowerCase()))) {
                matchedType = 'impression';
            } else if (keywords.click.some(kw => wordText.includes(kw.toLowerCase()))) {
                matchedType = 'click';
            } else if (keywords.conversion.some(kw => wordText.includes(kw.toLowerCase()))) {
                matchedType = 'conversion';
            }
            
            if (matchedType) {
                for (let i = Math.max(0, index - 3); i < Math.min(words.length, index + 5); i++) {
                    const nearbyWord = words[i];
                    const nearbyText = nearbyWord.text;
                    const numberMatch = nearbyText.match(/\d{1,3}(?:[,，\s]\d{3})*|\d{4,}/);
                    
                    if (numberMatch) {
                        const numValue = parseInt(numberMatch[0].replace(/[,，\s]/g, ''));
                        if (numValue >= 10 && (!result[matchedType] || numValue > result[matchedType])) {
                            result[matchedType] = numValue;
                            console.log(`${matchedType} 매칭: ${numValue} (키워드: ${wordText})`);
                        }
                    }
                }
            }
        });
    }

    // Method 2: 텍스트 라인 기반 키워드 매칭
    const lines = text.split(/\n|\r\n/);
    lines.forEach((line, lineIndex) => {
        const lineLower = line.toLowerCase().trim();
        if (!lineLower) return;
        
        const numbersInLine = line.match(/\d{1,3}(?:[,，\s]\d{3})*|\d{4,}/g);
        
        if (numbersInLine && numbersInLine.length > 0) {
            numbersInLine.forEach(numStr => {
                const numValue = parseInt(numStr.replace(/[,，\s]/g, ''));
                if (numValue < 10) return;
                
                if (keywords.impression.some(kw => lineLower.includes(kw.toLowerCase()))) {
                    if (!result.impression || numValue > result.impression) {
                        result.impression = numValue;
                        console.log(`라인 ${lineIndex}에서 impression 매칭: ${numValue}`);
                    }
                }
                if (keywords.click.some(kw => lineLower.includes(kw.toLowerCase()))) {
                    if (!result.click || numValue > result.click) {
                        result.click = numValue;
                        console.log(`라인 ${lineIndex}에서 click 매칭: ${numValue}`);
                    }
                }
                if (keywords.conversion.some(kw => lineLower.includes(kw.toLowerCase()))) {
                    if (!result.conversion || numValue > result.conversion) {
                        result.conversion = numValue;
                        console.log(`라인 ${lineIndex}에서 conversion 매칭: ${numValue}`);
                    }
                }
            });
        }
    });

    // Method 3: 키워드 매칭이 실패한 경우 크기 기반 추정
    if (!result.impression && !result.click && !result.conversion && uniqueNumbers.length > 0) {
        console.log('키워드 매칭 실패, 크기 기반 추정 사용');
        result.impression = uniqueNumbers[0] || null;
        result.click = uniqueNumbers[1] || uniqueNumbers[0] || null;
        result.conversion = uniqueNumbers[2] || null;
    }
    // Method 4: 일부만 매칭된 경우 나머지 채우기
    else {
        if (!result.impression && uniqueNumbers.length > 0) {
            const available = uniqueNumbers.filter(n => n !== result.click && n !== result.conversion);
            if (available.length > 0) {
                result.impression = available[0];
                console.log('impression을 크기 기반으로 채움:', result.impression);
            }
        }
        if (!result.click && uniqueNumbers.length > 1) {
            const available = uniqueNumbers.filter(n => n !== result.impression && n !== result.conversion);
            if (available.length > 0) {
                result.click = available[0];
                console.log('click을 크기 기반으로 채움:', result.click);
            }
        }
        if (!result.conversion && uniqueNumbers.length > 2) {
            const available = uniqueNumbers.filter(n => n !== result.impression && n !== result.click);
            if (available.length > 0) {
                result.conversion = available[0];
                console.log('conversion을 크기 기반으로 채움:', result.conversion);
            }
        }
    }

    console.log('=== 최종 추출 결과 ===');
    console.log('Impression:', result.impression);
    console.log('Click:', result.click);
    console.log('Conversion:', result.conversion);
    console.log('==================');
    
    return result;
}

