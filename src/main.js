import { siteData } from './data.js';

let currentLang = 'ko';

export function getLang() { return currentLang; }
export function setLang(lang) { 
    currentLang = lang; 
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
}

function init() {
    renderHeader();
    renderHero();
    renderCompany();
    renderProducts();
    renderPortfolio();
    renderEquipment();
    renderClients();
    renderLocation();
    renderInquiry();
    renderFooter();
    renderChat();

    applyTranslations();

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }, 100);
}

document.addEventListener('languageChanged', () => {
    init();
});

document.addEventListener('DOMContentLoaded', init);

function renderHeader() {
    const container = document.getElementById('header-container');
    
    let desktopHTML = '';
    let mobileHTML = '';
    siteData.menus.forEach(menu => {
        const text = menu[currentLang];
        desktopHTML += `<a href="${menu.link}" class="text-sm font-semibold text-gray-300 hover:text-white transition uppercase tracking-wider">${text}</a>`;
        mobileHTML += `<a href="${menu.link}" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 uppercase tracking-wider">${text}</a>`;
    });

    container.innerHTML = `
    <header class="fixed w-full z-50 glass-header transition-all duration-300" id="header">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <div class="flex-shrink-0 flex items-center cursor-pointer" onclick="window.scrollTo(0,0)">
                    <i class="ph ph-hexagon text-brand-500 text-4xl mr-2"></i>
                    <span class="font-black text-xl tracking-widest uppercase">Apex<span class="text-brand-500">MCT</span></span>
                </div>
                <nav class="hidden md:flex space-x-8 items-center" id="desktop-menu">
                    ${desktopHTML}
                </nav>
                <div class="flex items-center space-x-4">
                    <button id="lang-toggle" class="flex items-center space-x-1 text-sm font-semibold text-gray-300 hover:text-white transition bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                        <i class="ph ph-globe"></i>
                        <span>${currentLang === 'ko' ? 'EN' : 'KR'}</span>
                    </button>
                    <button id="mobile-menu-btn" class="md:hidden text-gray-300 hover:text-white p-2">
                        <i class="ph ph-list text-2xl"></i>
                    </button>
                </div>
            </div>
        </div>
        <div id="mobile-menu" class="md:hidden bg-metal-900 border-t border-white/10">
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                ${mobileHTML}
            </div>
        </div>
    </header>`;

    document.getElementById('lang-toggle').addEventListener('click', () => {
        setLang(currentLang === 'ko' ? 'en' : 'ko');
    });

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
    });

    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('shadow-lg');
        } else {
            header.classList.remove('shadow-lg');
        }
    });
}

function renderHero() {
    const container = document.getElementById('hero-container');
    container.innerHTML = `
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="CNC Machining Factory" class="w-full h-full object-cover opacity-30 object-center">
            <div class="absolute inset-0 bg-gradient-to-b from-metal-900/80 via-metal-900/60 to-metal-900"></div>
        </div>
        
        <div class="relative z-10 text-center px-4 max-w-5xl mx-auto reveal">
            <div class="inline-block mb-4 px-4 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-sm font-semibold tracking-widest uppercase" data-i18n="heroBadge"></div>
            <h1 class="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight" id="hero-title"></h1>
            <p class="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed" data-i18n="heroDesc"></p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <a href="#contact" class="bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 px-8 rounded-sm transition duration-300 flex items-center justify-center">
                    <span data-i18n="btnConsult"></span>
                    <i class="ph ph-arrow-right ml-2 text-xl"></i>
                </a>
                <a href="#products" class="bg-transparent border border-gray-500 hover:border-white text-white font-bold py-4 px-8 rounded-sm transition duration-300 flex items-center justify-center">
                    <span data-i18n="btnExplore"></span>
                </a>
            </div>
        </div>
        <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-400">
            <i class="ph ph-caret-down text-3xl"></i>
        </div>
    </section>`;
}

function renderCompany() {
    const container = document.getElementById('company-container');
    const certsHTML = siteData.company.certs.map(cert => `
        <div class="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-brand-500/50 transition">
            <div class="text-brand-500 font-bold text-lg">${cert.name}</div>
            <div class="text-sm text-gray-400 mt-1">${currentLang === 'ko' ? cert.detail : cert.enDetail}</div>
        </div>
    `).join('');

    container.innerHTML = `
    <section id="company" class="py-24 bg-metal-900 relative border-b border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 class="text-sm font-bold text-brand-500 tracking-widest uppercase mb-2" data-i18n="companySub"></h2>
                    <h3 class="text-3xl md:text-4xl font-bold text-white mb-6" data-i18n="ceoTitle"></h3>
                    <div class="text-gray-300 font-light leading-relaxed space-y-4">
                        ${siteData.company.ceoMsg[currentLang]}
                    </div>
                </div>
                <div class="bg-metal-800 p-8 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div class="absolute -right-10 -top-10 text-brand-500/10"><i class="ph ph-certificate text-9xl"></i></div>
                    <h3 class="text-2xl font-bold text-white mb-6 relative z-10" data-i18n="certTitle"></h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                        ${certsHTML}
                    </div>
                </div>
            </div>
        </div>
    </section>`;
}

function renderProducts() {
    const container = document.getElementById('products-container');
    const productsHTML = siteData.products.map(prod => `
        <div class="service-card p-8 rounded-xl bg-metal-800 border border-white/5 text-center flex flex-col items-center">
            <div class="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-6">
                <i class="ph ${prod.img} text-4xl text-brand-400"></i>
            </div>
            <h4 class="text-xl font-bold text-white mb-3">${prod[currentLang].title}</h4>
            <p class="text-gray-400 font-light text-sm leading-relaxed">${prod[currentLang].desc}</p>
        </div>
    `).join('');

    container.innerHTML = `
    <section id="products" class="py-24 bg-[#0b1120] relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
            <div class="text-center mb-16">
                <h2 class="text-sm font-bold text-brand-500 tracking-widest uppercase mb-2" data-i18n="productSub"></h2>
                <h3 class="text-3xl md:text-4xl font-bold text-white" data-i18n="productTitle"></h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                ${productsHTML}
            </div>
        </div>
    </section>`;
}

function renderPortfolio() {
    const container = document.getElementById('portfolio-container');
    container.innerHTML = `
    <section id="portfolio" class="py-24 bg-metal-900 relative border-b border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal text-center">
             <h2 class="text-sm font-bold text-brand-500 tracking-widest uppercase mb-2">${currentLang === 'ko' ? '가공 사례' : 'Portfolio'}</h2>
             <h3 class="text-3xl md:text-4xl font-bold text-white mb-12">${currentLang === 'ko' ? '실제 정밀 가공 결과물' : 'Precision Machining Cases'}</h3>
             <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-metal-800 rounded-xl overflow-hidden border border-white/5 aspect-video flex items-center justify-center text-gray-500 relative group cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80" alt="Case 1" class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-500">
                    <div class="relative z-10 bg-black/50 w-full p-4 mt-auto opacity-0 group-hover:opacity-100 transition duration-300">
                        <p class="text-white font-bold">5-Axis Impeller</p>
                    </div>
                </div>
                <div class="bg-metal-800 rounded-xl overflow-hidden border border-white/5 aspect-video flex items-center justify-center text-gray-500 relative group cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1580983546523-149b0622e0cb?auto=format&fit=crop&w=800&q=80" alt="Case 2" class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-500">
                    <div class="relative z-10 bg-black/50 w-full p-4 mt-auto opacity-0 group-hover:opacity-100 transition duration-300">
                        <p class="text-white font-bold">Aerospace Bracket</p>
                    </div>
                </div>
                <div class="bg-metal-800 rounded-xl overflow-hidden border border-white/5 aspect-video flex items-center justify-center text-gray-500 relative group cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1590496793907-471a29ed6d36?auto=format&fit=crop&w=800&q=80" alt="Case 3" class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-500">
                    <div class="relative z-10 bg-black/50 w-full p-4 mt-auto opacity-0 group-hover:opacity-100 transition duration-300">
                        <p class="text-white font-bold">Medical Device Housing</p>
                    </div>
                </div>
             </div>
        </div>
    </section>
    `;
}

function renderEquipment() {
    const container = document.getElementById('equipment-container');
    const equipHTML = siteData.equipment.map(eq => `
        <div class="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
            <h4 class="text-lg font-bold text-white mb-1">${eq.name}</h4>
            <p class="text-brand-400 text-sm font-semibold mb-3">${eq.spec}</p>
            <p class="text-gray-400 text-xs">${eq[currentLang]}</p>
        </div>
    `).join('');

    container.innerHTML = `
    <section id="equipment" class="py-24 bg-[#0b1120] relative border-y border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
            <div class="text-center mb-16">
                <h2 class="text-sm font-bold text-brand-500 tracking-widest uppercase mb-2" data-i18n="equipSub"></h2>
                <h3 class="text-3xl md:text-4xl font-bold text-white" data-i18n="equipTitle"></h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                ${equipHTML}
            </div>
        </div>
    </section>`;
}

function renderClients() {
    const container = document.getElementById('clients-container');
    const clientsHTML = siteData.clients.map(client => `
        <div class="px-6 py-4 rounded-lg border border-gray-600 text-gray-400 font-bold tracking-widest hover:text-white hover:border-brand-500 transition duration-300">
            ${client}
        </div>
    `).join('');

    container.innerHTML = `
    <section id="clients" class="py-24 bg-metal-900 relative text-center">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
            <h2 class="text-sm font-bold text-brand-500 tracking-widest uppercase mb-2" data-i18n="clientSub"></h2>
            <h3 class="text-3xl md:text-4xl font-bold text-white mb-12" data-i18n="clientTitle"></h3>
            <div class="flex flex-wrap justify-center gap-8 items-center opacity-60">
                ${clientsHTML}
            </div>
        </div>
    </section>`;
}

function renderLocation() {
    const container = document.getElementById('location-container');
    container.innerHTML = `
    <section id="location" class="py-24 bg-[#0b1120] relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
            <div class="text-center mb-16">
                <h2 class="text-sm font-bold text-brand-500 tracking-widest uppercase mb-2" data-i18n="locationSub"></h2>
                <h3 class="text-3xl md:text-4xl font-bold text-white" data-i18n="locationTitle"></h3>
            </div>
            <div class="bg-metal-800 p-2 rounded-2xl border border-white/10">
                <div class="w-full h-96 bg-metal-900 rounded-xl flex flex-col items-center justify-center text-gray-500">
                    <i class="ph ph-map-pin text-5xl text-brand-500 mb-4"></i>
                    <p class="text-lg text-white font-medium mb-2">${siteData.location[currentLang]}</p>
                    <p data-i18n="mapDesc"></p>
                </div>
            </div>
        </div>
    </section>`;
}

function renderInquiry() {
    const container = document.getElementById('inquiry-container');
    container.innerHTML = `
    <section id="contact" class="py-24 bg-gradient-to-b from-metal-900 to-black">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
            <i class="ph ph-handshake text-6xl text-brand-500 mb-6 inline-block"></i>
            <h2 class="text-3xl md:text-5xl font-bold text-white mb-6" data-i18n="ctaTitle"></h2>
            <p class="text-xl text-gray-400 mb-10 font-light" data-i18n="ctaDesc"></p>
            
            <form id="inquiry-form" class="bg-white/5 border border-white/10 p-8 rounded-lg backdrop-blur-sm max-w-2xl mx-auto text-left mb-10">
                <h4 class="text-2xl font-bold text-white mb-6">${currentLang === 'ko' ? '온라인 견적 문의' : 'Online Inquiry'}</h4>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">${currentLang === 'ko' ? '회사명 / 담당자' : 'Company / Contact Person'}</label>
                        <input type="text" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">${currentLang === 'ko' ? '연락처 / 이메일' : 'Phone / Email'}</label>
                        <input type="text" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">${currentLang === 'ko' ? '요구사항' : 'Requirements'}</label>
                        <textarea rows="4" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">${currentLang === 'ko' ? '도면 첨부 (PDF/CAD)' : 'Attach Blueprint (PDF/CAD)'}</label>
                        <input type="file" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                    </div>
                    <button type="button" class="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-4 rounded-md transition duration-300">
                        ${currentLang === 'ko' ? '문의 보내기' : 'Submit Inquiry'}
                    </button>
                </div>
            </form>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
                <div class="flex items-center space-x-4 bg-white/5 border border-white/10 p-6 rounded-lg backdrop-blur-sm">
                    <div class="bg-brand-500/20 p-3 rounded-full">
                        <i class="ph ph-envelope-simple text-2xl text-brand-400"></i>
                    </div>
                    <div>
                        <p class="text-sm text-gray-400" data-i18n="contactEmailLabel"></p>
                        <p class="text-lg font-bold text-white">inquiry@apexmct.com</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4 bg-white/5 border border-white/10 p-6 rounded-lg backdrop-blur-sm">
                    <div class="bg-brand-500/20 p-3 rounded-full">
                        <i class="ph ph-phone text-2xl text-brand-400"></i>
                    </div>
                    <div>
                        <p class="text-sm text-gray-400" data-i18n="contactPhoneLabel"></p>
                        <p class="text-lg font-bold text-white">+82 (0)2 1234 5678</p>
                    </div>
                </div>
            </div>
        </div>
    </section>`;
}

function renderFooter() {
    const container = document.getElementById('footer-container');
    container.innerHTML = `
    <footer class="bg-black py-12 border-t border-white/10 text-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-gray-500">
            <div class="mb-4 md:mb-0 flex items-center">
                <i class="ph ph-hexagon text-brand-500 text-2xl mr-2"></i>
                <span class="font-bold text-white tracking-widest uppercase">Apex<span class="text-brand-500">MCT</span></span>
                <span class="ml-4 pl-4 border-l border-white/10" data-i18n="footerAddress"></span>
            </div>
            <div class="flex items-center space-x-4">
                <p>&copy; 2026 Apex MCT Precision. All rights reserved.</p>
                <a href="/admin.html" class="text-brand-500 hover:text-white transition ml-4 pl-4 border-l border-white/10">Admin Login</a>
            </div>
        </div>
    </footer>`;
}

function renderChat() {
    const container = document.getElementById('chat-container');
    container.innerHTML = `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <div id="ai-chat-window" class="chat-window mb-4 w-[calc(100vw-3rem)] sm:w-80 md:w-96 bg-metal-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex-col hidden">
            <div class="bg-metal-800 p-4 border-b border-white/10 flex justify-between items-center">
                <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-500">
                        <i class="ph ph-robot text-xl"></i>
                    </div>
                    <div>
                        <h4 class="text-white font-bold text-sm" data-i18n="chatTitle"></h4>
                        <p class="text-xs text-brand-400" data-i18n="chatStatus"></p>
                    </div>
                </div>
                <button id="close-chat-btn" class="text-gray-400 hover:text-white transition">
                    <i class="ph ph-x text-xl"></i>
                </button>
            </div>
            <div id="chat-messages" class="p-4 h-80 overflow-y-auto flex flex-col space-y-4 bg-[#0b1120]">
                <div class="flex items-start space-x-2">
                    <div class="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <i class="ph ph-robot text-xs text-brand-500"></i>
                    </div>
                    <div class="bg-metal-800 border border-white/5 text-gray-200 text-sm p-3 rounded-2xl rounded-tl-none max-w-[85%] leading-relaxed" id="chat-greeting"></div>
                </div>
            </div>
            <div class="p-3 bg-metal-900 border-t border-white/10 flex items-center space-x-2">
                <input type="text" id="chat-input" class="flex-1 bg-black/50 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition" data-i18n-placeholder="chatPlaceholder">
                <button id="send-chat-btn" class="w-10 h-10 rounded-full bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center transition flex-shrink-0">
                    <i class="ph ph-paper-plane-right"></i>
                </button>
            </div>
        </div>
        <button id="chat-toggle-btn" class="chat-widget-btn shadow-xl w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center text-2xl hover:shadow-brand-500/50 transition-all">
            <i class="ph ph-chat-teardrop-text"></i>
        </button>
    </div>`;

    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatWindow = document.getElementById('ai-chat-window');

    function toggleChat() {
        if (chatWindow.classList.contains('hidden')) {
            chatWindow.classList.remove('hidden');
            chatWindow.classList.add('flex');
            setTimeout(() => chatWindow.classList.add('active'), 10);
        } else {
            chatWindow.classList.remove('active');
            setTimeout(() => {
                chatWindow.classList.add('hidden');
                chatWindow.classList.remove('flex');
            }, 300);
        }
    }

    if (chatToggleBtn) chatToggleBtn.addEventListener('click', toggleChat);
    if (closeChatBtn) closeChatBtn.addEventListener('click', toggleChat);
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (siteData.i18n[currentLang][key]) {
            el.innerHTML = siteData.i18n[currentLang][key];
        }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (siteData.i18n[currentLang][key]) {
            el.placeholder = siteData.i18n[currentLang][key];
        }
    });

    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) heroTitle.innerHTML = siteData.i18n[currentLang].heroTitle;
    
    const greeting = currentLang === 'ko' ? 
        "안녕하십니까. 에이펙스 MCT의 AI 기술지원 어시스턴트입니다. 제품, 설비, 견적 등에 대해 무엇이든 물어보세요." : 
        "Hello. I am the AI Support Assistant for Apex MCT. Ask me anything about products, equipment, or quoting procedures.";
    const chatGreeting = document.getElementById('chat-greeting');
    if (chatGreeting) chatGreeting.innerText = greeting;
}
