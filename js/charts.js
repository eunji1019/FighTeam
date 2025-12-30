// Note: ocrData, analysisChartInstance, salesChart are imported dynamically to avoid circular dependencies

export function initRoasChart() {
    const ctx = document.getElementById('roasChart');
    if(!ctx) return;
    
    // Dynamic import to avoid circular dependencies
    import('./app.js').then(module => {
        if(module.analysisChartInstance) module.analysisChartInstance.destroy();

        // Calculate channel-specific ROAS based on OCR data
        let channelData = [320, 180, 450, 90]; // Default values
        let channelColors = ['#E0E7FF', '#E0E7FF', '#2546A3', '#FF4D4D'];
        
        if (module.ocrData.impression && module.ocrData.click) {
            // Calculate base ROAS from OCR data
            const baseROAS = Math.round((module.ocrData.click / module.ocrData.impression) * 100 * 3.5); // Estimate
            
            // Distribute across channels with variation
            const primaryChannelIndex = 2; // 네이버 플레이스
            channelData[primaryChannelIndex] = Math.min(800, Math.max(200, baseROAS));
            
            // Other channels with relative performance
            channelData[0] = Math.round(channelData[primaryChannelIndex] * 0.75); // 배민: 75%
            channelData[1] = Math.round(channelData[primaryChannelIndex] * 0.50); // 쿠팡: 50%
            channelData[3] = Math.round(channelData[primaryChannelIndex] * 0.25); // 인스타: 25%
            
            // Update colors based on performance
            channelData.forEach((roas, index) => {
                if (roas >= 300) {
                    channelColors[index] = '#2546A3'; // Good (blue)
                } else if (roas >= 200) {
                    channelColors[index] = '#E0E7FF'; // Average (light blue)
                } else {
                    channelColors[index] = '#FF4D4D'; // Poor (red)
                }
            });
        }

        module.analysisChartInstance = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['배민', '쿠팡', '네이버', '인스타'],
                datasets: [{
                    label: 'ROAS',
                    data: channelData,
                    backgroundColor: channelColors,
                    borderRadius: 6,
                    barThickness: 24
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function(context) {
                                return 'ROAS: ' + context.parsed.y + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: { 
                        display: true,
                        beginAtZero: true,
                        ticks: { 
                            font: { family: 'Pretendard', size: 10 },
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: { 
                        grid: { display: false }, 
                        ticks: { font: { family: 'Pretendard', size: 11 } } 
                    }
                }
            }
        });
    });
}

export function initSalesChart() {
    const ctx = document.getElementById('sales-chart');
    if(!ctx) return;
    
    // Dynamic import to avoid circular dependencies
    import('./app.js').then(module => {
        if(module.salesChart) module.salesChart.destroy();

        const brandColor = '#2546A3';
        const lightColor = '#EEF2FA';
        const hoverColor = '#4976D3';

        // Generate weekly sales data based on OCR data
        let weeklyData = [450, 620, 320, 890, 550, 1120, 980]; // Default
        if (module.ocrData.click && module.ocrData.impression) {
            const avgDailyClicks = module.ocrData.click / 7;
            const baseValue = Math.round(avgDailyClicks * 100);
            
            weeklyData = [
                Math.round(baseValue * 0.8),   // 월
                Math.round(baseValue * 0.9),   // 화
                Math.round(baseValue * 0.7),   // 수
                Math.round(baseValue * 1.1),    // 목
                Math.round(baseValue * 0.9),   // 금
                Math.round(baseValue * 1.5),   // 토 (highest)
                Math.round(baseValue * 1.3)     // 일
            ];
        }

        const maxValue = Math.max(...weeklyData);
        const maxIndex = weeklyData.indexOf(maxValue);

        module.salesChart = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['월', '화', '수', '목', '금', '토', '일'],
                datasets: [{
                    data: weeklyData,
                    backgroundColor: weeklyData.map((val, idx) => 
                        idx === maxIndex ? brandColor : lightColor
                    ),
                    hoverBackgroundColor: hoverColor,
                    borderRadius: 8,
                    borderSkipped: false,
                    barThickness: 24,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: {
                    y: { display: false, min: 0 },
                    x: { grid: { display: false }, ticks: { font: { family: 'Pretendard', size: 12, weight: 'bold' }, color: '#9ca3af' } }
                },
                animation: { duration: 1000, easing: 'easeOutQuart' }
            }
        });
    });
}

// 전역으로 노출
window.initRoasChart = initRoasChart;
window.initSalesChart = initSalesChart;

