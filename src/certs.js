import { siteData, initFirebase, loadFirebaseImages } from './data.js';
import { renderHeader, renderFooter, currentLang, applyTranslations } from './main.js';

// Wait for main.js to initialize and fire languageChanged
document.addEventListener('languageChanged', () => {
    renderAllCerts();
    applyTranslations();
    loadFirebaseImages();
});

// Render immediately with default data just in case the event is missed
renderAllCerts();
applyTranslations();
loadFirebaseImages();


function renderAllCerts() {
    const container = document.getElementById('all-certs-container');
    if (!container) return;

    const certsHTML = siteData.company.certs.map(c => `
        <div class="bg-metal-800 rounded-xl overflow-hidden border border-white/10 hover:border-brand-500 transition duration-300 flex flex-col items-center text-center p-8 group">
            ${c.img ? (c.img.startsWith('http') || c.img.startsWith('img_') || c.img.startsWith('data:image') ? `<img data-img-id="${c.img}" src="${c.img.startsWith('data:image') ? c.img : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" class="${c.img.startsWith('data:image') ? '' : 'lazy-firebase-image'} w-full max-h-64 object-contain rounded-xl mb-6 group-hover:scale-105 transition duration-500 shadow-xl shadow-black/50 bg-white p-2">` : `<i class="ph ${c.img} text-6xl text-brand-500 mb-6 group-hover:scale-110 transition duration-300 inline-block"></i>`) : `<div class="w-full h-48 bg-metal-900 rounded-xl mb-6 flex items-center justify-center"><i class="ph ph-certificate text-6xl text-gray-600"></i></div>`}
            <h3 class="text-2xl font-bold text-white mb-2">${c.name}</h3>
            <p class="text-brand-400 font-medium">${currentLang === 'ko' ? c.detail : c.enDetail}</p>
        </div>
    `).join('');

    container.innerHTML = certsHTML;
}
