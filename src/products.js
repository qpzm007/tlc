import { siteData, initFirebase, loadFirebaseImages } from './data.js';
import { renderHeader, renderFooter, currentLang, applyTranslations } from './main.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initFirebase();
    
    // Inject Header and Footer
    renderHeader();
    renderFooter();

    renderAllProducts();
    applyTranslations();
    loadFirebaseImages();
});

function renderAllProducts() {
    const container = document.getElementById('all-products-container');
    if (!container) return;

    const productsHTML = siteData.products.map(p => `
        <div class="bg-metal-900 border border-white/10 rounded-2xl p-8 hover:border-brand-500 transition duration-300 group flex flex-col items-center text-center">
            ${p.img.startsWith('http') || p.img.startsWith('img_') ? `<img data-img-id="${p.img}" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" class="lazy-firebase-image w-full h-48 object-cover rounded-xl mb-6 group-hover:scale-105 transition duration-300">` : `<i class="ph ${p.img} text-6xl text-brand-500 mb-6 group-hover:scale-110 transition duration-300 inline-block"></i>`}
            <h3 class="text-2xl font-bold text-white mb-4">${p[currentLang].title}</h3>
            <p class="text-gray-400">${p[currentLang].desc}</p>
        </div>
    `).join('');

    container.innerHTML = productsHTML;
}
