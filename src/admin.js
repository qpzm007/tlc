import { siteData, initFirebase, loadFirebaseImages } from './data.js';
import { db, storage } from './firebase.js';
import { doc, updateDoc, setDoc } from "firebase/firestore";

// DOM Elements
const loginModal = document.getElementById('login-modal');
const adminLayout = document.getElementById('admin-layout');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const tabs = document.querySelectorAll('.admin-tab');
const mainContent = document.getElementById('main-content');

function updateBrandNameUI() {
    const name = siteData?.brand?.name || "CMS";
    const loginEl = document.getElementById('login-brand-name');
    if (loginEl) loginEl.innerHTML = `${name}<span class="text-brand-500">CMS</span>`;
    const sidebarEl = document.getElementById('sidebar-brand-name');
    if (sidebarEl) sidebarEl.innerHTML = `${name}<span class="text-brand-500">CMS</span>`;
}

// Authentication Check
function checkAuth() {
    if(siteData && siteData.brand) updateBrandNameUI();
    const brandName = siteData?.brand?.name || "";
    document.title = brandName ? `${brandName} - CMS Admin` : "CMS Admin";
    updateInquiryBadge();
    const isLoggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
    if (isLoggedIn) {
        loginModal.classList.add('hidden');
        adminLayout.classList.remove('hidden');
        renderDashboard(); // Default view
    } else {
        loginModal.classList.remove('hidden');
        adminLayout.classList.add('hidden');
    }
}

async function saveSiteDataToFirebase() {
    try {
        const docRef = doc(db, "app", "siteData");
        await setDoc(docRef, siteData);
        updateBrandNameUI();
        const brandName = siteData?.brand?.name || "";
        document.title = brandName ? `${brandName} - CMS Admin` : "CMS Admin";
        alert("성공적으로 저장되었습니다! (DB 반영 완료)");
    } catch (error) {
        console.error("Error saving data: ", error);
        alert("저장 중 오류가 발생했습니다.");
    }
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('admin-id').value;
    const pw = document.getElementById('admin-pw').value;
    
    const validId = siteData?.adminAccount?.id || 'admin';
    const validPw = siteData?.adminAccount?.pw || 'admin1234';

    if (id === validId && pw === validPw) {
        sessionStorage.setItem('admin_logged_in', 'true');
        loginError.classList.add('hidden');
        checkAuth();
    } else {
        loginError.classList.remove('hidden');
    }
});

logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('admin_logged_in');
    checkAuth();
});

// Tab Navigation
tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Reset active state
        tabs.forEach(t => {
            t.classList.remove('text-brand-400', 'bg-brand-500/10', 'border-r-2', 'border-brand-500');
            t.classList.add('text-gray-400');
        });

        // Set active state
        tab.classList.remove('text-gray-400');
        tab.classList.add('text-brand-400', 'bg-brand-500/10', 'border-r-2', 'border-brand-500');

        // Render content based on tab
        const tabName = tab.getAttribute('data-tab');
        if (tabName === 'dashboard') renderDashboard();
        if (tabName === 'company') renderCompanyAdmin();
        if (tabName === 'company_details') window.renderCompanyDetailsAdmin();
        if (tabName === 'certs') renderCertsAdmin();
        if (tabName === 'products') renderProductsAdmin();
        if (tabName === 'equipment') renderEquipmentAdmin();
        if (tabName === 'uitext') renderUITextAdmin();
        if (tabName === 'clients') renderClientsAdmin();
        if (tabName === 'inquiries') renderInquiriesAdmin();
        if (tabName === 'account') renderAccountAdmin();
    });
});

// --- Views ---

function renderDashboard() {
    // Check if new inquiries exist to show notification
    const newInquiries = siteData.inquiries ? siteData.inquiries.filter(i => i.status === 'new').length : 0;
    
    mainContent.innerHTML = `
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-white mb-2">대시보드</h1>
            <p class="text-gray-400">관리자 시스템에 오신 것을 환영합니다.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${newInquiries > 0 ? `
            <div class="bg-brand-500/20 p-6 rounded-xl border border-brand-500/50 cursor-pointer hover:bg-brand-500/30 transition" onclick="document.querySelector('[data-tab=\\'inquiries\\']').click()">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-brand-400 font-bold">신규 문의</h3>
                    <i class="ph ph-bell text-2xl text-brand-400 animate-pulse"></i>
                </div>
                <p class="text-3xl font-bold text-white">${newInquiries}건</p>
                <p class="text-sm text-brand-300 mt-2">클릭하여 확인하기</p>
            </div>
            ` : `
            <div class="bg-metal-800 p-6 rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition" onclick="document.querySelector('[data-tab=\\'inquiries\\']').click()">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-gray-400 font-bold">총 문의 건수</h3>
                    <i class="ph ph-envelope text-2xl text-gray-500"></i>
                </div>
                <p class="text-3xl font-bold text-white">${siteData.inquiries ? siteData.inquiries.length : 0}건</p>
            </div>
            `}
            <div class="bg-metal-800 p-6 rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition" onclick="document.querySelector('[data-tab=\\'products\\']').click()">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-gray-400 font-bold">등록된 제품</h3>
                    <i class="ph ph-cube text-2xl text-gray-500"></i>
                </div>
                <p class="text-3xl font-bold text-white">${siteData.products.length}</p>
            </div>
            <div class="bg-metal-800 p-6 rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition" onclick="document.querySelector('[data-tab=\\'equipment\\']').click()">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-gray-400 font-bold">등록된 주요 설비</h3>
                    <i class="ph ph-wrench text-2xl text-gray-500"></i>
                </div>
                <p class="text-3xl font-bold text-white">${siteData.equipment.length}</p>
            </div>
            <div class="bg-metal-800 p-6 rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition" onclick="document.querySelector('[data-tab=\\'certs\\']').click()">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-gray-400 font-bold">인증서 관리</h3>
                    <i class="ph ph-certificate text-2xl text-gray-500"></i>
                </div>
                <p class="text-3xl font-bold text-white">${siteData.company.certs.length}</p>
            </div>
            <div class="bg-metal-800 p-6 rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition" onclick="document.querySelector('[data-tab=\\'clients\\']').click()">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-gray-400 font-bold">고객사 로고</h3>
                    <i class="ph ph-users text-2xl text-gray-500"></i>
                </div>
                <p class="text-3xl font-bold text-white">${siteData.clients.length}</p>
            </div>
            <div class="bg-metal-800 p-6 rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition" onclick="document.querySelector('[data-tab=\\'account\\']').click()">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-gray-400 font-bold">계정 관리</h3>
                    <i class="ph ph-lock-key text-2xl text-gray-500"></i>
                </div>
                <p class="text-sm text-white mt-2">아이디/비밀번호 변경</p>
            </div>
        </div>
    `;
}

function renderAccountAdmin() {
    const currentId = siteData?.adminAccount?.id || 'admin';
    mainContent.innerHTML = `
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-white mb-2">관리자 계정 설정</h1>
            <p class="text-gray-400">관리자 시스템에 로그인하기 위한 아이디와 비밀번호를 변경할 수 있습니다.</p>
        </div>
        <div class="max-w-xl bg-metal-800 p-8 rounded-xl border border-white/5">
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-bold text-gray-400 mb-2">현재 계정 아이디</label>
                    <input type="text" id="acc-id" value="${currentId}" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand-500">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-400 mb-2">새 비밀번호 (비워두면 기존 유지)</label>
                    <input type="password" id="acc-pw" placeholder="새로운 비밀번호 입력" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand-500">
                </div>
                <button id="save-account-btn" class="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-4 rounded-md transition duration-300 flex items-center justify-center">
                    <i class="ph ph-floppy-disk mr-2"></i> 계정 정보 저장
                </button>
                <p class="text-xs text-brand-400 text-center mt-2">⚠️ 저장 시 안전을 위해 강제로 로그아웃되며, 새 계정 정보로 다시 로그인하셔야 합니다.</p>
            </div>
        </div>
    `;

    document.getElementById('save-account-btn').addEventListener('click', async () => {
        const newId = document.getElementById('acc-id').value.trim();
        const newPw = document.getElementById('acc-pw').value;
        
        if (!newId) {
            alert("아이디는 비워둘 수 없습니다.");
            return;
        }

        if (!siteData.adminAccount) siteData.adminAccount = {};
        siteData.adminAccount.id = newId;
        if (newPw) siteData.adminAccount.pw = newPw;

        await saveSiteDataToFirebase();
        alert("계정 정보가 변경되었습니다. 다시 로그인 해주세요.");
        
        // Force logout
        sessionStorage.removeItem('admin_logged_in');
        checkAuth();
    });
}

function renderCompanyAdmin() {
    mainContent.innerHTML = `
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-white mb-2">회사 정보 관리</h1>
            <p class="text-gray-400">회사 기본 정보, CEO 인사말 및 인증서 현황을 수정합니다.</p>
        </div>
        <div class="bg-metal-800 p-6 rounded-xl border border-white/5 space-y-6 mb-6">
            <h2 class="text-xl font-bold text-white border-b border-white/10 pb-2 mb-4">브랜드 설정</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-white mb-2">회사명 (브랜드)</label>
                    <input type="text" id="company-name" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500" value="${siteData.brand.name}">
                </div>
                <div>
                    <label class="block text-sm font-medium text-white mb-2">로고 이미지 URL</label>
                    <input type="text" id="company-logo" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500 image-upload-target" value="${siteData.brand.logoUrl}" placeholder="비워두면 기본 아이콘 사용">
                    <p class="text-xs text-gray-500 mt-1">이미지를 복사/붙여넣기 하거나 URL을 입력하세요.</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-white mb-2">메인 배경 이미지 URL</label>
                    <input type="text" id="hero-bg" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500 image-upload-target" value="${siteData.brand.heroBgUrl || ''}" placeholder="비워두면 기본 공장 이미지 사용">
                    <p class="text-xs text-gray-500 mt-1">메인 화면 텍스트 뒤에 깔리는 배경 이미지입니다.</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-white mb-2">초기 접속 언어 (Default)</label>
                    <select id="default-lang" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                        <option value="ko" ${siteData.brand.defaultLang !== 'en' ? 'selected' : ''}>한국어 (KO)</option>
                        <option value="en" ${siteData.brand.defaultLang === 'en' ? 'selected' : ''}>영어 (EN)</option>
                    </select>
                    <p class="text-xs text-gray-500 mt-1">방문자가 사이트에 처음 접속했을 때 보게 될 언어입니다.</p>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/5">
                <div>
                    <label class="block text-sm font-medium text-white mb-2">홈페이지 테마 설정</label>
                    <select id="theme-preset" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                        <option value="default" ${siteData.brand.themePreset === 'default' ? 'selected' : ''}>기본 테마 (Midnight Navy)</option>
                        <option value="dark" ${siteData.brand.themePreset === 'dark' ? 'selected' : ''}>시크 블랙 (Dark Charcoal)</option>
                        <option value="light" ${siteData.brand.themePreset === 'light' ? 'selected' : ''}>소프트 라이트 (Soft Warm Light)</option>
                        <option value="classic" ${siteData.brand.themePreset === 'classic' ? 'selected' : ''}>클래식 샌드 (Classic Warm Sand)</option>
                        <option value="monochrome" ${siteData.brand.themePreset === 'monochrome' ? 'selected' : ''}>모던 모노크롬 (Modern Monochrome)</option>
                        <option value="custom" ${siteData.brand.themePreset === 'custom' ? 'selected' : ''}>사용자 정의 색상 (Custom Color)</option>
                    </select>
                    <p class="text-xs text-gray-500 mt-1">디자이너가 큐레이션한 5가지 정밀 테마Preset입니다.</p>
                </div>
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <label class="block text-sm font-medium text-white">메인 배경 이미지 투명도</label>
                        <span id="hero-bg-opacity-val" class="text-brand-400 font-bold text-sm">${siteData.brand.heroBgOpacity !== undefined ? siteData.brand.heroBgOpacity : 30}%</span>
                    </div>
                    <input type="range" id="hero-bg-opacity" min="0" max="100" class="w-full accent-brand-500 h-2 bg-metal-900 rounded-lg appearance-none cursor-pointer" value="${siteData.brand.heroBgOpacity !== undefined ? siteData.brand.heroBgOpacity : 30}">
                    <p class="text-xs text-gray-500 mt-1">메인 화면 배경 이미지의 불투명도를 설정합니다. (0% ~ 100%)</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-white mb-2">전체 홈페이지 배경색</label>
                    <div class="flex items-center space-x-2">
                        <input type="color" id="company-bg-color" class="w-10 h-10 bg-transparent border border-white/10 rounded cursor-pointer" value="${siteData.brand.bgColor || '#0f172a'}">
                        <input type="text" id="company-bg-color-hex" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500 uppercase text-center" value="${siteData.brand.bgColor || '#0F172A'}">
                    </div>
                    <p class="text-xs text-gray-500 mt-1">테마를 '사용자 정의 색상'으로 설정 시 직접 변경할 수 있습니다.</p>
                </div>
            </div>
        </div>
        <div class="bg-metal-800 p-6 rounded-xl border border-white/5 space-y-6 mb-6">
            <h2 class="text-xl font-bold text-white border-b border-white/10 pb-2 mb-4">연락처 및 오시는 길 (카카오/네이버 지도)</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-white mb-2">전화번호</label>
                    <input type="text" id="contact-phone" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500" value="${siteData.contact.phone || ''}">
                </div>
                <div>
                    <label class="block text-sm font-medium text-white mb-2">팩스번호</label>
                    <input type="text" id="contact-fax" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500" value="${siteData.contact.fax || ''}">
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-white mb-2">이메일</label>
                    <input type="text" id="contact-email" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500" value="${siteData.contact.email || ''}">
                </div>
                <div>
                    <label class="block text-sm font-medium text-white mb-2">지도 이미지 URL (복사한 이미지 창 클릭 후 Ctrl+V 가능)</label>
                    <input type="text" id="contact-map" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500" value="${siteData.contact.mapImage || ''}">
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-white mb-2">이메일 안내 문구 (한국어)</label>
                    <input type="text" id="contact-email-label-ko" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500" value="${siteData.i18n?.ko?.contactEmailLabel || '프로젝트 문의 및 도면 접수'}">
                </div>
                <div>
                    <label class="block text-sm font-medium text-white mb-2">이메일 안내 문구 (영문)</label>
                    <input type="text" id="contact-email-label-en" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500" value="${siteData.i18n?.en?.contactEmailLabel || 'Project Inquiry & Blueprint Submission'}">
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-white mb-2">전화번호 안내 문구 (한국어)</label>
                    <input type="text" id="contact-phone-label-ko" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500" value="${siteData.i18n?.ko?.contactPhoneLabel || '고객 지원 센터'}">
                </div>
                <div>
                    <label class="block text-sm font-medium text-white mb-2">전화번호 안내 문구 (영문)</label>
                    <input type="text" id="contact-phone-label-en" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500" value="${siteData.i18n?.en?.contactPhoneLabel || 'Customer Support Center'}">
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-white mb-2">주소 (한국어)</label>
                    <input type="text" id="location-ko" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500" value="${siteData.location.ko}">
                </div>
                <div>
                    <label class="block text-sm font-medium text-white mb-2">주소 (영문)</label>
                    <input type="text" id="location-en" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500" value="${siteData.location.en}">
                </div>
            </div>
        </div>
        <div class="bg-metal-800 p-6 rounded-xl border border-white/5 space-y-6">
            <h2 class="text-xl font-bold text-white border-b border-white/10 pb-2 mb-4">CEO 인사말</h2>
            <div>
                <label class="block text-sm font-medium text-white mb-2">CEO 인사말 (KO)</label>
                <!-- Pseudo WYSIWYG Editor -->
                <div class="border border-white/10 rounded-md bg-metal-900 mb-6">
                    <div class="border-b border-white/10 p-2 flex space-x-2 text-gray-400">
                        <button class="hover:text-white"><i class="ph ph-text-b"></i></button>
                        <button class="hover:text-white"><i class="ph ph-text-italic"></i></button>
                        <button class="hover:text-white"><i class="ph ph-link"></i></button>
                    </div>
                    <textarea id="company-ceo-ko" class="w-full bg-transparent border-0 p-4 text-white focus:ring-0" rows="5">${siteData.company.ceoMsg.ko.replace(/<br>/g, '\n')}</textarea>
                </div>
                
                <label class="block text-sm font-medium text-white mb-2">CEO 인사말 (EN)</label>
                <!-- Pseudo WYSIWYG Editor -->
                <div class="border border-white/10 rounded-md bg-metal-900">
                    <div class="border-b border-white/10 p-2 flex space-x-2 text-gray-400">
                        <button class="hover:text-white"><i class="ph ph-text-b"></i></button>
                        <button class="hover:text-white"><i class="ph ph-text-italic"></i></button>
                        <button class="hover:text-white"><i class="ph ph-link"></i></button>
                    </div>
                    <textarea id="company-ceo-en" class="w-full bg-transparent border-0 p-4 text-white focus:ring-0" rows="5">${siteData.company.ceoMsg.en.replace(/<br>/g, '\n')}</textarea>
                </div>
            </div>
            <div class="flex justify-end">
                <button id="save-company-btn" class="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-6 rounded-md transition flex items-center">
                    <i class="ph ph-floppy-disk mr-2"></i> 변경사항 저장
                </button>
            </div>
        </div>
    `;

    // Live update for opacity slider & color picker & theme preset
    const themeSelect = document.getElementById('theme-preset');
    const opacitySlider = document.getElementById('hero-bg-opacity');
    const opacityVal = document.getElementById('hero-bg-opacity-val');
    const colorPicker = document.getElementById('company-bg-color');
    const colorHex = document.getElementById('company-bg-color-hex');

    const themeColors = {
        default: '#0F172A',
        dark: '#121212',
        light: '#F8FAFC',
        classic: '#FCFAF7',
        monochrome: '#000000'
    };

    function updateColorPickerState() {
        const selectedTheme = themeSelect.value;
        if (selectedTheme === 'custom') {
            colorPicker.disabled = false;
            colorHex.disabled = false;
        } else {
            colorPicker.disabled = true;
            colorHex.disabled = true;
            const presetColor = themeColors[selectedTheme];
            if (presetColor) {
                colorPicker.value = presetColor;
                colorHex.value = presetColor;
            }
        }
    }

    themeSelect.addEventListener('change', updateColorPickerState);
    updateColorPickerState(); // Init state

    opacitySlider.addEventListener('input', () => {
        opacityVal.textContent = opacitySlider.value + '%';
    });

    colorPicker.addEventListener('input', () => {
        colorHex.value = colorPicker.value.toUpperCase();
    });
    colorHex.addEventListener('input', () => {
        const val = colorHex.value;
        if (/^#[0-9A-F]{6}$/i.test(val)) {
            colorPicker.value = val;
        }
    });

    document.getElementById('save-company-btn').addEventListener('click', () => {
        siteData.brand.name = document.getElementById('company-name').value;
        siteData.brand.logoUrl = document.getElementById('company-logo').value;
        siteData.brand.heroBgUrl = document.getElementById('hero-bg').value;
        siteData.brand.defaultLang = document.getElementById('default-lang').value;
        siteData.brand.heroBgOpacity = parseInt(opacitySlider.value, 10);
        siteData.brand.bgColor = colorPicker.value;
        siteData.brand.themePreset = themeSelect.value;
        
        siteData.company.ceoMsg.ko = document.getElementById('company-ceo-ko').value.replace(/\n/g, '<br>');
        siteData.company.ceoMsg.en = document.getElementById('company-ceo-en').value.replace(/\n/g, '<br>');
        siteData.contact.phone = document.getElementById('contact-phone').value;
        siteData.contact.fax = document.getElementById('contact-fax').value;
        siteData.contact.email = document.getElementById('contact-email').value;
        siteData.contact.mapImage = document.getElementById('contact-map').value;
        
        if (!siteData.i18n) siteData.i18n = { ko: {}, en: {} };
        siteData.i18n.ko.contactEmailLabel = document.getElementById('contact-email-label-ko').value;
        siteData.i18n.en.contactEmailLabel = document.getElementById('contact-email-label-en').value;
        siteData.i18n.ko.contactPhoneLabel = document.getElementById('contact-phone-label-ko').value;
        siteData.i18n.en.contactPhoneLabel = document.getElementById('contact-phone-label-en').value;

        siteData.location.ko = document.getElementById('location-ko').value;
        siteData.location.en = document.getElementById('location-en').value;
        saveSiteDataToFirebase();
    });
}

function renderCertsAdmin() {
    mainContent.innerHTML = `
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold text-white mb-2">인증서 관리</h1>
                <p class="text-gray-400">인증서 이미지는 클립보드에 복사(Ctrl+C)한 후 추가/수정 창에서 붙여넣기(Ctrl+V)하여 바로 업로드할 수 있습니다.</p>
            </div>
            <button onclick="window.openCertModal()" class="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-4 rounded-md transition flex items-center">
                <i class="ph ph-plus mr-2"></i> 새 인증서 추가
            </button>
        </div>
        
        <div class="grid grid-cols-1 gap-4" id="certs-list">
            ${siteData.company.certs.map((c, index) => `
                <div class="bg-metal-800 p-4 rounded-lg border border-white/5 flex justify-between items-center transition opacity-${c.featured !== false ? '100' : '50'}">
                    <div class="flex items-center">
                        <input type="checkbox" class="cert-feature-toggle mr-4 w-5 h-5 accent-brand-500 cursor-pointer" data-index="${index}" ${c.featured !== false ? 'checked' : ''} title="메인 화면 노출">
                        ${c.img ? (c.img.startsWith('http') || c.img.startsWith('img_') || c.img.startsWith('data:image') ? `<img data-img-id="${c.img}" src="${c.img.startsWith('data:image') ? c.img : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" class="${c.img.startsWith('data:image') ? '' : 'lazy-firebase-image'} w-12 h-12 rounded object-cover mr-4">` : `<i class="ph ${c.img} text-2xl text-brand-500 mr-4"></i>`) : `<div class="w-12 h-12 bg-metal-900 rounded flex items-center justify-center mr-4"><i class="ph ph-image text-gray-600"></i></div>`}
                        <div>
                            <h4 class="text-white font-bold">${c.name}</h4>
                            <p class="text-sm text-gray-400 mb-1"><span class="text-xs border border-white/20 px-1 rounded mr-1">KO</span>${c.detail}</p>
                            <p class="text-sm text-gray-500"><span class="text-xs border border-white/20 px-1 rounded mr-1">EN</span>${c.enDetail}</p>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="window.openCertModal(${index})" class="p-2 text-gray-400 hover:text-white bg-white/5 rounded-md"><i class="ph ph-pencil-simple"></i></button>
                        <button onclick="window.deleteCert(${index})" class="p-2 text-red-400 hover:text-red-300 bg-white/5 rounded-md"><i class="ph ph-trash"></i></button>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <!-- Cert Modal -->
        <div id="cert-modal" class="fixed inset-0 z-[60] hidden items-center justify-center bg-black/80 backdrop-blur-sm">
            <div class="bg-metal-800 p-6 rounded-2xl shadow-2xl w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
                <h2 id="cert-modal-title" class="text-2xl font-bold text-white mb-6">인증서 추가</h2>
                <input type="hidden" id="cert-index" value="-1">
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-white mb-1">인증서 이미지 URL (복사한 이미지 창 클릭 후 Ctrl+V 로 업로드 가능)</label>
                        <input type="text" id="cert-img" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-white mb-1">인증서명</label>
                        <input type="text" id="cert-name" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-white mb-1">상세 설명 (KO)</label>
                            <input type="text" id="cert-detail" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-white mb-1">상세 설명 (EN)</label>
                            <input type="text" id="cert-endetail" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                        </div>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" id="cert-featured" class="w-5 h-5 accent-brand-500 cursor-pointer mr-2">
                        <label class="text-white text-sm">메인 화면에 노출 (Featured)</label>
                    </div>
                </div>
                
                <div class="flex justify-end space-x-3 mt-8">
                    <button onclick="document.getElementById('cert-modal').classList.replace('flex', 'hidden')" class="px-6 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition">취소</button>
                    <button onclick="window.saveCert()" class="px-6 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-500 transition">저장</button>
                </div>
            </div>
        </div>
    `;

    document.querySelectorAll('.cert-feature-toggle').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const index = e.target.getAttribute('data-index');
            siteData.company.certs[index].featured = e.target.checked;
            saveSiteDataToFirebase();
            renderCertsAdmin(); // Re-render to update opacity
        });
    });

    loadFirebaseImages();
}

// Global functions for Certs
window.openCertModal = function(index = -1) {
    const modal = document.getElementById('cert-modal');
    const isEdit = index >= 0;
    document.getElementById('cert-modal-title').innerText = isEdit ? '인증서 수정' : '새 인증서 추가';
    document.getElementById('cert-index').value = index;
    
    if (isEdit) {
        const c = siteData.company.certs[index];
        document.getElementById('cert-img').value = c.img || '';
        document.getElementById('cert-name').value = c.name || '';
        document.getElementById('cert-detail').value = c.detail || '';
        document.getElementById('cert-endetail').value = c.enDetail || '';
        document.getElementById('cert-featured').checked = c.featured !== false;
    } else {
        document.getElementById('cert-img').value = '';
        document.getElementById('cert-name').value = '';
        document.getElementById('cert-detail').value = '';
        document.getElementById('cert-endetail').value = '';
        document.getElementById('cert-featured').checked = true;
    }
    
    modal.classList.replace('hidden', 'flex');
};

window.saveCert = function() {
    const index = parseInt(document.getElementById('cert-index').value);
    const c = {
        id: index >= 0 && siteData.company.certs[index].id ? siteData.company.certs[index].id : 'c' + Date.now(),
        img: document.getElementById('cert-img').value,
        name: document.getElementById('cert-name').value,
        detail: document.getElementById('cert-detail').value,
        enDetail: document.getElementById('cert-endetail').value,
        featured: document.getElementById('cert-featured').checked
    };
    
    if (index >= 0) {
        siteData.company.certs[index] = c;
    } else {
        siteData.company.certs.push(c);
    }
    
    saveSiteDataToFirebase();
    document.getElementById('cert-modal').classList.replace('flex', 'hidden');
    renderCertsAdmin();
};

window.deleteCert = function(index) {
    if (confirm("정말로 이 인증서를 삭제하시겠습니까?")) {
        siteData.company.certs.splice(index, 1);
        saveSiteDataToFirebase();
        renderCertsAdmin();
    }
};

function renderProductsAdmin() {
    mainContent.innerHTML = `
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold text-white mb-2">제품 & 포트폴리오 관리</h1>
                <p class="text-gray-400">포트폴리오 이미지는 클립보드에 복사(Ctrl+C)한 후 추가/수정 창에서 붙여넣기(Ctrl+V)하여 바로 업로드할 수 있습니다.</p>
            </div>
            <button onclick="window.openProductModal()" class="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-4 rounded-md transition flex items-center">
                <i class="ph ph-plus mr-2"></i> 새 제품 추가
            </button>
        </div>
        
        <div class="grid grid-cols-1 gap-4" id="products-list">
            ${siteData.products.map((p, index) => `
                <div class="bg-metal-800 p-4 rounded-lg border border-white/5 flex justify-between items-center transition opacity-${p.featured ? '100' : '50'}">
                    <div class="flex items-center">
                        <input type="checkbox" class="prod-feature-toggle mr-4 w-5 h-5 accent-brand-500 cursor-pointer" data-index="${index}" ${p.featured ? 'checked' : ''} title="메인 화면 노출">
                        ${p.img.startsWith('http') || p.img.startsWith('img_') ? `<img data-img-id="${p.img}" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" class="lazy-firebase-image w-12 h-12 rounded object-cover mr-4">` : `<i class="ph ${p.img} text-2xl text-brand-500 mr-4"></i>`}
                        <div>
                            <h4 class="text-white font-bold">${p.ko.title} <span class="text-xs text-brand-400 font-normal ml-2">EN: ${p.en.title}</span></h4>
                            <p class="text-sm text-gray-400 mb-1"><span class="text-xs border border-white/20 px-1 rounded mr-1">KO</span>${p.ko.desc}</p>
                            <p class="text-sm text-gray-500"><span class="text-xs border border-white/20 px-1 rounded mr-1">EN</span>${p.en.desc}</p>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="window.openProductModal(${index})" class="p-2 text-gray-400 hover:text-white bg-white/5 rounded-md"><i class="ph ph-pencil-simple"></i></button>
                        <button onclick="window.deleteProduct(${index})" class="p-2 text-red-400 hover:text-red-300 bg-white/5 rounded-md"><i class="ph ph-trash"></i></button>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <!-- Product Modal -->
        <div id="product-modal" class="fixed inset-0 z-[60] hidden items-center justify-center bg-black/80 backdrop-blur-sm">
            <div class="bg-metal-800 p-6 rounded-2xl shadow-2xl w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
                <h2 id="product-modal-title" class="text-2xl font-bold text-white mb-6">제품 추가</h2>
                <input type="hidden" id="product-index" value="-1">
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-white mb-1">이미지 URL (복사한 이미지 창 클릭 후 Ctrl+V 로 업로드 가능)</label>
                        <input type="text" id="product-img" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-white mb-1">제품명 (KO)</label>
                            <input type="text" id="product-title-ko" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-white mb-1">제품명 (EN)</label>
                            <input type="text" id="product-title-en" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-white mb-1">제품 설명 (KO)</label>
                        <textarea id="product-desc-ko" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500" rows="3"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-white mb-1">제품 설명 (EN)</label>
                        <textarea id="product-desc-en" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500" rows="3"></textarea>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" id="product-featured" class="w-5 h-5 accent-brand-500 cursor-pointer mr-2">
                        <label class="text-white text-sm">메인 화면에 노출 (Featured)</label>
                    </div>
                </div>
                
                <div class="flex justify-end space-x-3 mt-8">
                    <button onclick="document.getElementById('product-modal').classList.replace('flex', 'hidden')" class="px-6 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition">취소</button>
                    <button onclick="window.saveProduct()" class="px-6 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-500 transition">저장</button>
                </div>
            </div>
        </div>
    `;

    document.querySelectorAll('.prod-feature-toggle').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const index = e.target.getAttribute('data-index');
            siteData.products[index].featured = e.target.checked;
            saveSiteDataToFirebase();
            renderProductsAdmin(); // Re-render to update opacity
        });
    });

    loadFirebaseImages();
}

// Global functions for Products
window.openProductModal = function(index = -1) {
    const modal = document.getElementById('product-modal');
    const isEdit = index >= 0;
    document.getElementById('product-modal-title').innerText = isEdit ? '제품 수정' : '새 제품 추가';
    document.getElementById('product-index').value = index;
    
    if (isEdit) {
        const p = siteData.products[index];
        document.getElementById('product-img').value = p.img || '';
        document.getElementById('product-title-ko').value = p.ko.title || '';
        document.getElementById('product-title-en').value = p.en.title || '';
        document.getElementById('product-desc-ko').value = p.ko.desc || '';
        document.getElementById('product-desc-en').value = p.en.desc || '';
        document.getElementById('product-featured').checked = p.featured;
    } else {
        document.getElementById('product-img').value = '';
        document.getElementById('product-title-ko').value = '';
        document.getElementById('product-title-en').value = '';
        document.getElementById('product-desc-ko').value = '';
        document.getElementById('product-desc-en').value = '';
        document.getElementById('product-featured').checked = true;
    }
    
    modal.classList.replace('hidden', 'flex');
};

window.saveProduct = function() {
    const index = parseInt(document.getElementById('product-index').value);
    const p = {
        id: index >= 0 ? siteData.products[index].id : 'p' + Date.now(),
        img: document.getElementById('product-img').value,
        featured: document.getElementById('product-featured').checked,
        ko: {
            title: document.getElementById('product-title-ko').value,
            desc: document.getElementById('product-desc-ko').value
        },
        en: {
            title: document.getElementById('product-title-en').value,
            desc: document.getElementById('product-desc-en').value
        }
    };
    
    if (index >= 0) {
        siteData.products[index] = p;
    } else {
        siteData.products.push(p);
    }
    
    document.getElementById('product-modal').classList.replace('flex', 'hidden');
    saveSiteDataToFirebase();
    renderProductsAdmin();
};

window.deleteProduct = function(index) {
    if(confirm('정말 삭제하시겠습니까?')) {
        siteData.products.splice(index, 1);
        saveSiteDataToFirebase();
        renderProductsAdmin();
    }
};

function renderEquipmentAdmin() {
    mainContent.innerHTML = `
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold text-white mb-2">설비 관리</h1>
                <p class="text-gray-400">보유 설비를 추가하고 관리할 수 있습니다.</p>
            </div>
            <button onclick="window.openEquipmentModal()" class="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-4 rounded-md transition flex items-center">
                <i class="ph ph-plus mr-2"></i> 장비 추가
            </button>
        </div>

        <div class="bg-metal-800 rounded-xl border border-white/5 overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-black/50 text-gray-400 text-sm">
                        <th class="p-4 font-medium">장비명</th>
                        <th class="p-4 font-medium">모델명/수량</th>
                        <th class="p-4 font-medium">설명</th>
                        <th class="p-4 font-medium">관리</th>
                    </tr>
                </thead>
                <tbody class="text-white divide-y divide-white/5">
                    ${siteData.equipment.map((eq, index) => `
                        <tr class="hover:bg-white/5 transition group opacity-${eq.featured ? '100' : '50'}">
                            <td class="p-4 flex items-center">
                                <input type="checkbox" class="eq-feature-toggle mr-4 w-5 h-5 accent-brand-500 cursor-pointer" data-index="${index}" ${eq.featured ? 'checked' : ''} title="메인 화면 노출">
                                ${eq.img ? `<img data-img-id="${eq.img}" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" class="lazy-firebase-image w-12 h-12 rounded object-cover mr-3">` : `<div class="w-12 h-12 bg-metal-900 rounded flex items-center justify-center mr-3"><i class="ph ph-image text-gray-500"></i></div>`}
                                <span class="font-bold">${eq.name}</span>
                            </td>
                            <td class="p-4 text-brand-400">${eq.spec}</td>
                            <td class="p-4 text-sm">
                                <div class="text-gray-300 mb-1"><span class="text-xs border border-white/20 px-1 rounded mr-1 text-gray-500">KO</span>${eq.ko}</div>
                                <div class="text-gray-500"><span class="text-xs border border-white/20 px-1 rounded mr-1 text-gray-600">EN</span>${eq.en}</div>
                            </td>
                            <td class="p-4">
                                <button onclick="window.openEquipmentModal(${index})" class="text-gray-500 hover:text-white mr-2"><i class="ph ph-pencil-simple text-lg"></i></button>
                                <button onclick="window.deleteEquipment(${index})" class="text-gray-500 hover:text-red-400"><i class="ph ph-trash text-lg"></i></button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <!-- Equipment Modal -->
        <div id="equipment-modal" class="fixed inset-0 z-[60] hidden items-center justify-center bg-black/80 backdrop-blur-sm">
            <div class="bg-metal-800 p-6 rounded-2xl shadow-2xl w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
                <h2 id="equipment-modal-title" class="text-2xl font-bold text-white mb-6">설비 추가</h2>
                <input type="hidden" id="eq-index" value="-1">
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-white mb-1">장비 이미지 URL (Ctrl+V 로 붙여넣기 업로드 가능)</label>
                        <input type="text" id="eq-img" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-white mb-1">장비명</label>
                            <input type="text" id="eq-name" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-white mb-1">모델명 및 수량 (예: X-700 / 2대)</label>
                            <input type="text" id="eq-spec" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-white mb-1">장비 설명 (KO)</label>
                        <textarea id="eq-desc-ko" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500" rows="2"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-white mb-1">장비 설명 (EN)</label>
                        <textarea id="eq-desc-en" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500" rows="2"></textarea>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" id="eq-featured" class="w-5 h-5 accent-brand-500 cursor-pointer mr-2">
                        <label class="text-white text-sm">메인 화면에 노출 (Featured)</label>
                    </div>
                </div>
                
                <div class="flex justify-end space-x-3 mt-8">
                    <button onclick="document.getElementById('equipment-modal').classList.replace('flex', 'hidden')" class="px-6 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition">취소</button>
                    <button onclick="window.saveEquipment()" class="px-6 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-500 transition">저장</button>
                </div>
            </div>
        </div>
    `;

    document.querySelectorAll('.eq-feature-toggle').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const index = e.target.getAttribute('data-index');
            siteData.equipment[index].featured = e.target.checked;
            saveSiteDataToFirebase();
            renderEquipmentAdmin(); // Re-render to update opacity
        });
    });

    loadFirebaseImages();
}

// Global functions for Equipment
window.openEquipmentModal = function(index = -1) {
    const modal = document.getElementById('equipment-modal');
    const isEdit = index >= 0;
    document.getElementById('equipment-modal-title').innerText = isEdit ? '설비 수정' : '새 설비 추가';
    document.getElementById('eq-index').value = index;
    
    if (isEdit) {
        const eq = siteData.equipment[index];
        document.getElementById('eq-img').value = eq.img || '';
        document.getElementById('eq-name').value = eq.name || '';
        document.getElementById('eq-spec').value = eq.spec || '';
        document.getElementById('eq-desc-ko').value = eq.ko || '';
        document.getElementById('eq-desc-en').value = eq.en || '';
        document.getElementById('eq-featured').checked = eq.featured;
    } else {
        document.getElementById('eq-img').value = '';
        document.getElementById('eq-name').value = '';
        document.getElementById('eq-spec').value = '';
        document.getElementById('eq-desc-ko').value = '';
        document.getElementById('eq-desc-en').value = '';
        document.getElementById('eq-featured').checked = true;
    }
    
    modal.classList.replace('hidden', 'flex');
};

window.saveEquipment = function() {
    const index = parseInt(document.getElementById('eq-index').value);
    const eq = {
        img: document.getElementById('eq-img').value,
        name: document.getElementById('eq-name').value,
        spec: document.getElementById('eq-spec').value,
        featured: document.getElementById('eq-featured').checked,
        ko: document.getElementById('eq-desc-ko').value,
        en: document.getElementById('eq-desc-en').value
    };
    
    if (index >= 0) {
        siteData.equipment[index] = eq;
    } else {
        siteData.equipment.push(eq);
    }
    
    document.getElementById('equipment-modal').classList.replace('flex', 'hidden');
    saveSiteDataToFirebase();
    renderEquipmentAdmin();
};

window.deleteEquipment = function(index) {
    if(confirm('정말 삭제하시겠습니까?')) {
        siteData.equipment.splice(index, 1);
        saveSiteDataToFirebase();
        renderEquipmentAdmin();
    }
};

function renderClientsAdmin() {
    mainContent.innerHTML = `
        <div class="mb-8 flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold text-white mb-2">고객사 로고 관리</h1>
                <p class="text-gray-400">텍스트 기반 이름 또는 이미지 로고를 등록합니다.</p>
            </div>
            <button onclick="window.openClientModal()" class="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-4 rounded-md transition flex items-center">
                <i class="ph ph-plus mr-2"></i> 새 고객사 추가
            </button>
        </div>
        <div class="flex flex-wrap gap-4 mb-8">
            ${siteData.clients.map((c, index) => {
                const isObj = typeof c === 'object';
                const name = isObj ? c.name : c;
                const img = isObj ? c.img : '';
                return `
                <div class="bg-metal-800 px-6 py-4 rounded-lg border border-white/10 text-white font-bold flex flex-col items-center hover:border-brand-500 transition">
                    ${img ? (img.startsWith('http') || img.startsWith('img_') ? `<img data-img-id="${img}" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" class="lazy-firebase-image h-12 mb-3 object-contain filter grayscale hover:grayscale-0 transition">` : `<i class="ph ${img} text-4xl text-brand-500 mb-3"></i>`) : ''}
                    <span>${name}</span>
                    <div class="mt-4 flex space-x-2">
                        <button onclick="window.openClientModal(${index})" class="text-gray-500 hover:text-white bg-white/5 p-1 rounded"><i class="ph ph-pencil-simple"></i></button>
                        <button onclick="window.deleteClient(${index})" class="text-gray-500 hover:text-red-400 bg-white/5 p-1 rounded"><i class="ph ph-trash"></i></button>
                    </div>
                </div>
                `;
            }).join('')}
        </div>

        <!-- Client Modal -->
        <div id="client-modal" class="fixed inset-0 z-[60] hidden items-center justify-center bg-black/80 backdrop-blur-sm">
            <div class="bg-metal-800 p-6 rounded-2xl shadow-2xl w-full max-w-lg border border-white/10">
                <h2 id="client-modal-title" class="text-2xl font-bold text-white mb-6">고객사 추가</h2>
                <input type="hidden" id="client-index" value="-1">
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-white mb-1">고객사 이름 (필수)</label>
                        <input type="text" id="client-name" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-white mb-1">이미지 URL (복사한 이미지 창 클릭 후 Ctrl+V 가능)</label>
                        <input type="text" id="client-img" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                    </div>
                </div>
                
                <div class="flex justify-end space-x-3 mt-8">
                    <button onclick="document.getElementById('client-modal').classList.replace('flex', 'hidden')" class="px-6 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition">취소</button>
                    <button onclick="window.saveClient()" class="px-6 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-500 transition">저장</button>
                </div>
            </div>
        </div>
    `;
    setTimeout(() => {
        setupImagePaste();
        loadFirebaseImages(); // Load lazy images if any
    }, 100);
}

window.openClientModal = function(index = -1) {
    const modal = document.getElementById('client-modal');
    document.getElementById('client-modal-title').innerText = index >= 0 ? '고객사 수정' : '새 고객사 추가';
    document.getElementById('client-index').value = index;
    
    if (index >= 0) {
        const c = siteData.clients[index];
        const isObj = typeof c === 'object';
        document.getElementById('client-name').value = isObj ? c.name : c;
        document.getElementById('client-img').value = isObj ? (c.img || '') : '';
    } else {
        document.getElementById('client-name').value = '';
        document.getElementById('client-img').value = '';
    }
    
    modal.classList.replace('hidden', 'flex');
    setTimeout(() => document.getElementById('client-name').focus(), 100);
};

window.saveClient = function() {
    const index = parseInt(document.getElementById('client-index').value);
    const name = document.getElementById('client-name').value;
    const img = document.getElementById('client-img').value;
    
    if (!name.trim()) return alert("고객사 이름을 입력하세요.");

    const clientData = { name: name.trim(), img: img.trim() };
    
    if (index >= 0) {
        siteData.clients[index] = clientData;
    } else {
        siteData.clients.push(clientData);
    }
    
    document.getElementById('client-modal').classList.replace('flex', 'hidden');
    saveSiteDataToFirebase();
    renderClientsAdmin();
};

window.deleteClient = function(index) {
    if(confirm('삭제하시겠습니까?')) {
        siteData.clients.splice(index, 1);
        saveSiteDataToFirebase();
        renderClientsAdmin();
    }
};

function updateInquiryBadge() {
    const badge = document.getElementById('inquiry-badge');
    if (!badge || !siteData.inquiries) return;
    const newCount = siteData.inquiries.filter(i => i.status === 'new').length;
    if (newCount > 0) {
        badge.innerText = newCount;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function renderInquiriesAdmin() {
    const inquiries = siteData.inquiries || [];
    updateInquiryBadge();
    
    mainContent.innerHTML = `
        <div class="mb-8 flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold text-white mb-2">온라인 문의 내역</h1>
                <p class="text-gray-400">웹사이트를 통해 접수된 견적 및 문의 사항입니다. (총 ${inquiries.length}건)</p>
            </div>
        </div>
        <div class="space-y-4">
            ${inquiries.length === 0 ? '<p class="text-gray-500 py-10 text-center">접수된 문의 내역이 없습니다.</p>' : inquiries.map((inq, index) => `
            <div class="bg-metal-800 p-6 rounded-xl border border-white/5 ${inq.status === 'new' ? 'border-l-4 border-l-brand-500' : 'opacity-70'}">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <span class="${inq.status === 'new' ? 'bg-brand-500/20 text-brand-400' : 'bg-gray-700 text-gray-300'} text-xs px-2 py-1 rounded font-bold mr-2 cursor-pointer hover:bg-brand-500 hover:text-white transition" onclick="window.toggleInquiryStatus(${index})" title="상태 변경">
                            ${inq.status === 'new' ? '신규 대기' : '확인 완료'}
                        </span>
                        <span class="text-gray-400 text-sm">${inq.date}</span>
                    </div>
                    <button onclick="window.deleteInquiry(${index})" class="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded text-sm transition"><i class="ph ph-trash mr-1"></i>삭제</button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4 bg-black/20 p-4 rounded-lg">
                    <div><span class="text-gray-500">회사/담당자:</span> <span class="text-white ml-2">${inq.company}</span></div>
                    <div><span class="text-gray-500">연락처:</span> <span class="text-white ml-2">${inq.contact}</span></div>
                </div>
                <div class="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">${inq.details}</div>
            </div>
            `).join('')}
        </div>
    `;
}

window.toggleInquiryStatus = function(index) {
    const inq = siteData.inquiries[index];
    inq.status = inq.status === 'new' ? 'completed' : 'new';
    saveSiteDataToFirebase();
    renderInquiriesAdmin();
};

window.deleteInquiry = function(index) {
    if(confirm('이 문의 내역을 정말 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.')) {
        siteData.inquiries.splice(index, 1);
        saveSiteDataToFirebase();
        renderInquiriesAdmin();
    }
};

// Global Image Paste Logic
function setupImagePaste() {
    const dropArea = document.getElementById('image-upload-area');
    if (!dropArea) return;

    // Drag and Drop styles
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
}

// True Global Paste Handler for ANY Input field with WebP Compression
document.addEventListener('paste', async (e) => {
    const activeElement = document.activeElement;
    if (activeElement && activeElement.tagName === 'INPUT' && activeElement.type === 'text') {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            if (item.kind === 'file' && item.type.startsWith('image/')) {
                e.preventDefault();
                const file = item.getAsFile();
                
                // Show uploading state
                const originalValue = activeElement.value;
                activeElement.value = "1. 이미지 압축 중...";
                activeElement.disabled = true;

                try {
                    // 1) Load image to Canvas for resizing & compression
                    const img = new Image();
                    img.src = URL.createObjectURL(file);
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                    });
                    
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    let width = img.width;
                    let height = img.height;
                    const MAX_WIDTH = 1200; // Optimize for text DB limit
                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // 2) Export as WebP Base64 String
                    activeElement.value = "2. 데이터베이스에 업로드 중...";
                    const base64Data = canvas.toDataURL('image/webp', 0.85);
                    if (!base64Data || base64Data === 'data:,') throw new Error("Canvas export failed");
                    
                    // 3) Upload to Firestore 'images' collection
                    const imgId = 'img_' + Date.now();
                    await setDoc(doc(db, "images", imgId), { imageUrl: base64Data });
                    
                    activeElement.value = imgId;
                    // Trigger input event to update frameworks/listeners
                    activeElement.dispatchEvent(new Event('input', { bubbles: true }));
                } catch (error) {
                    console.error("Upload failed", error);
                    activeElement.value = originalValue;
                    
                    alert("이미지 업로드에 실패했습니다.\\n상세: " + error.message);
                } finally {
                    activeElement.disabled = false;
                }
                break; // Only process the first image found
            }
        }
    }
});

function renderUITextAdmin() {
    const keys = Object.keys(siteData.i18n.ko);
    const groups = [
        { name: "📑 탭 제목 (Browser Tab Titles)", match: key => key.startsWith('pageTitle') },
        { name: "🎯 메인 비주얼 (Hero)", match: key => key.startsWith('hero') || key.startsWith('btn') },
        { name: "🏢 회사 소개", match: key => key.startsWith('company') || key.startsWith('ceo') || key.toLowerCase().includes('cert') },
        { name: "⚙️ 제품 및 포트폴리오", match: key => key.toLowerCase().includes('product') },
        { name: "🏭 보유 설비", match: key => key.toLowerCase().includes('equip') },
        { name: "🤝 고객사", match: key => key.startsWith('client') },
        { name: "📍 위치 및 오시는 길", match: key => key.startsWith('location') || key.startsWith('map') },
        { name: "📝 견적 문의 (Contact & CTA)", match: key => key.startsWith('contact') || key.startsWith('cta') },
        { name: "💬 AI 챗봇 위젯", match: key => key.startsWith('chat') },
        { name: "📜 하단 정보 (Footer)", match: key => key.startsWith('footer') },
        { name: "기타 문구", match: () => true }
    ];

    let rowsHTML = '';
    const processedKeys = new Set();

    groups.forEach(group => {
        const groupKeys = keys.filter(key => !processedKeys.has(key) && group.match(key));
        if (groupKeys.length === 0) return;
        
        rowsHTML += `<h2 class="text-xl font-bold text-white mt-8 mb-4 border-b border-brand-500/30 pb-2">${group.name}</h2>`;
        
        groupKeys.forEach(key => {
            processedKeys.add(key);
            const koVal = (siteData.i18n.ko[key] || '').replace(/"/g, '&quot;');
            const enVal = (siteData.i18n.en[key] || '').replace(/"/g, '&quot;');
            rowsHTML += `
                <div class="bg-metal-800 p-4 rounded-lg border border-white/5 mb-4 ml-4">
                    <label class="block text-sm font-bold text-brand-500 mb-2">${key}</label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span class="text-xs border border-white/20 text-gray-400 px-1 rounded mb-1 inline-block">KO</span>
                            <input type="text" data-lang="ko" data-key="${key}" value="${koVal}" class="w-full bg-metal-900 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 ui-text-input">
                        </div>
                        <div>
                            <span class="text-xs border border-white/20 text-gray-400 px-1 rounded mb-1 inline-block">EN</span>
                            <input type="text" data-lang="en" data-key="${key}" value="${enVal}" class="w-full bg-metal-900 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 ui-text-input">
                        </div>
                    </div>
                </div>
            `;
        });
    });

    mainContent.innerHTML = `
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold text-white mb-2">사이트 UI 문구 관리</h1>
                <p class="text-gray-400">메인 배너, 헤더, 푸터 등 사이트 전반의 텍스트를 수정할 수 있습니다.</p>
            </div>
            <button id="save-uitext-btn" class="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-6 rounded-md transition flex items-center">
                <i class="ph ph-floppy-disk mr-2"></i> 저장하기
            </button>
        </div>
        
        <div class="max-h-[70vh] overflow-y-auto pr-2">
            ${rowsHTML}
        </div>
    `;

    document.getElementById('save-uitext-btn').addEventListener('click', () => {
        const inputs = document.querySelectorAll('.ui-text-input');
        inputs.forEach(input => {
            const lang = input.getAttribute('data-lang');
            const key = input.getAttribute('data-key');
            siteData.i18n[lang][key] = input.value;
        });
        saveSiteDataToFirebase();
    });
}
// --- Company Details (Vision & Core Values) Admin ---
window.renderCompanyDetailsAdmin = function() {
    try {
        if (!siteData.company.vision || Object.keys(siteData.company.vision).length === 0) {
            siteData.company.vision = { img: '', ko: { title: '', desc: '' }, en: { title: '', desc: '' } };
        }
        if (!siteData.company.coreValues) {
            siteData.company.coreValues = [];
        }
        
        const v = siteData.company.vision;
        const vImg = v.img || '';
        const vKoTitle = v.ko?.title || '';
        const vKoDesc = v.ko?.desc || '';
        const vEnTitle = v.en?.title || '';
        const vEnDesc = v.en?.desc || '';

        let cvHTML = '';
        siteData.company.coreValues.forEach((cv, idx) => {
            const cvImg = cv.img || '';
            const cvKoTitle = cv.ko?.title || '';
            const cvKoDesc = cv.ko?.desc || '';
            const cvEnTitle = cv.en?.title || '';
            
            cvHTML += `
                <div class="bg-metal-800 p-4 rounded-xl border border-white/5 flex items-center justify-between group">
                    <div class="flex items-center space-x-4">
                        ${cvImg ? (cvImg.startsWith('http') || cvImg.startsWith('img_') || cvImg.startsWith('data:image') ? `<img data-img-id="${cvImg}" src="${cvImg.startsWith('data:image') || cvImg.startsWith('http') ? cvImg : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" class="${cvImg.startsWith('data:image') || cvImg.startsWith('http') ? '' : 'lazy-firebase-image'} w-16 h-16 object-cover rounded-md bg-metal-900">` : `<i class="ph ${cvImg} text-4xl text-brand-500"></i>`) : `<div class="w-16 h-16 bg-metal-900 rounded-md flex items-center justify-center"><i class="ph ph-image text-gray-500"></i></div>`}
                        <div>
                            <h4 class="text-white font-bold">${cvKoTitle} <span class="text-xs text-gray-500 font-normal">(${cvEnTitle})</span></h4>
                            <p class="text-sm text-gray-400 line-clamp-1">${cvKoDesc}</p>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="window.openCoreValueModal(${idx})" class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition"><i class="ph ph-pencil-simple text-xl"></i></button>
                        <button onclick="window.deleteCoreValue(${idx})" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded transition"><i class="ph ph-trash text-xl"></i></button>
                    </div>
                </div>
            `;
        });

        if (cvHTML === '') cvHTML = '<p class="text-gray-500">등록된 핵심가치가 없습니다.</p>';

    mainContent.innerHTML = `
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-white mb-2">비전 및 핵심가치 관리</h1>
            <p class="text-gray-400">회사소개 상세 페이지에 노출되는 비전과 핵심가치를 관리합니다.</p>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <!-- Vision Settings -->
            <div class="bg-metal-900 p-6 rounded-2xl border border-white/5">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-bold text-white"><i class="ph ph-target mr-2 text-brand-500"></i> 비전 (Vision)</h2>
                    <button onclick="window.saveVision()" class="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded text-sm transition">저장</button>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm text-gray-400 mb-1">비전 배경 이미지 URL (또는 복사/붙여넣기로 업로드)</label>
                        <div class="flex gap-2">
                            <input type="text" id="vision-img" class="flex-1 bg-metal-800 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-brand-500 paste-upload-target" value="${vImg}" placeholder="https://...">
                            <button type="button" onclick="document.getElementById('vision-img-file').click()" class="bg-metal-800 border border-white/10 px-3 rounded hover:bg-white/5"><i class="ph ph-upload-simple text-white"></i></button>
                            <input type="file" id="vision-img-file" accept="image/*" class="hidden" onchange="window.handleImageUpload(event, 'vision-img')">
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm text-brand-400 mb-1">비전 제목 (국문)</label>
                            <input type="text" id="vision-title-ko" class="w-full bg-metal-800 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-brand-500" value="${vKoTitle}">
                        </div>
                        <div>
                            <label class="block text-sm text-brand-400 mb-1">비전 제목 (영문)</label>
                            <input type="text" id="vision-title-en" class="w-full bg-metal-800 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-brand-500" value="${vEnTitle}">
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm text-gray-400 mb-1">비전 상세 설명 (국문)</label>
                            <textarea id="vision-desc-ko" class="w-full h-32 bg-metal-800 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-brand-500 resize-none">${vKoDesc}</textarea>
                        </div>
                        <div>
                            <label class="block text-sm text-gray-400 mb-1">비전 상세 설명 (영문)</label>
                            <textarea id="vision-desc-en" class="w-full h-32 bg-metal-800 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-brand-500 resize-none">${vEnDesc}</textarea>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Core Values Settings -->
            <div class="bg-metal-900 p-6 rounded-2xl border border-white/5 flex flex-col">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-bold text-white"><i class="ph ph-star mr-2 text-brand-500"></i> 핵심가치 (Core Values)</h2>
                    <button onclick="window.openCoreValueModal(-1)" class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm transition"><i class="ph ph-plus"></i> 추가</button>
                </div>
                
                <div class="space-y-4 flex-1 overflow-y-auto pr-2">
                    ${cvHTML}
                </div>
            </div>
        </div>

        <!-- Core Value Modal -->
        <div id="cv-modal" class="fixed inset-0 bg-black/80 z-[100] hidden items-center justify-center p-4 backdrop-blur-sm">
            <div class="bg-metal-900 border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <h3 class="text-2xl font-bold text-white mb-6" id="cv-modal-title">핵심가치 추가</h3>
                <input type="hidden" id="cv-index" value="-1">
                
                <div class="space-y-5">
                    <div>
                        <label class="block text-sm text-gray-400 mb-1">이미지 URL 또는 아이콘 클래스 (예: ph-star)</label>
                        <div class="flex gap-2">
                            <input type="text" id="cv-img" class="flex-1 bg-metal-800 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-brand-500 paste-upload-target" placeholder="https://... 또는 ph-star">
                            <button type="button" onclick="document.getElementById('cv-img-file').click()" class="bg-metal-800 border border-white/10 px-3 rounded hover:bg-white/5"><i class="ph ph-upload-simple text-white"></i></button>
                            <input type="file" id="cv-img-file" accept="image/*" class="hidden" onchange="window.handleImageUpload(event, 'cv-img')">
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm text-brand-400 mb-1">제목 (국문)</label>
                            <input type="text" id="cv-title-ko" class="w-full bg-metal-800 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-brand-500">
                        </div>
                        <div>
                            <label class="block text-sm text-brand-400 mb-1">제목 (영문)</label>
                            <input type="text" id="cv-title-en" class="w-full bg-metal-800 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-brand-500">
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm text-gray-400 mb-1">상세 설명 (국문)</label>
                            <textarea id="cv-desc-ko" class="w-full h-24 bg-metal-800 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-brand-500 resize-none"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm text-gray-400 mb-1">상세 설명 (영문)</label>
                            <textarea id="cv-desc-en" class="w-full h-24 bg-metal-800 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-brand-500 resize-none"></textarea>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-end space-x-3 mt-8">
                    <button onclick="document.getElementById('cv-modal').classList.replace('flex', 'hidden')" class="px-6 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition">취소</button>
                    <button onclick="window.saveCoreValue()" class="px-6 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-500 transition">저장</button>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        setupImagePaste();
        loadFirebaseImages();
    }, 100);
    } catch (e) {
        mainContent.innerHTML = `<div class="p-8 text-red-500 bg-red-500/10 rounded-xl"><h3>오류 발생</h3><pre>${e.stack}</pre></div>`;
        console.error(e);
    }
};

window.saveVision = function() {
    siteData.company.vision = {
        img: document.getElementById('vision-img').value,
        ko: { title: document.getElementById('vision-title-ko').value, desc: document.getElementById('vision-desc-ko').value },
        en: { title: document.getElementById('vision-title-en').value, desc: document.getElementById('vision-desc-en').value }
    };
    saveSiteDataToFirebase();
    alert("비전이 저장되었습니다.");
};

window.openCoreValueModal = function(index) {
    const modal = document.getElementById('cv-modal');
    document.getElementById('cv-modal-title').innerText = index >= 0 ? '핵심가치 수정' : '핵심가치 추가';
    document.getElementById('cv-index').value = index;
    
    if (index >= 0) {
        const cv = siteData.company.coreValues[index];
        document.getElementById('cv-img').value = cv.img || '';
        document.getElementById('cv-title-ko').value = cv.ko.title || '';
        document.getElementById('cv-title-en').value = cv.en.title || '';
        document.getElementById('cv-desc-ko').value = cv.ko.desc || '';
        document.getElementById('cv-desc-en').value = cv.en.desc || '';
    } else {
        document.getElementById('cv-img').value = '';
        document.getElementById('cv-title-ko').value = '';
        document.getElementById('cv-title-en').value = '';
        document.getElementById('cv-desc-ko').value = '';
        document.getElementById('cv-desc-en').value = '';
    }
    
    modal.classList.replace('hidden', 'flex');
};

window.saveCoreValue = function() {
    const index = parseInt(document.getElementById('cv-index').value);
    const cvData = {
        img: document.getElementById('cv-img').value,
        ko: { title: document.getElementById('cv-title-ko').value, desc: document.getElementById('cv-desc-ko').value },
        en: { title: document.getElementById('cv-title-en').value, desc: document.getElementById('cv-desc-en').value }
    };
    
    if (index >= 0) {
        siteData.company.coreValues[index] = cvData;
    } else {
        siteData.company.coreValues.push(cvData);
    }
    
    saveSiteDataToFirebase();
    document.getElementById('cv-modal').classList.replace('flex', 'hidden');
    window.renderCompanyDetailsAdmin();
};

window.deleteCoreValue = function(index) {
    if (confirm("이 핵심가치를 삭제하시겠습니까?")) {
        siteData.company.coreValues.splice(index, 1);
        saveSiteDataToFirebase();
        window.renderCompanyDetailsAdmin();
    }
};


// Initial check
async function startAdmin() {
    await initFirebase();
    checkAuth();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAdmin);
} else {
    startAdmin();
}
