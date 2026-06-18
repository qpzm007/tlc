import { siteData } from './data.js';

// DOM Elements
const loginModal = document.getElementById('login-modal');
const adminLayout = document.getElementById('admin-layout');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const tabs = document.querySelectorAll('.admin-tab');
const mainContent = document.getElementById('main-content');

// Authentication Check (Mock logic: ID: admin, PW: admin1234)
function checkAuth() {
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
            <p class="text-gray-400">CEO 인사말 및 인증서 현황을 수정합니다.</p>
        </div>
        <div class="bg-metal-800 p-6 rounded-xl border border-white/5 space-y-6">
            <div>
                <label class="block text-sm font-medium text-white mb-2">CEO 인사말 (KO)</label>
                <!-- Pseudo WYSIWYG Editor -->
                <div class="border border-white/10 rounded-md bg-metal-900">
                    <div class="border-b border-white/10 p-2 flex space-x-2 text-gray-400">
                        <button class="hover:text-white"><i class="ph ph-text-b"></i></button>
                        <button class="hover:text-white"><i class="ph ph-text-italic"></i></button>
                        <button class="hover:text-white"><i class="ph ph-link"></i></button>
                    </div>
                    <textarea class="w-full bg-transparent border-0 p-4 text-white focus:ring-0" rows="6">${siteData.company.ceoMsg.ko.replace(/<br>/g, '\n')}</textarea>
                </div>
            </div>
            <div class="flex justify-end">
                <button class="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-6 rounded-md transition" onclick="alert('저장되었습니다.')">변경사항 저장</button>
            </div>
        </div>
    `;
}

function renderProductsAdmin() {
    mainContent.innerHTML = `
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold text-white mb-2">제품 & 포트폴리오 관리</h1>
                <p class="text-gray-400">포트폴리오 이미지는 클립보드에 복사(Ctrl+C)한 후 이곳에 붙여넣기(Ctrl+V)하여 바로 업로드할 수 있습니다.</p>
            </div>
            <button class="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-4 rounded-md transition flex items-center">
                <i class="ph ph-plus mr-2"></i> 새 제품 추가
            </button>
        </div>
        
        <!-- Image Upload Drop/Paste Area -->
        <div id="image-upload-area" class="border-2 border-dashed border-white/20 rounded-xl p-10 text-center mb-8 bg-metal-800 transition hover:border-brand-500 hover:bg-brand-500/5 cursor-pointer">
            <i class="ph ph-image text-5xl text-gray-500 mb-4 inline-block"></i>
            <p class="text-white font-medium">클릭하거나, 스크린샷을 복사(Ctrl+C)하여 이곳에서 붙여넣기(Ctrl+V) 하세요.</p>
            <p class="text-sm text-gray-500 mt-2">Firebase Storage 연결 시 실제 업로드됩니다.</p>
        </div>

        <div class="grid grid-cols-1 gap-4">
            ${siteData.products.map(p => `
                <div class="bg-metal-800 p-4 rounded-lg border border-white/5 flex justify-between items-center cursor-move hover:border-white/20 transition">
                    <div class="flex items-center">
                        <i class="ph ph-dots-six-vertical text-gray-500 text-xl mr-4"></i>
                        <i class="ph ${p.img} text-2xl text-brand-500 mr-4"></i>
                        <div>
                            <h4 class="text-white font-bold">${p.ko.title}</h4>
                            <p class="text-sm text-gray-400">${p.ko.desc}</p>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button class="p-2 text-gray-400 hover:text-white bg-white/5 rounded-md"><i class="ph ph-pencil-simple"></i></button>
                        <button class="p-2 text-red-400 hover:text-red-300 bg-white/5 rounded-md"><i class="ph ph-trash"></i></button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    setupImagePaste();
}

function renderEquipmentAdmin() {
    mainContent.innerHTML = `
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold text-white mb-2">설비 관리</h1>
                <p class="text-gray-400">보유 설비를 추가하고 순서를 변경할 수 있습니다.</p>
            </div>
            <button class="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-4 rounded-md transition flex items-center">
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
                    ${siteData.equipment.map(eq => `
                        <tr class="hover:bg-white/5 transition group cursor-pointer">
                            <td class="p-4 font-bold">${eq.name}</td>
                            <td class="p-4 text-brand-400">${eq.spec}</td>
                            <td class="p-4 text-gray-400 text-sm">${eq.ko}</td>
                            <td class="p-4">
                                <button class="text-gray-500 hover:text-white mr-2"><i class="ph ph-pencil-simple text-lg"></i></button>
                                <button class="text-gray-500 hover:text-red-400"><i class="ph ph-trash text-lg"></i></button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderClientsAdmin() {
    mainContent.innerHTML = `
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-white mb-2">고객사 로고 관리</h1>
            <p class="text-gray-400">드래그 앤 드롭으로 로고 순서를 변경할 수 있습니다.</p>
        </div>
        <div class="flex flex-wrap gap-4">
            ${siteData.clients.map(c => `
                <div class="bg-metal-800 px-6 py-4 rounded-lg border border-white/10 text-white font-bold flex items-center cursor-move hover:border-brand-500 transition">
                    <i class="ph ph-dots-six-vertical text-gray-500 mr-3"></i>
                    ${c}
                    <button class="ml-4 text-gray-500 hover:text-red-400"><i class="ph ph-x"></i></button>
                </div>
            `).join('')}
            <div class="bg-transparent px-6 py-4 rounded-lg border border-dashed border-white/20 text-gray-400 font-bold flex items-center cursor-pointer hover:border-white hover:text-white transition">
                <i class="ph ph-plus mr-2"></i> 로고 추가
            </div>
        </div>
    `;
}

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

    // Paste event
    document.addEventListener('paste', (e) => {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let index in items) {
            const item = items[index];
            if (item.kind === 'file') {
                const blob = item.getAsFile();
                const reader = new FileReader();
                reader.onload = function(event) {
                    dropArea.innerHTML = `
                        <img src="${event.target.result}" class="h-32 mx-auto rounded mb-4" />
                        <p class="text-brand-400 font-bold">이미지 로드 완료! (가짜 업로드)</p>
                    `;
                };
                reader.readAsDataURL(blob);
            }
        }
    });

    // Drag and Drop styles
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('drag-over');
    });
    dropArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropArea.classList.remove('drag-over');
    });
    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('drag-over');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const blob = e.dataTransfer.files[0];
            const reader = new FileReader();
            reader.onload = function(event) {
                dropArea.innerHTML = `
                    <img src="${event.target.result}" class="h-32 mx-auto rounded mb-4" />
                    <p class="text-brand-400 font-bold">이미지 드롭 완료! (가짜 업로드)</p>
                `;
            };
            reader.readAsDataURL(blob);
        }
    });
}

// Initial check
checkAuth();
