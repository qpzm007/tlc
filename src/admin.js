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

// Authentication Check (Mock logic: ID: admin, PW: admin1234)
function checkAuth() {
    if(siteData && siteData.brand) updateBrandNameUI();
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

    if (id === 'admin' && pw === 'admin1234') {
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
        if (tabName === 'products') renderProductsAdmin();
        if (tabName === 'equipment') renderEquipmentAdmin();
        if (tabName === 'uitext') renderUITextAdmin();
        if (tabName === 'clients') renderClientsAdmin();
        if (tabName === 'inquiries') renderInquiriesAdmin();
    });
});

// --- Views ---

function renderDashboard() {
    mainContent.innerHTML = `
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-white mb-2">대시보드</h1>
            <p class="text-gray-400">웹사이트 방문자 및 요약 정보를 확인하세요.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-metal-800 p-6 rounded-xl border border-white/5">
                <div class="text-brand-500 mb-2"><i class="ph ph-users text-3xl"></i></div>
                <h3 class="text-gray-400 text-sm font-medium">오늘 방문자</h3>
                <p class="text-3xl font-bold text-white mt-1">128</p>
            </div>
            <div class="bg-metal-800 p-6 rounded-xl border border-white/5">
                <div class="text-green-500 mb-2"><i class="ph ph-envelope text-3xl"></i></div>
                <h3 class="text-gray-400 text-sm font-medium">신규 문의</h3>
                <p class="text-3xl font-bold text-white mt-1">2</p>
            </div>
            <div class="bg-metal-800 p-6 rounded-xl border border-white/5">
                <div class="text-purple-500 mb-2"><i class="ph ph-cube text-3xl"></i></div>
                <h3 class="text-gray-400 text-sm font-medium">등록된 제품</h3>
                <p class="text-3xl font-bold text-white mt-1">3</p>
            </div>
        </div>
    `;
}

function renderCompanyAdmin() {
    mainContent.innerHTML = `
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-white mb-2">회사 정보 관리</h1>
            <p class="text-gray-400">회사 기본 정보, CEO 인사말 및 인증서 현황을 수정합니다.</p>
        </div>
        <div class="bg-metal-800 p-6 rounded-xl border border-white/5 space-y-6 mb-6">
            <h2 class="text-xl font-bold text-white border-b border-white/10 pb-2 mb-4">브랜드 설정</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-white mb-2">회사명 (브랜드)</label>
                    <input type="text" id="company-name" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500" value="${siteData.brand.name}">
                </div>
                <div>
                    <label class="block text-sm font-medium text-white mb-2">로고 이미지 URL</label>
                    <input type="text" id="company-logo" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500" value="${siteData.brand.logoUrl}" placeholder="비워두면 기본 아이콘 사용">
                    <p class="text-xs text-gray-500 mt-1">로고 파일의 웹 주소를 입력하거나 파이어베이스 연동 후 스토리지 링크를 넣습니다.</p>
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
                    <label class="block text-sm font-medium text-white mb-2">지도 퍼가기 HTML 태그 (카카오/구글맵)</label>
                    <input type="text" id="contact-map" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500" value="${(siteData.contact.mapIframe || '').replace(/"/g, '&quot;')}" placeholder="<iframe src=...></iframe>">
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

    document.getElementById('save-company-btn').addEventListener('click', () => {
        siteData.brand.name = document.getElementById('company-name').value;
        siteData.brand.logoUrl = document.getElementById('company-logo').value;
        siteData.company.ceoMsg.ko = document.getElementById('company-ceo-ko').value.replace(/\n/g, '<br>');
        siteData.company.ceoMsg.en = document.getElementById('company-ceo-en').value.replace(/\n/g, '<br>');
        siteData.contact.phone = document.getElementById('contact-phone').value;
        siteData.contact.fax = document.getElementById('contact-fax').value;
        siteData.contact.email = document.getElementById('contact-email').value;
        siteData.contact.mapIframe = document.getElementById('contact-map').value;
        siteData.location.ko = document.getElementById('location-ko').value;
        siteData.location.en = document.getElementById('location-en').value;
        saveSiteDataToFirebase();
    });
}

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

function renderInquiriesAdmin() {
    mainContent.innerHTML = `
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-white mb-2">온라인 문의 내역</h1>
            <p class="text-gray-400">웹사이트를 통해 접수된 견적 및 문의 사항입니다.</p>
        </div>
        <div class="space-y-4">
            <div class="bg-metal-800 p-6 rounded-xl border border-white/5 border-l-4 border-l-brand-500">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <span class="bg-brand-500/20 text-brand-400 text-xs px-2 py-1 rounded font-bold mr-2">신규 대기</span>
                        <span class="text-gray-400 text-sm">2026-06-18 10:30</span>
                        <h3 class="text-xl font-bold text-white mt-1">반도체 진공 챔버 가공 견적 문의</h3>
                    </div>
                    <button class="bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded text-sm transition">상세 보기</button>
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div><span class="text-gray-500">회사/담당자:</span> <span class="text-white ml-2">(주)한국세미콘 / 김철수 대리</span></div>
                    <div><span class="text-gray-500">연락처:</span> <span class="text-white ml-2">010-1234-5678</span></div>
                </div>
                <div class="flex items-center space-x-2 text-brand-400 text-sm cursor-pointer hover:underline">
                    <i class="ph ph-file-pdf text-lg"></i>
                    <span>chamber_blueprint_v2.pdf (2.4MB) 다운로드</span>
                </div>
            </div>

            <div class="bg-metal-800 p-6 rounded-xl border border-white/5 opacity-70">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <span class="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded font-bold mr-2">답변 완료</span>
                        <span class="text-gray-400 text-sm">2026-06-15 14:20</span>
                        <h3 class="text-xl font-bold text-white mt-1">항공우주 브라켓 샘플 제작</h3>
                    </div>
                    <button class="bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded text-sm transition">상세 보기</button>
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div><span class="text-gray-500">회사/담당자:</span> <span class="text-white ml-2">Aero Dynamics / John Doe</span></div>
                    <div><span class="text-gray-500">연락처:</span> <span class="text-white ml-2">john@aero.com</span></div>
                </div>
            </div>
        </div>
    `;
}

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
        { name: "🎯 메인 비주얼 (Hero)", match: key => key.startsWith('hero') || key.startsWith('btn') },
        { name: "🏢 회사 소개", match: key => key.startsWith('company') || key.startsWith('ceo') || key.startsWith('cert') },
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

// Initial check
document.addEventListener('DOMContentLoaded', async () => {
    await initFirebase();
    checkAuth();
});
