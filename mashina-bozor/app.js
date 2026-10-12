// ===================================================
// AVTO BOZOR PRO - Asosiy Dastur Mantiqi (app.js)
// ===================================================

// Global State
let cars = [];
let favorites = new Set();
let compareList = new Set();
let myAds = new Set();
let currentTab = 'all';
let viewMode = 'grid';
let activeBrand = 'all';

// Audio feedback (Web Audio API)
const playAudioFeedback = (type = 'click') => {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'click') {
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        } else if (type === 'success') {
            osc.frequency.setValueAtTime(440, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.12);
        }
    } catch (e) {
        // Audio konteksti xatosi bo'lsa e'tiborsiz qoldiriladi
    }
};

// Preset avtomobil rasmlari (Foydalanuvchi tezkor tanlashi uchun)
const PRESET_CAR_IMAGES = [
    { name: "Sedan Qora", url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80" },
    { name: "Krossover Oq", url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80" },
    { name: "Elektromobil Kulrang", url: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80" },
    { name: "Sedan Oq", url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80" },
    { name: "Sport Ko'k", url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80" },
    { name: "Kumush Sedan", url: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80" }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadStoredData();
    setupEventListeners();
    setupPresetImages();
    renderBrandPills();
    renderCars();
    initLoanCalculator();
    updateBadges();
});

// Ma'lumotlarni LocalStorage dan yuklash
function loadStoredData() {
    const savedCars = localStorage.getItem('avtobozor_cars');
    if (savedCars) {
        try {
            cars = JSON.parse(savedCars);
        } catch (e) {
            cars = [...INITIAL_CARS];
        }
    } else {
        cars = [...INITIAL_CARS];
        saveCarsToStorage();
    }

    const savedFavs = localStorage.getItem('avtobozor_favorites');
    if (savedFavs) {
        favorites = new Set(JSON.parse(savedFavs));
    }

    const savedCompare = localStorage.getItem('avtobozor_compare');
    if (savedCompare) {
        compareList = new Set(JSON.parse(savedCompare));
    }

    const savedMyAds = localStorage.getItem('avtobozor_myads');
    if (savedMyAds) {
        myAds = new Set(JSON.parse(savedMyAds));
    }

    document.getElementById('statTotalCars').textContent = cars.length;
}

function saveCarsToStorage() {
    localStorage.setItem('avtobozor_cars', JSON.stringify(cars));
    document.getElementById('statTotalCars').textContent = cars.length;
}

function saveFavoritesToStorage() {
    localStorage.setItem('avtobozor_favorites', JSON.stringify([...favorites]));
}

function saveCompareToStorage() {
    localStorage.setItem('avtobozor_compare', JSON.stringify([...compareList]));
}

function saveMyAdsToStorage() {
    localStorage.setItem('avtobozor_myads', JSON.stringify([...myAds]));
}

// Raqamlarni chiroyli formatlash
function formatPriceUSD(num) {
    return '$' + Number(num).toLocaleString('en-US');
}

function formatPriceUZS(numUSD) {
    const uzs = Math.round(numUSD * USD_TO_UZS);
    return Number(uzs).toLocaleString('uz-UZ') + ' UZS';
}

function formatMileage(km) {
    return Number(km).toLocaleString('uz-UZ') + ' km';
}

// Oylik taxminiy kredit hisoblash (3 yil, 25% stavka, 30% boshlang'ich)
function calcEstimateCreditMonthly(price) {
    const loan = price * 0.70;
    const r = 0.24 / 12;
    const n = 36;
    const monthly = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(monthly);
}

// ===================================================
// Render funksiyalari
// ===================================================

// Marka filtrlash tugmachalari
function renderBrandPills() {
    const container = document.getElementById('brandPillsContainer');
    container.innerHTML = '';

    // Markalar soni
    const brandCounts = {};
    cars.forEach(c => {
        brandCounts[c.brand] = (brandCounts[c.brand] || 0) + 1;
    });

    // "Barchasi" tugmasi
    const allPill = document.createElement('div');
    allPill.className = `filter-pill ${activeBrand === 'all' ? 'active' : ''}`;
    allPill.textContent = `Barchasi (${cars.length})`;
    allPill.addEventListener('click', () => {
        playAudioFeedback('click');
        activeBrand = 'all';
        renderBrandPills();
        renderCars();
    });
    container.appendChild(allPill);

    Object.keys(brandCounts).sort().forEach(brand => {
        const pill = document.createElement('div');
        pill.className = `filter-pill ${activeBrand === brand ? 'active' : ''}`;
        pill.textContent = `${brand} (${brandCounts[brand]})`;
        pill.addEventListener('click', () => {
            playAudioFeedback('click');
            activeBrand = brand;
            renderBrandPills();
            renderCars();
        });
        container.appendChild(pill);
    });
}

// Asosiy mashinalar ro'yxatini chiqarish
function renderCars() {
    const grid = document.getElementById('carsGrid');
    const resultsCountEl = document.getElementById('resultsCount');

    // Filtrlash
    const filtered = getFilteredCars();
    resultsCountEl.textContent = `${filtered.length} ta`;

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                <h3>Mashina topilmadi</h3>
                <p>Tanlangan filtrlarga mos keluvchi avtomobillar mavjud emas. Filtrlarni o'zgartirib yoki tozalab ko'ring.</p>
                <button class="btn-post-ad" style="margin: 0 auto;" onclick="resetAllFilters()">Filtrlarni tozalash</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = '';
    filtered.forEach(car => {
        const isFav = favorites.has(car.id);
        const isCompared = compareList.has(car.id);
        const estCredit = calcEstimateCreditMonthly(car.price);

        const card = document.createElement('div');
        card.className = 'car-card';

        // Badges
        let badgeHTML = '';
        if (car.featured) {
            badgeHTML += `<span class="badge badge-featured">TOP E'lon</span>`;
        }
        if (car.fuel.includes('Elektr') || car.fuel.includes('Gibrid')) {
            badgeHTML += `<span class="badge badge-ev">${car.fuel.includes('Elektr') ? '⚡ 100% Elektr' : '🔋 Gibrid'}</span>`;
        }
        if (car.year >= 2024 || car.isNew) {
            badgeHTML += `<span class="badge badge-new">Yangi</span>`;
        }

        const mainImage = car.images && car.images.length > 0 ? car.images[0] : PRESET_CAR_IMAGES[0].url;

        card.innerHTML = `
            <div class="card-media">
                <img src="${mainImage}" alt="${car.title}" loading="lazy">
                <div class="card-badges">
                    ${badgeHTML}
                </div>
                <div class="card-actions-top">
                    <button class="btn-icon-circle ${isCompared ? 'compared' : ''}" title="Solishtirishga qo'shish" onclick="toggleCompare('${car.id}', event)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>
                    </button>
                    <button class="btn-icon-circle ${isFav ? 'liked' : ''}" title="Sevimlilarga qo'shish" onclick="toggleFavorite('${car.id}', event)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    </button>
                </div>
            </div>

            <div class="card-body">
                <div class="card-header-meta">
                    <div class="card-city">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        ${car.city}
                    </div>
                    <div class="card-year">${car.year} yil</div>
                </div>

                <div class="card-title" title="${car.title}">${car.title}</div>

                <div class="card-specs-grid">
                    <div class="spec-item" title="Bosib o'tgan masofa">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span>${formatMileage(car.mileage)}</span>
                    </div>
                    <div class="spec-item" title="Yoqilg'i turi">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10h10M7 14h10"/></svg>
                        <span>${car.fuel}</span>
                    </div>
                    <div class="spec-item" title="Uzatma qutisi">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M3 9h3v6H3zM18 9h3v6h-3z"/></svg>
                        <span>${car.transmission}</span>
                    </div>
                    <div class="spec-item" title="Dvigatel">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
                        <span>${car.engine ? car.engine.split(' ')[0] : 'Motor'}</span>
                    </div>
                </div>

                <div class="card-pricing">
                    <div class="price-box">
                        <div class="price-usd">${formatPriceUSD(car.price)}</div>
                        <div class="price-uzs">≈ ${formatPriceUZS(car.price)}</div>
                        <div class="price-credit">Kredit: oyiga <strong>$${estCredit}</strong> dan</div>
                    </div>
                </div>

                <div class="card-footer-buttons">
                    <button class="btn-card-details" onclick="openCarDetailModal('${car.id}')">Batafsil</button>
                    <button class="btn-card-contact" onclick="quickContactSeller('${car.id}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        Aloqa
                    </button>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Filtrlash shartlarini hisoblash
function getFilteredCars() {
    const searchVal = document.getElementById('navSearchInput').value.trim().toLowerCase();
    const priceMin = parseFloat(document.getElementById('filterPriceMin').value) || 0;
    const priceMax = parseFloat(document.getElementById('filterPriceMax').value) || Infinity;
    const yearMin = parseInt(document.getElementById('filterYearMin').value) || 1900;
    const yearMax = parseInt(document.getElementById('filterYearMax').value) || 2050;
    const fuel = document.getElementById('filterFuel').value;
    const transmission = document.getElementById('filterTransmission').value;
    const city = document.getElementById('filterCity').value;
    const cleanPaintOnly = document.getElementById('filterCleanPaintOnly').checked;
    const featuredOnly = document.getElementById('filterFeaturedOnly').checked;
    const sortBy = document.getElementById('sortSelector').value;

    let res = cars.filter(car => {
        // Tab bo'yicha
        if (currentTab === 'ev' && !car.fuel.includes('Elektr') && !car.fuel.includes('Gibrid')) return false;
        if (currentTab === 'featured' && !car.featured) return false;
        if (currentTab === 'favorites' && !favorites.has(car.id)) return false;
        if (currentTab === 'my-ads' && !myAds.has(car.id)) return false;

        // Marka bo'yicha
        if (activeBrand !== 'all' && car.brand.toLowerCase() !== activeBrand.toLowerCase()) return false;

        // Qidiruv so'zi bo'yicha
        if (searchVal) {
            const matchTitle = car.title.toLowerCase().includes(searchVal);
            const matchBrand = car.brand.toLowerCase().includes(searchVal);
            const matchModel = car.model.toLowerCase().includes(searchVal);
            const matchCity = car.city.toLowerCase().includes(searchVal);
            if (!matchTitle && !matchBrand && !matchModel && !matchCity) return false;
        }

        // Narx bo'yicha
        if (car.price < priceMin || car.price > priceMax) return false;

        // Yil bo'yicha
        if (car.year < yearMin || car.year > yearMax) return false;

        // Yoqilg'i bo'yicha
        if (fuel !== 'all' && car.fuel !== fuel) return false;

        // Uzatma bo'yicha
        if (transmission !== 'all' && car.transmission !== transmission) return false;

        // Shahar bo'yicha
        if (city !== 'all' && car.city !== city) return false;

        // Kraska tozaligi
        if (cleanPaintOnly && !car.paintCondition.toLowerCase().includes('toza')) return false;

        // TOP E'lon
        if (featuredOnly && !car.featured) return false;

        return true;
    });

    // Saralash (Sort)
    if (sortBy === 'price-asc') {
        res.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
        res.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'year-desc') {
        res.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'mileage-asc') {
        res.sort((a, b) => a.mileage - b.mileage);
    } else {
        // Featured first
        res.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return res;
}

// ===================================================
// Sevimlilar & Solishtirish Funksiyalari
// ===================================================

function toggleFavorite(id, event) {
    if (event) event.stopPropagation();
    playAudioFeedback('click');

    if (favorites.has(id)) {
        favorites.delete(id);
        showToast("Mashina sevimlilardan olib tashlandi", "warning");
    } else {
        favorites.add(id);
        playAudioFeedback('success');
        showToast("Mashina sevimlilarga qo'shildi! ❤️", "success");
    }

    saveFavoritesToStorage();
    updateBadges();
    renderCars();
}

function toggleCompare(id, event) {
    if (event) event.stopPropagation();
    playAudioFeedback('click');

    if (compareList.has(id)) {
        compareList.delete(id);
        showToast("Solishtirish ro'yxatidan olib tashlandi", "warning");
    } else {
        if (compareList.size >= 3) {
            showToast("Maksimal 3 ta mashinani solishtirish mumkin!", "warning");
            return;
        }
        compareList.add(id);
        playAudioFeedback('success');
        showToast("Mashina solishtirishga qo'shildi! ⚖️", "success");
    }

    saveCompareToStorage();
    updateBadges();
    renderCars();
}

function updateBadges() {
    const favCountEl = document.getElementById('favoritesBadgeCount');
    const compCountEl = document.getElementById('compareBadgeCount');

    if (favorites.size > 0) {
        favCountEl.textContent = favorites.size;
        favCountEl.style.display = 'flex';
    } else {
        favCountEl.style.display = 'none';
    }

    if (compareList.size > 0) {
        compCountEl.textContent = compareList.size;
        compCountEl.style.display = 'flex';
    } else {
        compCountEl.style.display = 'none';
    }
}

// ===================================================
// Mashina Batafsil Ko'rish Modali
// ===================================================

let currentDetailCar = null;

function openCarDetailModal(carId) {
    playAudioFeedback('click');
    const car = cars.find(c => c.id === carId);
    if (!car) return;

    currentDetailCar = car;

    document.getElementById('detailCarTitle').textContent = car.title;
    document.getElementById('detailSubTitle').textContent = `${car.brand} ${car.model} • ${car.year}-yil`;
    document.getElementById('detailLocation').innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        ${car.city}
    `;

    document.getElementById('detailPriceUSD').textContent = formatPriceUSD(car.price);
    document.getElementById('detailPriceUZS').textContent = `≈ ${formatPriceUZS(car.price)}`;

    // Galereya rasmlari
    const mainImg = document.getElementById('detailMainImg');
    const thumbsCont = document.getElementById('detailGalleryThumbs');
    thumbsCont.innerHTML = '';

    const images = car.images && car.images.length > 0 ? car.images : [PRESET_CAR_IMAGES[0].url];
    mainImg.src = images[0];

    images.forEach((imgUrl, index) => {
        const thumb = document.createElement('div');
        thumb.className = `gallery-thumb ${index === 0 ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${imgUrl}" alt="Kichik rasm">`;
        thumb.addEventListener('click', () => {
            mainImg.src = imgUrl;
            document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
        thumbsCont.appendChild(thumb);
    });

    // Texnik parametrlar
    const specsGrid = document.getElementById('detailSpecsGrid');
    specsGrid.innerHTML = `
        <div class="spec-box"><div class="spec-box-label">Yili</div><div class="spec-box-value">${car.year}</div></div>
        <div class="spec-box"><div class="spec-box-label">Bosib o'tgan masofasi</div><div class="spec-box-value">${formatMileage(car.mileage)}</div></div>
        <div class="spec-box"><div class="spec-box-label">Yoqilg'i turi</div><div class="spec-box-value">${car.fuel}</div></div>
        <div class="spec-box"><div class="spec-box-label">Uzatma qutisi</div><div class="spec-box-value">${car.transmission}</div></div>
        <div class="spec-box"><div class="spec-box-label">Dvigatel</div><div class="spec-box-value">${car.engine || "Standart"}</div></div>
        <div class="spec-box"><div class="spec-box-label">Kuzov turi</div><div class="spec-box-value">${car.bodyType}</div></div>
        <div class="spec-box"><div class="spec-box-label">Rangi</div><div class="spec-box-value">${car.color || "Standart"}</div></div>
        <div class="spec-box"><div class="spec-box-label">Kraskasi</div><div class="spec-box-value">${car.paintCondition || "Toza"}</div></div>
    `;

    // Qulayliklar
    const featuresList = document.getElementById('detailFeaturesList');
    featuresList.innerHTML = '';
    const features = car.features && car.features.length > 0 ? car.features : ['Konditsioner', 'ABS', 'Audio tizim', 'Elektr oynalar'];
    features.forEach(feat => {
        const span = document.createElement('span');
        span.className = 'feature-tag';
        span.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            ${feat}
        `;
        featuresList.appendChild(span);
    });

    // Tavsif
    document.getElementById('detailDescription').textContent = car.description || "Mashina haqida qo'shimcha ma'lumot keltirilmagan.";

    // Sotuvchi
    const seller = car.seller || { name: "Sotuvchi", phone: "+998 90 000 00 00", telegram: "", type: "Egasi" };
    document.getElementById('detailSellerName').textContent = seller.name;
    document.getElementById('detailSellerType').textContent = seller.type;
    document.getElementById('detailSellerAvatar').textContent = seller.name.charAt(0).toUpperCase();

    const phoneBtn = document.getElementById('btnRevealPhone');
    const phoneText = document.getElementById('detailPhoneText');
    phoneText.textContent = "Raqamni ko'rish";
    phoneBtn.onclick = () => {
        playAudioFeedback('click');
        phoneText.textContent = seller.phone;
        window.location.href = `tel:${seller.phone.replace(/\s+/g, '')}`;
    };

    const tgLink = document.getElementById('detailTelegramLink');
    if (seller.telegram) {
        tgLink.href = `https://t.me/${seller.telegram.replace('@', '')}`;
        tgLink.style.display = 'inline-flex';
    } else {
        tgLink.href = `https://t.me/avtobozor_admin`;
    }

    // Modalni ochish
    document.getElementById('carDetailModal').classList.add('active');
}

function quickContactSeller(carId) {
    const car = cars.find(c => c.id === carId);
    if (!car) return;
    openCarDetailModal(carId);
}

// ===================================================
// Yangi E'lon Berish (Mashina Sotish)
// ===================================================

function setupPresetImages() {
    const gallery = document.getElementById('presetGallery');
    gallery.innerHTML = '';

    PRESET_CAR_IMAGES.forEach((item, index) => {
        const img = document.createElement('img');
        img.className = `preset-thumb ${index === 0 ? 'active' : ''}`;
        img.src = item.url;
        img.title = item.name;
        img.alt = item.name;

        img.addEventListener('click', () => {
            playAudioFeedback('click');
            document.querySelectorAll('.preset-thumb').forEach(t => t.classList.remove('active'));
            img.classList.add('active');
            document.getElementById('selectedImageUrl').value = item.url;
            showToast(`Fotosurat tanlandi: ${item.name}`, 'success');
        });

        gallery.appendChild(img);
    });
}

function setupEventListeners() {
    // Logo bosilganda qayta tiklash
    document.getElementById('btnLogo').addEventListener('click', () => {
        resetAllFilters();
    });

    // Qidiruv maydoni
    document.getElementById('navSearchInput').addEventListener('input', () => {
        renderCars();
    });

    // Hero qidiruvi
    document.getElementById('btnQuickSearch').addEventListener('click', () => {
        playAudioFeedback('click');
        const brand = document.getElementById('quickBrandSelect').value;
        const maxPrice = document.getElementById('quickPriceSelect').value;
        const body = document.getElementById('quickBodySelect').value;
        const fuel = document.getElementById('quickFuelSelect').value;

        if (brand !== 'all') activeBrand = brand;
        if (maxPrice !== 'all') document.getElementById('filterPriceMax').value = maxPrice;
        if (fuel !== 'all') document.getElementById('filterFuel').value = fuel;

        renderBrandPills();
        renderCars();

        // Scroll to listings
        document.querySelector('.listings-container').scrollIntoView({ behavior: 'smooth' });
    });

    // View rejimi (Grid / List)
    document.getElementById('btnViewGrid').addEventListener('click', () => {
        playAudioFeedback('click');
        viewMode = 'grid';
        document.getElementById('btnViewGrid').classList.add('active');
        document.getElementById('btnViewList').classList.remove('active');
        document.getElementById('carsGrid').classList.remove('list-view');
    });

    document.getElementById('btnViewList').addEventListener('click', () => {
        playAudioFeedback('click');
        viewMode = 'list';
        document.getElementById('btnViewList').classList.add('active');
        document.getElementById('btnViewGrid').classList.remove('active');
        document.getElementById('carsGrid').classList.add('list-view');
    });

    // Saralash tanlanganda
    document.getElementById('sortSelector').addEventListener('change', () => {
        renderCars();
    });

    // Sidebar filtrlari
    ['filterPriceMin', 'filterPriceMax', 'filterYearMin', 'filterYearMax', 'filterFuel', 'filterTransmission', 'filterCity', 'filterCleanPaintOnly', 'filterFeaturedOnly'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', renderCars);
            el.addEventListener('input', renderCars);
        }
    });

    // Narx matnini yangilash
    const updatePriceRangeLabel = () => {
        const min = document.getElementById('filterPriceMin').value || 0;
        const max = document.getElementById('filterPriceMax').value || '60,000+';
        document.getElementById('priceDisplayRange').textContent = `$${Number(min).toLocaleString()} - $${Number(max).toLocaleString()}`;
    };
    document.getElementById('filterPriceMin').addEventListener('input', updatePriceRangeLabel);
    document.getElementById('filterPriceMax').addEventListener('input', updatePriceRangeLabel);

    // Kategoriya tablari
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            playAudioFeedback('click');
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTab = tab.dataset.tab;
            renderCars();
        });
    });

    // Reset filters
    document.getElementById('btnResetFilters').addEventListener('click', resetAllFilters);

    // Modal Triggerlar
    document.getElementById('btnOpenPostAd').addEventListener('click', () => {
        playAudioFeedback('click');
        document.getElementById('postAdModal').classList.add('active');
    });
    document.getElementById('btnClosePostAdModal').addEventListener('click', () => {
        document.getElementById('postAdModal').classList.remove('active');
    });

    document.getElementById('btnOpenFavorites').addEventListener('click', () => {
        playAudioFeedback('click');
        document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        const favTab = document.querySelector('.category-tab[data-tab="favorites"]');
        if (favTab) favTab.classList.add('active');
        currentTab = 'favorites';
        renderCars();
        document.querySelector('.listings-container').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('btnOpenCompare').addEventListener('click', () => {
        playAudioFeedback('click');
        openCompareModal();
    });
    document.getElementById('btnCloseCompareModal').addEventListener('click', () => {
        document.getElementById('compareModal').classList.remove('active');
    });

    document.getElementById('btnOpenLoanCalc').addEventListener('click', () => {
        playAudioFeedback('click');
        document.getElementById('loanCalcModal').classList.add('active');
    });
    document.getElementById('btnCloseLoanCalcModal').addEventListener('click', () => {
        document.getElementById('loanCalcModal').classList.remove('active');
    });

    document.getElementById('btnCloseDetailModal').addEventListener('click', () => {
        document.getElementById('carDetailModal').classList.remove('active');
    });

    // Tashqi fon bosilganda modalni yopish
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });

    // Savdolashish (Narx taklif qilish) formasi
    document.getElementById('offerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const offerVal = document.getElementById('offerAmountInput').value;
        if (!offerVal || !currentDetailCar) return;

        playAudioFeedback('success');
        showToast(`Sizning $${Number(offerVal).toLocaleString()} taklifingiz sotuvchiga yuborildi!`, 'success');
        document.getElementById('offerAmountInput').value = '';

        // Telegram link tayyorlash
        if (currentDetailCar.seller && currentDetailCar.seller.telegram) {
            const msg = encodeURIComponent(`Assalomu alaykum! Men "${currentDetailCar.title}" e'loningiz bo'yicha $${offerVal} taklif qilmoqchiman.`);
            window.open(`https://t.me/${currentDetailCar.seller.telegram}?text=${msg}`, '_blank');
        }
    });

    // Fayl yuklash (Kompyuterdan rasm tanlash)
    const dropZone = document.getElementById('dropZoneUpload');
    const fileInput = document.getElementById('fileImageInput');

    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                document.getElementById('selectedImageUrl').value = evt.target.result;
                showToast("Kompyuterdan fotosurat yuklandi! 📸", "success");
                dropZone.innerHTML = `
                    <img src="${evt.target.result}" style="max-height: 120px; border-radius: 8px; margin-bottom: 8px;">
                    <p style="font-size: 12px; color: var(--accent-emerald);">Fotosurat muvaffaqiyatli yuklandi</p>
                `;
            };
            reader.readAsDataURL(file);
        }
    });

    // Yangi e'lon qo'shish formasi
    document.getElementById('newCarForm').addEventListener('submit', (e) => {
        e.preventDefault();
        playAudioFeedback('success');

        const brand = document.getElementById('newCarBrand').value.trim();
        const model = document.getElementById('newCarModel').value.trim();
        const year = parseInt(document.getElementById('newCarYear').value);
        const price = parseFloat(document.getElementById('newCarPrice').value);
        const mileage = parseInt(document.getElementById('newCarMileage').value);
        const fuel = document.getElementById('newCarFuel').value;
        const transmission = document.getElementById('newCarTransmission').value;
        const bodyType = document.getElementById('newCarBody').value;
        const engine = document.getElementById('newCarEngine').value.trim() || "Standart motor";
        const color = document.getElementById('newCarColor').value.trim() || "Standart rang";
        const paintCondition = document.getElementById('newCarPaint').value;
        const city = document.getElementById('newCarCity').value;
        const sellerName = document.getElementById('newSellerName').value.trim();
        const sellerPhone = document.getElementById('newSellerPhone').value.trim();
        const description = document.getElementById('newCarDescription').value.trim();
        const image = document.getElementById('selectedImageUrl').value;

        const newCarObj = {
            id: "car-user-" + Date.now(),
            title: `${brand} ${model}`,
            brand: brand,
            model: model,
            year: year,
            price: price,
            mileage: mileage,
            fuel: fuel,
            transmission: transmission,
            engine: engine,
            bodyType: bodyType,
            color: color,
            city: city,
            paintCondition: paintCondition,
            isNew: year >= 2024,
            featured: true, // yangi qo'shilgan e'lon yuqorida ko'rinsin
            images: [image],
            seller: {
                name: sellerName,
                phone: sellerPhone,
                telegram: sellerName.toLowerCase().replace(/\s+/g, '_'),
                type: "Egasi"
            },
            description: description || "Yangi yuklangan avtomobil e'loni.",
            features: ["Konditsioner", "Elektr oynalar", "Audio tizim"]
        };

        // Boshiga qo'shish
        cars.unshift(newCarObj);
        myAds.add(newCarObj.id);

        saveCarsToStorage();
        saveMyAdsToStorage();

        // Tozalash va yopish
        document.getElementById('newCarForm').reset();
        document.getElementById('postAdModal').classList.remove('active');

        renderBrandPills();
        renderCars();

        showToast("Tabriklaymiz! Sizning e'loningiz muvaffaqiyatli chop etildi 🎉", "success");

        // Yangi qo'shilgan mashinani ochib ko'rsatish
        setTimeout(() => {
            openCarDetailModal(newCarObj.id);
        }, 500);
    });
}

function resetAllFilters() {
    playAudioFeedback('click');
    activeBrand = 'all';
    currentTab = 'all';
    document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.category-tab[data-tab="all"]').classList.add('active');

    document.getElementById('navSearchInput').value = '';
    document.getElementById('filterPriceMin').value = '';
    document.getElementById('filterPriceMax').value = '';
    document.getElementById('filterYearMin').value = '';
    document.getElementById('filterYearMax').value = '';
    document.getElementById('filterFuel').value = 'all';
    document.getElementById('filterTransmission').value = 'all';
    document.getElementById('filterCity').value = 'all';
    document.getElementById('filterCleanPaintOnly').checked = false;
    document.getElementById('filterFeaturedOnly').checked = false;
    document.getElementById('sortSelector').value = 'featured';

    renderBrandPills();
    renderCars();
    showToast("Filtrlar tozalandi", "info");
}

// ===================================================
// Solishtirish Modali (Compare Cars)
// ===================================================

function openCompareModal() {
    const modalBody = document.getElementById('compareModalBody');
    const compCars = cars.filter(c => compareList.has(c.id));

    if (compCars.length === 0) {
        modalBody.innerHTML = `
            <div class="empty-state">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/>
                </svg>
                <h3>Solishtirish uchun mashina tanlanmagan</h3>
                <p>Katalogdagi istalgan 2 yoki 3 ta avtomobildagi "Solishtirish" belgisini bosing.</p>
            </div>
        `;
        document.getElementById('compareModal').classList.add('active');
        return;
    }

    let headersHTML = `<div class="compare-row-header">Parametrlar</div>`;
    let rowsData = {
        image: `<div class="compare-row-header">Fotosurat</div>`,
        title: `<div class="compare-row-header">Model</div>`,
        price: `<div class="compare-row-header">Narxi ($)</div>`,
        year: `<div class="compare-row-header">Yili</div>`,
        mileage: `<div class="compare-row-header">Bosgan masofasi</div>`,
        fuel: `<div class="compare-row-header">Yoqilg'i</div>`,
        transmission: `<div class="compare-row-header">Uzatma qutisi</div>`,
        engine: `<div class="compare-row-header">Dvigatel</div>`,
        paint: `<div class="compare-row-header">Kraska holati</div>`,
        city: `<div class="compare-row-header">Shahar</div>`,
        action: `<div class="compare-row-header">Olib tashlash</div>`
    };

    compCars.forEach(c => {
        const img = c.images && c.images.length > 0 ? c.images[0] : PRESET_CAR_IMAGES[0].url;
        rowsData.image += `
            <div class="compare-cell">
                <img src="${img}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px;">
            </div>
        `;
        rowsData.title += `<div class="compare-cell">${c.title}</div>`;
        rowsData.price += `<div class="compare-cell" style="color: var(--primary); font-size: 17px; font-weight: 800;">${formatPriceUSD(c.price)}</div>`;
        rowsData.year += `<div class="compare-cell">${c.year}</div>`;
        rowsData.mileage += `<div class="compare-cell">${formatMileage(c.mileage)}</div>`;
        rowsData.fuel += `<div class="compare-cell">${c.fuel}</div>`;
        rowsData.transmission += `<div class="compare-cell">${c.transmission}</div>`;
        rowsData.engine += `<div class="compare-cell">${c.engine || '-'}</div>`;
        rowsData.paint += `<div class="compare-cell">${c.paintCondition}</div>`;
        rowsData.city += `<div class="compare-cell">${c.city}</div>`;
        rowsData.action += `
            <div class="compare-cell">
                <button class="btn-card-details" style="color: var(--accent-rose); border-color: rgba(244,63,94,0.3);" onclick="removeCompareItem('${c.id}')">O'chirish</button>
            </div>
        `;
    });

    modalBody.innerHTML = `
        <div class="compare-grid" style="grid-template-columns: 140px repeat(${compCars.length}, 1fr);">
            ${rowsData.image}
            ${rowsData.title}
            ${rowsData.price}
            ${rowsData.year}
            ${rowsData.mileage}
            ${rowsData.fuel}
            ${rowsData.transmission}
            ${rowsData.engine}
            ${rowsData.paint}
            ${rowsData.city}
            ${rowsData.action}
        </div>
    `;

    document.getElementById('compareModal').classList.add('active');
}

function removeCompareItem(carId) {
    compareList.delete(carId);
    saveCompareToStorage();
    updateBadges();
    renderCars();
    openCompareModal();
}

// ===================================================
// Avtokredit Kalkulyatori
// ===================================================

function initLoanCalculator() {
    const priceInput = document.getElementById('calcPriceInput');
    const downRange = document.getElementById('calcDownRange');
    const termSelect = document.getElementById('calcTermSelect');
    const rateInput = document.getElementById('calcRateInput');

    const updateCalc = () => {
        const price = parseFloat(priceInput.value) || 25000;
        const downPercent = parseInt(downRange.value);
        const termMonths = parseInt(termSelect.value);
        const annualRate = parseFloat(rateInput.value) || 23;

        document.getElementById('calcDownPercentLabel').textContent = downPercent + '%';
        const downAmount = Math.round((price * downPercent) / 100);
        document.getElementById('calcDownAmountLabel').textContent = Number(downAmount).toLocaleString();
        document.getElementById('calcDownSumResult').textContent = '$' + Number(downAmount).toLocaleString();

        const loanAmount = price - downAmount;
        document.getElementById('calcLoanSumResult').textContent = '$' + Number(loanAmount).toLocaleString();

        const monthlyRate = (annualRate / 100) / 12;
        let monthlyPay = 0;
        if (monthlyRate > 0) {
            monthlyPay = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
        } else {
            monthlyPay = loanAmount / termMonths;
        }

        const totalPay = monthlyPay * termMonths;
        const totalInterest = totalPay - loanAmount;

        document.getElementById('calcMonthlyResult').textContent = '$' + Math.round(monthlyPay).toLocaleString();
        document.getElementById('calcMonthlyUZS').textContent = '≈ ' + Math.round(monthlyPay * USD_TO_UZS).toLocaleString('uz-UZ') + ' UZS';
        document.getElementById('calcTotalInterestResult').textContent = '$' + Math.round(totalInterest).toLocaleString();
        document.getElementById('calcTotalPaymentResult').textContent = '$' + Math.round(totalPay + downAmount).toLocaleString();
    };

    [priceInput, downRange, termSelect, rateInput].forEach(el => {
        el.addEventListener('input', updateCalc);
        el.addEventListener('change', updateCalc);
    });

    updateCalc();
}

// ===================================================
// Toast Bildirishnomalar
// ===================================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'warning' ? 'toast-warning' : ''}`;

    let iconSvg = '';
    if (type === 'success') {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === 'warning') {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    } else {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `
        ${iconSvg}
        <span style="font-size: 13px; font-weight: 500;">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
