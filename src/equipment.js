import { siteData, initFirebase, loadFirebaseImages } from './data.js';
import { renderHeader, renderFooter, currentLang, applyTranslations } from './main.js';

// Wait for main.js to initialize and fire languageChanged
document.addEventListener('languageChanged', () => {
    renderAllEquipment();
    applyTranslations();
    loadFirebaseImages();
});


function renderAllEquipment() {
    const container = document.getElementById('all-equipment-container');
    if (!container) return;

    const equipmentHTML = siteData.equipment.map(eq => `
        <div class="bg-metal-800 rounded-xl overflow-hidden border border-white/10 hover:border-brand-500 transition duration-300 flex flex-col">
            ${eq.img ? `<img data-img-id="${eq.img}" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="${eq.name}" class="lazy-firebase-image w-full h-48 object-cover">` : `<div class="w-full h-48 bg-metal-900 flex items-center justify-center"><i class="ph ph-image text-4xl text-gray-600"></i></div>`}
            <div class="p-6 flex-1 flex flex-col justify-center">
                <h4 class="text-xl font-bold text-white mb-2">${eq.name}</h4>
                <p class="text-brand-400 font-medium mb-3">${eq.spec}</p>
                <p class="text-gray-400 text-sm">${eq[currentLang]}</p>
            </div>
        </div>
    `).join('');

    container.innerHTML = equipmentHTML;
}
