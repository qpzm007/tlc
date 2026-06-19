import { siteData, loadFirebaseImages } from './data.js';
import { renderHeader, renderFooter, currentLang, applyTranslations } from './main.js';

// Wait for main.js to initialize and fire languageChanged
document.addEventListener('languageChanged', () => {
    renderCompanyPage();
    applyTranslations();
    loadFirebaseImages();
});

// Render immediately with default data just in case the event is missed
renderCompanyPage();
applyTranslations();
loadFirebaseImages();

function renderCompanyPage() {
    // 1. CEO Message
    const ceoContainer = document.getElementById('ceo-msg-container');
    if (ceoContainer && siteData.company.ceoMsg) {
        ceoContainer.innerHTML = siteData.company.ceoMsg[currentLang];
    }

    // 2. Vision Section
    const visionContainer = document.getElementById('vision-container');
    if (visionContainer && siteData.company.vision) {
        const v = siteData.company.vision;
        const vTitle = v[currentLang].title;
        const vDesc = v[currentLang].desc.replace(/\n/g, '<br>');
        
        // Update hero desc if we want it to match
        const heroDesc = document.getElementById('hero-vision-desc');
        if (heroDesc) heroDesc.innerText = vTitle;

        visionContainer.innerHTML = `
            <div class="order-2 lg:order-1">
                <h3 class="text-brand-500 font-bold tracking-widest uppercase mb-4 text-sm" data-i18n="visionSub">Our Vision</h3>
                <h4 class="text-3xl md:text-5xl font-black text-white mb-8 leading-tight">${vTitle}</h4>
                <p class="text-gray-400 text-lg md:text-xl font-light leading-relaxed">${vDesc}</p>
            </div>
            <div class="order-1 lg:order-2">
                <div class="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                    <div class="absolute inset-0 bg-brand-500/20 group-hover:bg-transparent transition duration-500 z-10"></div>
                    ${v.img ? (v.img.startsWith('http') || v.img.startsWith('img_') || v.img.startsWith('data:image') ? `<img data-img-id="${v.img}" src="${v.img.startsWith('data:image') ? v.img : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" class="${v.img.startsWith('data:image') ? '' : 'lazy-firebase-image'} w-full aspect-[4/3] object-cover transform group-hover:scale-105 transition duration-700">` : `<div class="w-full aspect-[4/3] bg-metal-800 flex items-center justify-center"><i class="ph ${v.img} text-9xl text-brand-500"></i></div>`) : `<div class="w-full aspect-[4/3] bg-metal-800 flex items-center justify-center"><i class="ph ph-target text-9xl text-gray-600"></i></div>`}
                </div>
            </div>
        `;
    }

    // 3. Core Values Section
    const cvContainer = document.getElementById('core-values-container');
    if (cvContainer && siteData.company.coreValues) {
        const cvHTML = siteData.company.coreValues.map(cv => `
            <div class="bg-metal-900 border border-white/10 rounded-2xl p-8 hover:border-brand-500 transition duration-300 group hover:-translate-y-2 shadow-lg">
                <div class="mb-6 overflow-hidden rounded-xl">
                    ${cv.img ? (cv.img.startsWith('http') || cv.img.startsWith('img_') || cv.img.startsWith('data:image') ? `<img data-img-id="${cv.img}" src="${cv.img.startsWith('data:image') ? cv.img : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" class="${cv.img.startsWith('data:image') ? '' : 'lazy-firebase-image'} w-full h-48 object-cover group-hover:scale-110 transition duration-500">` : `<div class="w-full h-48 bg-metal-800 flex items-center justify-center group-hover:bg-brand-900/30 transition duration-500"><i class="ph ${cv.img} text-6xl text-brand-500 group-hover:scale-110 transition duration-500"></i></div>`) : `<div class="w-full h-48 bg-metal-800 flex items-center justify-center"><i class="ph ph-star text-6xl text-gray-600"></i></div>`}
                </div>
                <h4 class="text-2xl font-bold text-white mb-4 text-center">${cv[currentLang].title}</h4>
                <p class="text-gray-400 text-center">${cv[currentLang].desc.replace(/\n/g, '<br>')}</p>
            </div>
        `).join('');
        cvContainer.innerHTML = cvHTML;
    }
    
    // Update link-certs
    const linkCerts = document.getElementById('link-certs');
    if(linkCerts) {
        linkCerts.href = `${import.meta.env.BASE_URL || '/'}certs.html`;
    }
}
