// AVTO BOZOR PRO - Mashinalar bazasi
const INITIAL_CARS = [
    {
        id: "car-1",
        title: "Chevrolet Malibu 2 Premier",
        brand: "Chevrolet",
        model: "Malibu 2",
        year: 2023,
        price: 28500,
        mileage: 18000,
        fuel: "Benzin",
        transmission: "Avtomat",
        engine: "2.0 Turbo (253 o.k.)",
        bodyType: "Sedan",
        color: "Qora (Black)",
        city: "Toshkent",
        paintCondition: "Toza (Kraska yo'q)",
        isNew: false,
        featured: true,
        images: [
            "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"
        ],
        seller: {
            name: "Sardor Rahimov",
            phone: "+998 90 123 45 67",
            telegram: "sardor_auto",
            type: "Egasi"
        },
        description: "Chevrolet Malibu 2 Premier 2.0 Turbo. Holati a'lo darajada, faqat 95-benzin quyilgan. Kraskasi 100% toza. Panorama tom, charm salon, o'rindiqlarni shamollatish va isitish tizimi. Hujjatlari joyida, sotishga tayyor.",
        features: ["Panorama tom", "Charm salon", "Bose audiotizim", "360 kamera", "Kruiz-kontrol", "Bezprovodnoy zaryadka", "O'rindiq isitish/sovutish"]
    },
    {
        id: "car-2",
        title: "BYD Song Plus Champion EV",
        brand: "BYD",
        model: "Song Plus",
        year: 2024,
        price: 26800,
        mileage: 4500,
        fuel: "Elektr",
        transmission: "Avtomat",
        engine: "Elektromotor (605 km zaxira)",
        bodyType: "Krossover / SUV",
        color: "Kulrang (Grey)",
        city: "Toshkent",
        paintCondition: "Toza (Kraska yo'q)",
        isNew: true,
        featured: true,
        images: [
            "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
        ],
        seller: {
            name: "Avto Premium Saloni",
            phone: "+998 97 777 88 99",
            telegram: "autopremium_uz",
            type: "Diler / Salon"
        },
        description: "BYD Song Plus EV Champion Edition 2024. Bir quvvat bilan 605 km masofa. Ingliz tili dasturi o'rnatilgan, sim-karta faollashtirilgan. 7 kW zaryadlash stansiyasi va poliklar sovg'a!",
        features: ["605 km quvvat zaxirasi", "DiLink aylanuvchi ekran", "Panorama lyuk", "Dynaudio akustika", "Avtoparkovka", "L2 avtopilot"]
    },
    {
        id: "car-3",
        title: "Chevrolet Tracker 2 Premier",
        brand: "Chevrolet",
        model: "Tracker",
        year: 2023,
        price: 18200,
        mileage: 22000,
        fuel: "Benzin",
        transmission: "Avtomat",
        engine: "1.2 Turbo (132 o.k.)",
        bodyType: "Krossover / SUV",
        color: "Oq (White)",
        city: "Samarqand",
        paintCondition: "Toza",
        isNew: false,
        featured: false,
        images: [
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"
        ],
        seller: {
            name: "Jamshid Aliyev",
            phone: "+998 93 456 78 90",
            telegram: "jamshid_car",
            type: "Egasi"
        },
        description: "Tracker 2 Premier, to'liq komplektatsiya. Qizil chokli qora salon, orqa kamera, lyuk, start-stop tizimi. Minishga tayyor, rasxodi yo'q. Kredit yoki lizingga ham kelishiladi.",
        features: ["Panoramali lyuk", "Start/Stop", "Sensorli ekran", "Orqa kamera", "Apple CarPlay", "Klimat-kontrol"]
    },
    {
        id: "car-4",
        title: "Kia K5 GT-Line",
        brand: "Kia",
        model: "K5",
        year: 2023,
        price: 31900,
        mileage: 12000,
        fuel: "Benzin",
        transmission: "Avtomat",
        engine: "2.5 MPI (194 o.k.)",
        bodyType: "Sedan",
        color: "Oq marvarid (Pearl White)",
        city: "Toshkent",
        paintCondition: "Toza (Kraska yo'q)",
        isNew: false,
        featured: true,
        images: [
            "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80"
        ],
        seller: {
            name: "Kia Rasmiy Markazi",
            phone: "+998 71 200 00 22",
            telegram: "kia_uzbekistan",
            type: "Rasmiy diler"
        },
        description: "Kia K5 GT-Line eng yuqori jihozlangan versiya. Sportiv bamperlar, qizil charm salon, 18 dyuymli qora yengil qotishmali disklar. Kafolati bor (5 yil yoki 150 000 km).",
        features: ["Sport paket GT-Line", "Harman/Kardon audio", "Head-up display", "Proyeksion chiroqlar", "360 daraja kamera", "Kruiz nazorati"]
    },
    {
        id: "car-5",
        title: "Chevrolet Gentra (Lacetti) Elegant Plus",
        brand: "Chevrolet",
        model: "Gentra",
        year: 2022,
        price: 12700,
        mileage: 48000,
        fuel: "Benzin / Gaz (Metan)",
        transmission: "Avtomat",
        engine: "1.5 DOHC (107 o.k.)",
        bodyType: "Sedan",
        color: "Kumushrang (GAN Silver)",
        city: "Farg'ona",
        paintCondition: "Petno bor (O'ng orqa krilo)",
        isNew: false,
        featured: false,
        images: [
            "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
        ],
        seller: {
            name: "Otabek Qodirov",
            phone: "+998 90 987 65 43",
            telegram: "otabek_auto77",
            type: "Egasi"
        },
        description: "Gentra 3-pozitsiya avtomat. 4-avlod italyan metan gaz o'rnatilgan (100 litr ballon). Magicar 906 signalizatsiya, 7D polik, yaxshi chexol taqilgan. Moy va antifriz yangi almashtirildi.",
        features: ["Metan 4-avlod", "Magicar pult", "Lyuk", "Konditsioner", "ABS tormoz", "Elektr oynalar"]
    },
    {
        id: "car-6",
        title: "Chevrolet Onix Premier 2",
        brand: "Chevrolet",
        model: "Onix",
        year: 2024,
        price: 15300,
        mileage: 6000,
        fuel: "Benzin",
        transmission: "Avtomat",
        engine: "1.2 Turbo (132 o.k.)",
        bodyType: "Sedan",
        color: "Qora (Black)",
        city: "Namangan",
        paintCondition: "Toza (Kraska yo'q)",
        isNew: false,
        featured: false,
        images: [
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
        ],
        seller: {
            name: "Bobur Mirzayev",
            phone: "+998 91 321 00 11",
            telegram: "bobur_onix",
            type: "Egasi"
        },
        description: "Yangi Onix Premier 2. Yarim avtomat parkovka (o'zi parkovka qiladi), yon ko'rinmas hudud datchiklari, barcha o'rindiqlarda isitgich bor. Xarid qilishga ajoyib tejamkor mashina.",
        features: ["Yarim avtomatik parkovka", "Ko'r zona datchigi", "Wireless zaryadlash", "Klimat kontrol", "ESP tizimi"]
    },
    {
        id: "car-7",
        title: "BMW 530i M Sport (G30)",
        brand: "BMW",
        model: "5 Series",
        year: 2021,
        price: 49000,
        mileage: 39000,
        fuel: "Benzin",
        transmission: "Avtomat",
        engine: "2.0 TwinPower Turbo (252 o.k.)",
        bodyType: "Sedan",
        color: "Ko'k metalik (Phytonic Blue)",
        city: "Toshkent",
        paintCondition: "Toza (Kraska yo'q)",
        isNew: false,
        featured: true,
        images: [
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1200&q=80"
        ],
        seller: {
            name: "Elite Motors",
            phone: "+998 99 888 00 11",
            telegram: "elite_motors_uz",
            type: "Diler / Salon"
        },
        description: "BMW 530i M Sport paket. Original M tormoz tizimi, Laser LED optika, Harman Kardon audiosistema, adaptiv podveska. Mashinaga keramika va bron plyonka tortilgan.",
        features: ["M Sport paket", "BMW Laserlight", "Harman Kardon", "Adaptiv kruiz", "Comfort access", "Dovodchik eshiklar"]
    },
    {
        id: "car-8",
        title: "Li Auto L7 Max",
        brand: "Li Auto",
        model: "L7",
        year: 2024,
        price: 46500,
        mileage: 2100,
        fuel: "Gibrid (EREV)",
        transmission: "Avtomat",
        engine: "Gibrid (1315 km umumiy zaxira)",
        bodyType: "Krossover / SUV",
        color: "Oltin kumush (Silver Gold)",
        city: "Toshkent",
        paintCondition: "Toza",
        isNew: true,
        featured: true,
        images: [
            "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80"
        ],
        seller: {
            name: "Navoiy Auto Trade",
            phone: "+998 78 150 55 55",
            telegram: "navoiy_autotrade",
            type: "Diler / Salon"
        },
        description: "Premium toifadagi aqlli krossover Li Auto L7 Max. Pnevmatik osma (podveska), orqa yo'lovchilar uchun shaxsiy TV ekran, muzlatgich, o'rindiq massajlari. Master account beriladi.",
        features: ["Pnevmopodveska", "O'rindiq massaji", "Muzlatgich", "3 ta OLED ekran", "Dolby Atmos 7.3.4", "Avtonom boshqaruv"]
    },
    {
        id: "car-9",
        title: "Hyundai Sonata 2.5 Smartstream",
        brand: "Hyundai",
        model: "Sonata",
        year: 2022,
        price: 24900,
        mileage: 31000,
        fuel: "Benzin",
        transmission: "Avtomat",
        engine: "2.5 MPi (180 o.k.)",
        bodyType: "Sedan",
        color: "To'q kulrang (Dark Grey)",
        city: "Buxoro",
        paintCondition: "Toza",
        isNew: false,
        featured: false,
        images: [
            "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
        ],
        seller: {
            name: "Sherzod Narzullayev",
            phone: "+998 97 123 99 88",
            telegram: "sherzod_buxoro",
            type: "Egasi"
        },
        description: "Hyundai Sonata Style komplektatsiyasi. Zamonaviy dizayn, juda qulay va keng salon. Shahar ichida 9 litr, trassada 6.5 litr sarflaydi. Yangi g'ildiraklar qo'yilgan.",
        features: ["Panorama tom", "Kamera 360", "Elektron priborka", "Drive Mode", "LED faralar", "Simsiz zaryadka"]
    }
];

const USD_TO_UZS = 12800; // Valyuta kursi
