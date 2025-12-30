// 전역 상태 관리
export let currentStep = 0;
export let analysisChartInstance = null;
export let salesChart = null;
export let currentXP = 1450;
export const maxXP = 2000;
export let provocativeShown = false;
export let selectedChannels = [];
export let ocrDataArray = [];
export let ocrData = {
    impression: null,
    click: null,
    conversion: null
};

// Navigation 함수
export function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`view-${screenId}`).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-brand-main');
        btn.classList.add('text-gray-400');
        btn.querySelector('span').classList.remove('font-bold');
        btn.querySelector('span').classList.add('font-medium');
    });
    const activeBtn = document.querySelector(`.nav-btn[data-target="${screenId}"]`);
    if(activeBtn) {
        activeBtn.classList.remove('text-gray-400');
        activeBtn.classList.add('text-brand-main');
        activeBtn.querySelector('span').classList.remove('font-medium');
        activeBtn.querySelector('span').classList.add('font-bold');
    }
    
    if(screenId === 'analytics') {
        // Update revenue display with OCR data
        if (ocrData.click && ocrData.impression) {
            const weeklyClicks = ocrData.click;
            const avgOrderValue = 15000;
            const conversionRate = ocrData.conversion ? (ocrData.conversion / ocrData.click) : 0.05;
            const weeklyRevenue = Math.round(weeklyClicks * conversionRate * avgOrderValue);
            const revenueEl = document.getElementById('weekly-revenue');
            const changeEl = document.getElementById('revenue-change');
            
            if (revenueEl) {
                revenueEl.textContent = weeklyRevenue.toLocaleString() + '원';
            }
            if (changeEl) {
                const ctr = (ocrData.click / ocrData.impression) * 100;
                const change = ctr >= 3 ? Math.round(5 + Math.random() * 10) : Math.round(-5 + Math.random() * 10);
                changeEl.textContent = change >= 0 ? `+${change}%` : `${change}%`;
                changeEl.className = change >= 0 ? 
                    'text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100' :
                    'text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100';
            }
        }
        
        if (!salesChart) {
            setTimeout(() => {
                import('./charts.js').then(module => module.initSalesChart());
            }, 100);
        } else {
            import('./charts.js').then(module => module.initSalesChart());
        }
    }
    
    lucide.createIcons();
}

// Flow Management
export function resetFlow() {
    currentStep = 0;
    selectedChannels = [];
    ocrDataArray = [];
    ocrData = { impression: null, click: null, conversion: null };
    renderFlowStep(0);
}

export function renderFlowStep(step) {
    currentStep = step;
    const contentDiv = document.getElementById('flow-content');
    const titleEl = document.getElementById('flow-title');
    const progressEl = document.getElementById('flow-progress');
    
    if (!contentDiv || !titleEl || !progressEl) {
        console.error('Flow elements not found');
        return;
    }
    
    // Update Progress & Title
    if(step <= 2) { 
        titleEl.innerText = "1단계: 분석"; 
        progressEl.className = "bg-brand-main h-full w-1/4 transition-all"; 
    }
    else if(step <= 3) { 
        titleEl.innerText = "2단계: 진단"; 
        progressEl.className = "bg-status-warning h-full w-2/4 transition-all"; 
    }
    else { 
        titleEl.innerText = "3단계: 행동"; 
        progressEl.className = "bg-status-danger h-full w-3/4 transition-all"; 
    }

    // Import and use flow steps
    import('./flow.js').then(module => {
        const html = module.getFlowStepHTML(step, selectedChannels, ocrData);
        if (html) {
            contentDiv.innerHTML = html;
            lucide.createIcons();
        } else {
            // Fallback: use legacy code if flow.js doesn't handle this step
            console.warn('Flow step not handled by module, using legacy code');
        }
    }).catch(err => {
        console.error('Error loading flow module:', err);
    });
}

// 전역으로 노출
window.navigateTo = navigateTo;
window.renderFlowStep = renderFlowStep;
window.resetFlow = resetFlow;

