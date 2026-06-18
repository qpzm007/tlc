import { siteData, initFirebase, loadFirebaseImages, saveSiteDataToFirebase } from './data.js';

export let currentLang = localStorage.getItem('tlc_lang') || 'ko';

export function getLang() { return currentLang; }
export function setLang(lang) { 
    currentLang = lang; 
    localStorage.setItem('tlc_lang', lang);
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
}

function init() {
    renderHeader();
    renderHero();
    renderCompany();
    renderProducts();
    renderEquipment();
    renderClients();
    renderLocation();
    renderInquiry();
    renderFooter();
    renderChat();

    applyTranslations();
    loadFirebaseImages();

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

document.addEventListener('DOMContentLoaded', async () => {
    await initFirebase();
    if (!localStorage.getItem('tlc_lang') && siteData?.brand?.defaultLang) {
        currentLang = siteData.brand.defaultLang;
        localStorage.setItem('tlc_lang', currentLang);
    }
    init();
});

export function renderHeader() {
    const container = document.getElementById('header-container');
    
    let desktopHTML = '';
    let mobileHTML = '';
    siteData.menus.forEach(menu => {
        const text = menu[currentLang];
        // Use index.html#... to ensure navigation to main page sections works from subpages
        const link = menu.link.startsWith('#') ? `index.html${menu.link}` : menu.link;
        
        desktopHTML += `<a href="${link}" class="text-sm font-semibold hover:text-brand-500 transition duration-300 uppercase tracking-wide text-gray-300 hover:text-white" data-ko="${menu.ko}" data-en="${menu.en}">${text}</a>`;
        mobileHTML += `<a href="${link}" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5" data-ko="${menu.ko}" data-en="${menu.en}">${text}</a>`;
    });

    container.innerHTML = `
    <header class="fixed w-full z-50 glass-header transition-all duration-300" id="header">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <div class="flex-shrink-0 flex items-center cursor-pointer" onclick="window.location.href='index.html'">
                    ${siteData.brand.logoUrl ? 
                        (siteData.brand.logoUrl.startsWith('http') || siteData.brand.logoUrl.startsWith('img_') || siteData.brand.logoUrl.startsWith('data:image') ? 
                            `<img data-img-id="${siteData.brand.logoUrl}" src="${siteData.brand.logoUrl.startsWith('data:image') ? siteData.brand.logoUrl : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="${siteData.brand.name} Logo" class="${siteData.brand.logoUrl.startsWith('data:image') ? '' : 'lazy-firebase-image'} h-8 mr-2">` :
                            `<img src="${siteData.brand.logoUrl}" alt="${siteData.brand.name} Logo" class="h-8 mr-2">`) :
                        `<i class="ph ph-hexagon text-brand-500 text-4xl mr-2"></i>`
                    }
                    <span class="font-black text-xl tracking-widest uppercase">${siteData.brand.name}</span>
                </div>
                <nav class="hidden md:flex space-x-8 items-center" id="desktop-menu">
                    ${desktopHTML}
                </nav>
                <div class="flex items-center space-x-4">
                    <button id="lang-toggle" class="flex items-center space-x-1 text-sm font-semibold text-gray-300 hover:text-white transition bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                        <i class="ph ph-globe"></i>
                        <span>${currentLang === 'ko' ? 'EN' : 'KR'}</span>
                    </button>
                    <div class="md:hidden flex items-center">
                        <button id="mobile-menu-btn" class="text-white hover:text-brand-500 transition">
                            <i class="ph ph-list text-3xl"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Mobile menu -->
        <div id="mobile-menu" class="md:hidden bg-metal-900 border-t border-white/10 absolute w-full left-0 top-20 z-40">
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

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
        });
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
    const defaultBg = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
    const bgUrl = siteData?.brand?.heroBgUrl || defaultBg;
    
    container.innerHTML = `
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0 z-0">
            <img ${bgUrl.startsWith('img_') ? `data-img-id="${bgUrl}"` : `src="${bgUrl}"`} alt="Hero Background" class="${bgUrl.startsWith('img_') ? 'lazy-firebase-image' : ''} w-full h-full object-cover opacity-30 object-center">
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
    const certsHTML = siteData.company.certs
        .filter(cert => cert.featured !== false)
        .map(cert => `
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
                <div class="bg-metal-800 p-8 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col h-full">
                    <div class="absolute -right-10 -top-10 text-brand-500/10"><i class="ph ph-certificate text-9xl"></i></div>
                    <h3 class="text-2xl font-bold text-white mb-6 relative z-10" data-i18n="certTitle"></h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 flex-grow mb-6">
                        ${certsHTML}
                    </div>
                    <div class="text-center relative z-10 mt-auto">
                        <a href="${import.meta.env.BASE_URL}certs.html" class="inline-block w-full border border-brand-500/30 bg-metal-900 text-brand-400 hover:bg-brand-500 hover:text-white hover:border-brand-500 font-bold py-3 px-6 rounded-xl transition duration-300">
                            <span>${currentLang === 'ko' ? '모든 인증서 보기' : 'View all certificates'}</span> <i class="ph ph-arrow-right inline-block ml-1"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>`;
}

function renderProducts() {
    const container = document.getElementById('products-container');
    const productsHTML = siteData.products
        .filter(p => p.featured)
        .map(p => `
        <div class="bg-metal-900 border border-white/10 rounded-2xl p-8 hover:border-brand-500 transition duration-300 group flex flex-col">
            ${p.img.startsWith('http') || p.img.startsWith('img_') ? `<img data-img-id="${p.img}" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" class="lazy-firebase-image w-full h-48 object-cover rounded-xl mb-6 group-hover:scale-105 transition duration-300">` : `<i class="ph ${p.img} text-5xl text-brand-500 mb-6 group-hover:scale-110 transition duration-300 inline-block"></i>`}
            <h3 class="text-2xl font-bold text-white mb-4" data-ko="${p.ko.title}" data-en="${p.en.title}">${p[currentLang].title}</h3>
            <p class="text-gray-400" data-ko="${p.ko.desc}" data-en="${p.en.desc}">${p[currentLang].desc}</p>
        </div>
    `).join('');

    container.innerHTML = `
    <section id="products" class="py-24 bg-black relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="text-center mb-16">
                <h2 class="text-brand-500 font-bold tracking-widest uppercase mb-2" data-i18n="productsSub">Products</h2>
                <h3 class="text-3xl md:text-5xl font-bold text-white" data-i18n="productsTitle">정밀 가공 포트폴리오</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                ${productsHTML}
            </div>
            <div class="text-center">
                <a href="${import.meta.env.BASE_URL}products.html" class="inline-block border border-brand-500 text-brand-400 hover:bg-brand-500 hover:text-white font-bold py-3 px-8 rounded-full transition duration-300">
                    <span data-i18n="productsViewAll">모든 제품 보기</span> <i class="ph ph-arrow-right inline-block ml-1"></i>
                </a>
            </div>
        </div>
    </section>
    `;
}

function renderEquipment() {
    const container = document.getElementById('equipment-container');
    const equipmentHTML = siteData.equipment
        .filter(eq => eq.featured)
        .map(eq => `
        <div class="bg-metal-800 rounded-xl overflow-hidden border border-white/10 hover:border-brand-500 transition duration-300 flex flex-col">
            ${eq.img ? `<img data-img-id="${eq.img}" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="${eq.name}" class="lazy-firebase-image w-full h-48 object-cover">` : `<div class="w-full h-48 bg-metal-900 flex items-center justify-center"><i class="ph ph-image text-4xl text-gray-600"></i></div>`}
            <div class="p-6 flex-1 flex flex-col justify-center">
                <h4 class="text-xl font-bold text-white mb-2">${eq.name}</h4>
                <p class="text-brand-400 font-medium mb-3">${eq.spec}</p>
                <p class="text-gray-400 text-sm" data-ko="${eq.ko}" data-en="${eq.en}">${eq[currentLang]}</p>
            </div>
        </div>
    `).join('');

    container.innerHTML = `
    <section id="equipment" class="py-24 bg-[#0b1120] border-t border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-brand-500 font-bold tracking-widest uppercase mb-2" data-i18n="equipmentSub">Equipment</h2>
                <h3 class="text-3xl md:text-5xl font-bold text-white" data-i18n="equipmentTitle">주요 보유 설비</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                ${equipmentHTML}
            </div>
            <div class="text-center">
                <a href="${import.meta.env.BASE_URL}equipment.html" class="inline-block border border-brand-500 text-brand-400 hover:bg-brand-500 hover:text-white font-bold py-3 px-8 rounded-full transition duration-300">
                    <span data-i18n="equipmentViewAll">모든 설비 보기</span> <i class="ph ph-arrow-right inline-block ml-1"></i>
                </a>
            </div>
        </div>
    </section>`;
}

function renderClients() {
    const container = document.getElementById('clients-container');
    const clientsHTML = siteData.clients.map(client => {
        const isObj = typeof client === 'object';
        const name = isObj ? client.name : client;
        const img = isObj ? client.img : '';
        
        if (img) {
            return `
            <div class="px-6 py-4 rounded-lg border border-gray-600 hover:border-brand-500 transition duration-300 flex items-center justify-center bg-white/5 h-24 w-48">
                ${img.startsWith('http') || img.startsWith('img_') ? `<img data-img-id="${img}" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="${name}" title="${name}" class="lazy-firebase-image max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 transition duration-300">` : `<i class="ph ${img} text-4xl text-brand-500" title="${name}"></i>`}
            </div>
            `;
        } else {
            return `
            <div class="px-6 py-4 rounded-lg border border-gray-600 text-gray-400 font-bold tracking-widest hover:text-white hover:border-brand-500 transition duration-300 flex items-center justify-center h-24 w-48 bg-metal-800 text-center">
                ${name}
            </div>
            `;
        }
    }).join('');

    container.innerHTML = `
    <section id="clients" class="py-24 bg-metal-900 relative text-center">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
            <h2 class="text-sm font-bold text-brand-500 tracking-widest uppercase mb-2" data-i18n="clientSub"></h2>
            <h3 class="text-3xl md:text-4xl font-bold text-white mb-12" data-i18n="clientTitle"></h3>
            <div class="flex flex-wrap justify-center gap-6 items-center">
                ${clientsHTML}
            </div>
        </div>
    </section>`;
}

function renderLocation() {
    const container = document.getElementById('location-container');
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteData.location[currentLang])}`;
    
    const mapImg = siteData.contact.mapImage || siteData.contact.mapIframe;
    const mapImageHTML = mapImg && (mapImg.startsWith('img_') || mapImg.startsWith('http') || mapImg.startsWith('data:image')) ? 
        `<img data-img-id="${mapImg}" src="${mapImg.startsWith('data:image') ? mapImg : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" class="${mapImg.startsWith('data:image') || mapImg.startsWith('http') ? '' : 'lazy-firebase-image'} absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105">` 
        : '<div class="absolute inset-0 flex flex-col items-center justify-center text-gray-600"><i class="ph ph-image text-5xl mb-4"></i><p>지도 이미지가 없습니다.</p></div>';

    container.innerHTML = `
    <section id="location" class="py-24 bg-[#0b1120] relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
            <div class="text-center mb-16">
                <h2 class="text-sm font-bold text-brand-500 tracking-widest uppercase mb-2" data-i18n="locationSub"></h2>
                <h3 class="text-3xl md:text-4xl font-bold text-white" data-i18n="locationTitle"></h3>
            </div>
            <div class="bg-metal-800 p-2 rounded-2xl border border-white/10 mb-8 max-w-5xl mx-auto shadow-2xl">
                <a href="${mapUrl}" target="_blank" class="w-full h-96 bg-metal-900 rounded-xl flex flex-col items-center justify-center text-gray-500 relative overflow-hidden group cursor-pointer block">
                    ${mapImageHTML}
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition duration-300 z-10 flex items-center justify-center">
                        <div class="opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition duration-300 bg-brand-600 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center">
                            <i class="ph ph-map-trifold mr-2 text-2xl"></i> ${currentLang === 'ko' ? '지도 열기' : 'Open Map'}
                        </div>
                    </div>
                </a>
            </div>
            <div class="text-center">
                <div class="inline-flex flex-col md:flex-row items-center justify-center bg-metal-800/50 px-8 py-5 rounded-xl border border-white/5 gap-3">
                    <div class="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-500 shrink-0">
                        <i class="ph-fill ph-map-pin text-xl"></i>
                    </div>
                    <p class="text-lg md:text-xl text-white font-medium">${siteData.location[currentLang]}</p>
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
                        <input type="text" id="inquiry-company" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">${currentLang === 'ko' ? '연락처 또는 이메일' : 'Contact Number or Email'}</label>
                        <input type="text" id="inquiry-contact" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">${currentLang === 'ko' ? '문의 내용' : 'Inquiry Details'}</label>
                        <textarea id="inquiry-details" class="w-full bg-metal-900 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-500" rows="4"></textarea>
                    </div>
                    <p class="text-xs text-gray-500 text-right mt-1 mb-3">${currentLang === 'ko' ? '※ 도면 첨부가 필요하신 경우, 접수 후 배정된 담당자에게 이메일로 전송해 주시기 바랍니다.' : '※ If you need to attach a blueprint, please email it to the assigned representative after submission.'}</p>
                    <button type="button" id="submit-inquiry-btn" class="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-4 rounded-md transition duration-300">
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
                        <p class="text-lg font-bold text-white">${siteData.contact.email || '-'}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4 bg-white/5 border border-white/10 p-6 rounded-lg backdrop-blur-sm">
                    <div class="bg-brand-500/20 p-3 rounded-full">
                        <i class="ph ph-phone text-2xl text-brand-400"></i>
                    </div>
                    <div>
                        <p class="text-sm text-gray-400" data-i18n="contactPhoneLabel"></p>
                        <p class="text-lg font-bold text-white">${siteData.contact.phone || '-'}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>`;

    const submitBtn = document.getElementById('submit-inquiry-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const company = document.getElementById('inquiry-company').value.trim();
            const contact = document.getElementById('inquiry-contact').value.trim();
            const details = document.getElementById('inquiry-details').value.trim();

            if (!company || !contact || !details) {
                alert(currentLang === 'ko' ? '모든 항목을 입력해 주세요.' : 'Please fill out all fields.');
                return;
            }

            // Show loading state
            const originalText = submitBtn.innerText;
            submitBtn.innerText = currentLang === 'ko' ? '접수 중...' : 'Submitting...';
            submitBtn.disabled = true;

            const newInquiry = {
                id: 'inq_' + Date.now(),
                company,
                contact,
                details,
                date: new Date().toLocaleString(),
                status: 'new' // 'new' or 'completed'
            };

            try {
                if (!siteData.inquiries) siteData.inquiries = [];
                // Add to beginning of array
                siteData.inquiries.unshift(newInquiry);
                
                await saveSiteDataToFirebase();
                
                alert(currentLang === 'ko' ? '성공적으로 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.' : 'Successfully submitted. We will contact you shortly.');
                
                // Clear form
                document.getElementById('inquiry-company').value = '';
                document.getElementById('inquiry-contact').value = '';
                document.getElementById('inquiry-details').value = '';
            } catch (e) {
                console.error(e);
                alert(currentLang === 'ko' ? '접수 중 오류가 발생했습니다. 다시 시도해 주세요.' : 'An error occurred. Please try again.');
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

export function renderFooter() {
    const container = document.getElementById('footer-container');
    if (!container) return;
    container.innerHTML = `
    <footer class="bg-black py-12 border-t border-white/10 text-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-gray-500">
            <div class="mb-4 md:mb-0 flex items-center">
                ${siteData.brand.logoUrl ? 
                    (siteData.brand.logoUrl.startsWith('http') || siteData.brand.logoUrl.startsWith('img_') || siteData.brand.logoUrl.startsWith('data:image') ? 
                        `<img data-img-id="${siteData.brand.logoUrl}" src="${siteData.brand.logoUrl.startsWith('data:image') ? siteData.brand.logoUrl : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="${siteData.brand.name} Logo" class="${siteData.brand.logoUrl.startsWith('data:image') ? '' : 'lazy-firebase-image'} h-6 mr-2 opacity-70">` :
                        `<img src="${siteData.brand.logoUrl}" alt="${siteData.brand.name} Logo" class="h-6 mr-2 opacity-70">`) :
                    `<i class="ph ph-hexagon text-brand-500 text-2xl mr-2"></i>`
                }
                <span class="font-bold text-white tracking-widest uppercase" data-i18n="footerCompany">${siteData.i18n[currentLang].footerCompany}</span>
                <span class="ml-4 pl-4 border-l border-white/10" data-i18n="footerAddress">${siteData.i18n[currentLang].footerAddress}</span>
                <span class="ml-4 pl-4 border-l border-white/10" data-i18n="footerContact">${siteData.i18n[currentLang].footerContact}</span>
            </div>
            <div class="flex items-center space-x-4">
                <p data-i18n="footerCopyright">${siteData.i18n[currentLang].footerCopyright}</p>
                <a href="admin.html" class="text-brand-500 hover:text-white transition ml-4 pl-4 border-l border-white/10">Admin Login</a>
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

export function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (siteData.i18n[currentLang] && siteData.i18n[currentLang][key]) {
            el.innerHTML = siteData.i18n[currentLang][key];
        }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (siteData.i18n[currentLang] && siteData.i18n[currentLang][key]) {
            el.placeholder = siteData.i18n[currentLang][key];
        }
    });

    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) heroTitle.innerHTML = siteData.i18n[currentLang].heroTitle;
    
    const greeting = currentLang === 'ko' ? 
        "안녕하십니까. AI 기술지원 어시스턴트입니다. 제품, 설비, 견적 등에 대해 무엇이든 물어보세요." : 
        "Hello. I am the AI Support Assistant. Ask me anything about products, equipment, or quoting procedures.";
    const chatGreeting = document.getElementById('chat-greeting');
    if (chatGreeting) chatGreeting.innerText = greeting;

    // Update document title based on current page
    const path = window.location.pathname;
    if (path.includes('products.html')) {
        document.title = siteData.i18n[currentLang].pageTitleProducts || siteData.brand.name;
    } else if (path.includes('equipment.html')) {
        document.title = siteData.i18n[currentLang].pageTitleEquipment || siteData.brand.name;
    } else if (path.includes('certs.html')) {
        document.title = siteData.i18n[currentLang].pageTitleCerts || siteData.brand.name;
    } else {
        document.title = siteData.i18n[currentLang].pageTitleMain || siteData.brand.name;
    }
}
