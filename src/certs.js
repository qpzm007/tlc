import { siteData, loadFirebaseImages } from './data.js';
import { currentLang, applyTranslations } from './main.js';

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

    const certsHTML = siteData.company.certs.map(c => {
        const hasImg = c.img && (c.img.startsWith('http') || c.img.startsWith('img_') || c.img.startsWith('data:image'));
        return `
        <div class="${hasImg ? 'cursor-pointer hover:shadow-2xl' : ''} bg-metal-800 rounded-xl overflow-hidden border border-white/10 hover:border-brand-500 transition duration-300 flex flex-col items-center text-center p-8 group shadow-lg"
             ${hasImg ? `onclick="window.showCertificateLightbox(this)"` : ''}>
            ${c.img ? (c.img.startsWith('http') || c.img.startsWith('img_') || c.img.startsWith('data:image') ? `<img data-img-id="${c.img}" src="${c.img.startsWith('data:image') ? c.img : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" class="${c.img.startsWith('data:image') ? '' : 'lazy-firebase-image'} w-full max-h-64 object-contain rounded-xl mb-6 group-hover:scale-105 transition duration-500 shadow-xl shadow-black/50 bg-white p-2">` : `<i class="ph ${c.img} text-6xl text-brand-500 mb-6 group-hover:scale-110 transition duration-300 inline-block"></i>`) : `<div class="w-full h-48 bg-metal-900 rounded-xl mb-6 flex items-center justify-center"><i class="ph ph-certificate text-6xl text-gray-600"></i></div>`}
            <h3 class="text-2xl font-bold text-white mb-2">${c.name}</h3>
            <p class="text-brand-400 font-medium">${currentLang === 'ko' ? c.detail : c.enDetail}</p>
        </div>
        `;
    }).join('');

    container.innerHTML = certsHTML;
    initLightbox();
}

// Lightbox Modal Logic
function initLightbox() {
    let modal = document.getElementById('certs-lightbox');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'certs-lightbox';
        modal.className = 'fixed inset-0 z-[100] hidden items-center justify-center bg-black/90 backdrop-blur-sm cursor-zoom-out opacity-0 transition-opacity duration-300';
        modal.innerHTML = `
            <button class="absolute top-6 right-6 text-white/70 hover:text-white transition text-4xl" title="닫기">
                <i class="ph ph-x"></i>
            </button>
            <div class="max-w-4xl max-h-[85vh] px-4 flex flex-col items-center justify-center cursor-default" onclick="event.stopPropagation()">
                <img id="lightbox-img" class="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-white/10 bg-white p-4 cursor-zoom-out" src="" alt="Certificate Detail">
                <h4 id="lightbox-title" class="text-2xl font-bold text-white mt-4 text-center"></h4>
                <p id="lightbox-desc" class="text-brand-400 text-base mt-1 text-center"></p>
            </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener('click', closeLightbox);
        modal.querySelector('button').addEventListener('click', closeLightbox);
        modal.querySelector('#lightbox-img').addEventListener('click', closeLightbox);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeLightbox();
            }
        });
    }
}

window.showCertificateLightbox = function(cardEl) {
    const imgEl = cardEl.querySelector('img');
    const titleEl = cardEl.querySelector('h3');
    const descEl = cardEl.querySelector('p');

    if (imgEl && imgEl.src && !imgEl.src.includes('data:image/gif;base64')) {
        const modal = document.getElementById('certs-lightbox');
        const img = document.getElementById('lightbox-img');
        const title = document.getElementById('lightbox-title');
        const desc = document.getElementById('lightbox-desc');

        img.src = imgEl.src;
        title.innerText = titleEl.innerText;
        desc.innerText = descEl.innerText;

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.classList.add('opacity-100');
        }, 10);
    }
};

function closeLightbox() {
    const modal = document.getElementById('certs-lightbox');
    if (!modal) return;
    
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 300);
}
