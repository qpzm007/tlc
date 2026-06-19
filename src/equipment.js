import { siteData, initFirebase, loadFirebaseImages } from './data.js';
import { renderHeader, renderFooter, currentLang, applyTranslations } from './main.js';

// Wait for main.js to initialize and fire languageChanged
document.addEventListener('languageChanged', () => {
    renderAllEquipment();
    applyTranslations();
    loadFirebaseImages();
});

// Render immediately with default data just in case the event is missed
renderAllEquipment();
applyTranslations();
loadFirebaseImages();

function renderAllEquipment() {
    const container = document.getElementById('all-equipment-container');
    if (!container) return;

    const equipmentHTML = siteData.equipment.map(eq => `
        <div class="bg-metal-800 rounded-xl overflow-hidden border border-white/10 hover:border-brand-500 transition duration-300 flex flex-col">
            ${eq.img ? (eq.img.startsWith('http') || eq.img.startsWith('img_') || eq.img.startsWith('data:image') ? `<img data-img-id="${eq.img}" src="${eq.img.startsWith('data:image') ? eq.img : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="${eq.name}" class="${eq.img.startsWith('data:image') ? '' : 'lazy-firebase-image'} w-full h-48 object-cover">` : `<div class="w-full h-48 bg-metal-900 flex items-center justify-center"><i class="ph ${eq.img} text-6xl text-brand-500"></i></div>`) : `<div class="w-full h-48 bg-metal-900 flex items-center justify-center"><i class="ph ph-image text-4xl text-gray-600"></i></div>`}
            <div class="p-6 flex-1 flex flex-col justify-center">
                <h4 class="text-xl font-bold text-white mb-2">${eq.name}</h4>
                <p class="text-brand-400 font-medium mb-3">${eq.spec}</p>
                <p class="text-gray-400 text-sm">${eq[currentLang]}</p>
            </div>
        </div>
    `).join('');

    container.innerHTML = equipmentHTML;
}
