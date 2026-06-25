import { db } from './firebase.js';
import { doc, getDoc, setDoc } from "firebase/firestore";

export let siteData = {
    brand: {
        name: "ApexMCT",
        logoUrl: "", // Leave empty to use text + icon, or add an image URL
        heroBgOpacity: 30,
        bgColor: "#0f172a",
        themePreset: "default"
    },
    menus: [
        { id: 'company', link: '#company', ko: '회사소개', en: 'Company' },
        { id: 'products', link: '#products', ko: '제품소개', en: 'Products' },
        { id: 'equipment', link: '#equipment', ko: '설비현황', en: 'Equipment' },
        { id: 'clients', link: '#clients', ko: '주요고객사', en: 'Clients' },
        { id: 'location', link: '#location', ko: '오시는길', en: 'Location' }
    ],
    adminAccount: { id: "admin", pw: "admin1234" },
    company: {
        ceoMsg: {
            ko: "안녕하십니까.<br><br>당사는 설립 이래 끊임없는 기술 혁신과 철저한 품질 관리를 바탕으로, 프리미엄 정밀 가공 분야의 기준을 세워왔습니다.<br>글로벌 탑티어 고객사들이 요구하는 까다로운 스펙과 완벽한 마감을 구현하기 위해, 우리는 매 순간 한 치의 오차도 허용하지 않는 장인정신으로 임하고 있습니다.<br><br>고객의 신뢰를 최우선으로 생각하며, 최고의 품질과 정확한 납기로 성공적인 비즈니스 파트너가 될 것을 약속드립니다.",
            en: "Hello.<br><br>Since our establishment, we have set the standard in premium precision machining through continuous technological innovation and strict quality control.<br>To meet the demanding specifications and perfect finishes required by global top-tier clients, we work with uncompromising craftsmanship that allows no room for error.<br><br>Prioritizing your trust, we promise to be your successful business partner with the highest quality and precise delivery."
        },
        certs: [
            { id: 'c1', name: 'ISO 9001', detail: '품질경영시스템 인증', enDetail: 'Quality Management System', featured: true, img: '' },
            { id: 'c2', name: 'ISO 14001', detail: '환경경영시스템 인증', enDetail: 'Environmental Management System', featured: true, img: '' },
            { id: 'c3', name: '벤처기업인증', detail: '혁신성장유형', enDetail: 'Innovative Venture Company', featured: true, img: '' }
        ],
        vision: {
            img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&auto=format&fit=crop&q=80',
            ko: { title: '세계를 움직이는 정밀함의 기준', desc: '초정밀 가공 기술을 바탕으로 글로벌 산업의 발전을 이끌며, 미래 기술의 든든한 기반이 되겠습니다.' },
            en: { title: 'The Standard of Precision Moving the World', desc: 'Based on ultra-precision machining technology, we lead the development of global industries and become a solid foundation for future technologies.' }
        },
        coreValues: [
            { id: 'cv1', img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&auto=format&fit=crop&q=60', ko: { title: '완벽한 품질', desc: '마이크로 단위의 오차도 허용하지 않는 완벽주의' }, en: { title: 'Perfect Quality', desc: 'Perfectionism that does not allow micro-level errors' } },
            { id: 'cv2', img: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=500&auto=format&fit=crop&q=60', ko: { title: '기술 혁신', desc: '끊임없는 연구 개발을 통한 첨단 가공 기술 확보' }, en: { title: 'Tech Innovation', desc: 'Securing advanced machining tech through R&D' } },
            { id: 'cv3', img: 'https://images.unsplash.com/photo-1616422340798-8ec1f681a029?w=500&auto=format&fit=crop&q=60', ko: { title: '고객 신뢰', desc: '약속된 납기와 정확한 스펙으로 변함없는 신뢰 구축' }, en: { title: 'Client Trust', desc: 'Building trust with promised delivery and precise specs' } }
        ]
    },
    products: [
        { id: 'p1', img: 'https://images.unsplash.com/photo-1611077544789-7ebf4922f518?w=500&auto=format&fit=crop&q=60', featured: true, ko: { title: '반도체 챔버 및 핵심 부품', desc: '초정밀 공차가 요구되는 반도체 제조 설비용 진공 챔버 및 코어 파츠 가공' }, en: { title: 'Semiconductor Parts', desc: 'Vacuum chambers and core parts for semiconductor manufacturing' } },
        { id: 'p2', img: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b6?w=500&auto=format&fit=crop&q=60', featured: true, ko: { title: '항공우주 정밀 브라켓', desc: '경량화 및 고강도가 필수적인 항공우주 산업용 특수 합금 가공' }, en: { title: 'Aerospace Brackets', desc: 'Special alloy machining for aerospace applications' } },
        { id: 'p3', img: 'https://images.unsplash.com/photo-1579541591745-f0b12bc1d8ea?w=500&auto=format&fit=crop&q=60', featured: true, ko: { title: '의료기기 부품', desc: '생체 적합성 소재(티타늄 등)를 활용한 초정밀 의료기기 부품 가공' }, en: { title: 'Medical Device Parts', desc: 'Ultra-precision machining of biocompatible materials' } },
        { id: 'p4', img: 'https://images.unsplash.com/photo-1616422340798-8ec1f681a029?w=500&auto=format&fit=crop&q=60', featured: false, ko: { title: '산업용 자동화 설비 부품', desc: '고속 회전 및 마찰을 견디는 고내구성 산업용 자동화 설비 부품 가공' }, en: { title: 'Industrial Automation Parts', desc: 'Highly durable parts for industrial automation equipment' } },
        { id: 'p5', img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&auto=format&fit=crop&q=60', featured: false, ko: { title: '정밀 금형 코어', desc: '마이크로 단위의 정밀도를 자랑하는 특수 금형 코어 및 인서트 가공' }, en: { title: 'Precision Mold Cores', desc: 'Micro-precision special mold cores and inserts' } },
        { id: 'p6', img: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=500&auto=format&fit=crop&q=60', featured: false, ko: { title: '방산 기기 케이스', desc: '극한 환경 테스트를 통과한 방위산업용 내충격 케이스 가공' }, en: { title: 'Defense Equipment Cases', desc: 'Impact-resistant cases for defense industry' } },
    ],
    equipment: [
        { name: '5축 머시닝센터 (5-Axis MCT)', spec: 'DMU 50 (DMG MORI) - 2대', img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=500&auto=format&fit=crop&q=60', featured: true, ko: '복잡한 형상의 3D 곡면 및 동시 5축 가공용 최상급 설비', en: 'Top-tier equipment for complex 3D surfaces and simultaneous 5-axis machining' },
        { name: '고속 머시닝센터 (High-Speed MCT)', spec: 'NX 6500 (DN솔루션즈) - 5대', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=60', featured: true, ko: '초정밀 및 고속 가공을 통한 생산성 극대화', en: 'Maximizing productivity through ultra-precision and high-speed machining' },
        { name: 'CNC 선반', spec: 'PUMA 2600 (DN솔루션즈) - 3대', img: 'https://images.unsplash.com/photo-1535312015038-f99a80eeb7fa?w=500&auto=format&fit=crop&q=60', featured: true, ko: '터닝 및 밀링 복합 가공을 위한 다기능 CNC', en: 'Multi-functional CNC for combined turning and milling' },
        { name: '3차원 측정기 (CMM)', spec: 'CONTURA (ZEISS) - 1대', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&auto=format&fit=crop&q=60', featured: false, ko: '가공품의 마이크로 단위 정밀도 검증 및 품질 보증', en: 'Micro-level precision verification and quality assurance' }
    ],
    clients: [
        'GLOBAL TECH INC.', 'AEROSPACE DYNAMICS', 'PREMIUM INSTRUMENTS', 'KOREA SEMICON', 'NEXUS INNOVATION'
    ],
    inquiries: [],
    location: {
        ko: "대전 유성구 테크노2로 14-9 (관평동 1333)",
        en: "14-9, Techno 2-ro, Yuseong-gu, Daejeon (Gwanpyeong-dong 1333)"
    },
    contact: {
        phone: "042-931-3100",
        fax: "042-931-8100",
        email: "hyolee@future-eng.com",
        mapImage: ""
    },
    chatbotRules: [
        {
            keywords: ['견적', '단가', '비용', '가격', 'quote', 'price', 'cost', '비싸', '얼마'],
            ko: "견적 및 단가 문의는 홈페이지 하단의 '온라인 견적 문의' 폼을 이용해주시면 담당자가 확인 후 신속하게 답변해 드리겠습니다.",
            en: "For quotes and pricing, please use the 'Online Inquiry' form at the bottom of the homepage. Our representative will reply promptly."
        },
        {
            keywords: ['위치', '주소', '오시는길', '찾아가는길', 'location', 'address', 'map', '어디'],
            ko: "본사 및 공장 위치는 홈페이지 '오시는 길' 메뉴를 참조해 주세요. 카카오맵/구글맵으로 정확한 위치를 확인하실 수 있습니다.",
            en: "Please refer to the 'Location' menu on our homepage for the headquarters and factory address. You can check the exact location via Google Maps."
        },
        {
            keywords: ['인증', '품질', 'iso', 'certification', 'quality', '보증'],
            ko: "당사는 ISO 9001, 14001 등 글로벌 스탠다드 인증을 보유하고 있습니다. '인증 현황' 메뉴에서 자세한 확인이 가능합니다.",
            en: "We hold global standard certifications such as ISO 9001 and 14001. You can find more details in the 'Certifications' menu."
        },
        {
            keywords: ['장비', '설비', '기계', 'mct', '5축', 'equipment', 'machine', '보유'],
            ko: "당사는 최첨단 5축 가공기(DMU 50) 및 초정밀 장비를 다수 보유하고 있습니다. 상단의 '설비 현황' 메뉴를 통해 확인해 보세요.",
            en: "We are equipped with cutting-edge 5-axis machines (DMU 50) and ultra-precision equipment. Please check the 'Equipment' menu at the top."
        }
    ],
    i18n: {
        ko: {
            pageTitleMain: "정밀 가공의 새로운 기준",
            pageTitleProducts: "정밀 가공 포트폴리오",
            pageTitleEquipment: "주요 설비 현황",
            pageTitleCerts: "인증현황",
            pageTitleAdmin: "CMS Admin",
            heroBadge: "초정밀 가공의 새로운 기준",
            heroTitle: "<span class='gradient-text'>정밀함</span>이<br>예술이 되는 순간",
            heroDesc: "타협하지 않는 장인정신과 최첨단 MCT 기술. 세계 최고 수준을 요구하는 고객사의 완벽한 파트너가 됩니다.",
            btnConsult: "프로젝트 문의",
            btnExplore: "제품소개 보기",
            companySub: "회사소개",
            ceoTitle: "CEO 인사말",
            certTitle: "인증 현황",
            productSub: "제품소개",
            productTitle: "주요 생산 제품",
            equipSub: "설비현황",
            equipTitle: "최첨단 가공 인프라",
            productsSub: "제품소개",
            productsTitle: "정밀 가공 포트폴리오",
            productsViewAll: "모든 제품 보기",
            equipmentSub: "설비현황",
            equipmentTitle: "주요 보유 설비",
            equipmentViewAll: "모든 설비 보기",
            clientSub: "주요고객사",
            clientTitle: "신뢰로 맺어진 글로벌 파트너",
            contactSub: "문의하기",
            contactTitle: "최적의 가공 솔루션을 제안합니다",
            subProductsTitle: "정밀 가공 포트폴리오",
            subProductsDesc: "최고의 정밀도와 신뢰성을 바탕으로 완성한 당사의 모든 제품과 가공 사례를 확인하십시오.",
            subEquipmentTitle: "주요 보유 설비",
            subEquipmentDesc: "고객의 다양한 요구를 충족시키는 최첨단 초정밀 가공 장비를 소개합니다.",
            subCertsTitle: "품질 및 인증 현황",
            subCertsDesc: "글로벌 스탠다드를 충족하는 우리의 공식 인증 내역입니다.",
            footerCompany: "스마트팩토리",
            footerCEO: "이효리",
            footerBizNum: "123-45-67890",
            footerCopyright: "© 2026. All rights reserved.",
            locationSub: "오시는길",
            locationTitle: "본사 및 공장",
            mapDesc: "지도 API (Google Maps / Kakao Map) 연동 영역입니다.",
            ctaTitle: "당신의 다음 혁신을 함께합니다",
            ctaDesc: "엄격한 품질 기준을 요구하는 글로벌 기업들이 당사를 신뢰하는 이유를 직접 확인하십시오.",
            contactEmailLabel: "프로젝트 문의 및 도면 접수",
            contactPhoneLabel: "고객 지원 센터",
            chatTitle: "Apex AI 기술지원",
            chatStatus: "온라인",
            chatPlaceholder: "메시지를 입력하세요...",
            coreValuesTitle: "핵심가치",
            certViewDesc: "당사의 철저한 품질 보증 체계를 확인해보세요.",
            certViewAll: "모든 인증서 보기",
            companyViewAll: "회사소개 자세히 보기"
        },
        en: {
            pageTitleMain: "New Standard of Precision",
            pageTitleProducts: "Precision Machining Portfolio",
            pageTitleEquipment: "Main Equipment",
            pageTitleCerts: "Quality & Certifications",
            pageTitleAdmin: "CMS Admin",
            heroBadge: "New Standard of Precision",
            heroTitle: "Where <span class='gradient-text'>Precision</span><br>Becomes Art",
            heroDesc: "Uncompromising craftsmanship and cutting-edge MCT tech. The perfect partner for clients demanding world-class standards.",
            btnConsult: "Inquire Project",
            btnExplore: "View Products",
            companySub: "Company",
            ceoTitle: "CEO Message",
            certTitle: "Certifications",
            productsSub: "Products",
            productsTitle: "Precision Machining Portfolio",
            productsViewAll: "View All Products",
            equipmentSub: "Equipment",
            equipmentTitle: "Main Equipment",
            equipmentViewAll: "View All Equipment",
            clientSub: "Clients",
            clientTitle: "Global Partners Built on Trust",
            contactSub: "Contact",
            contactTitle: "Proposing Optimal Machining Solutions",
            subProductsTitle: "Precision Machining Portfolio",
            subProductsDesc: "Discover all our products and machining cases completed with top precision and reliability.",
            subEquipmentTitle: "Main Equipment",
            subEquipmentDesc: "Introducing cutting-edge ultra-precision machining equipment to meet our customers' diverse needs.",
            subCertsTitle: "Quality & Certifications",
            subCertsDesc: "Our official certifications meeting global standards.",
            footerCompany: "Apex Smart Factory",
            footerAddress: "123, Precision Industrial Complex-ro, Bucheon-si, Gyeonggi-do",
            footerContact: "Tel: +82-32-123-4567 | Email: contact@apex-mct.com",
            footerCopyright: "© 2026. All rights reserved.",
            locationSub: "Location",
            locationTitle: "HQ & Factory",
            mapDesc: "Map API (Google Maps / Kakao Map) Integration Area.",
            ctaTitle: "Partner in Your Next Innovation",
            ctaDesc: "Discover why global companies requiring strict quality standards trust us.",
            contactEmailLabel: "Project Inquiries & Blueprints",
            contactPhoneLabel: "Customer Support Center",
            chatTitle: "Apex AI Support",
            chatStatus: "Online",
            chatPlaceholder: "Type a message...",
            coreValuesTitle: "Core Values",
            certViewDesc: "Check out our thorough quality assurance system.",
            certViewAll: "View All Certifications",
            companyViewAll: "View Detailed Company Info"
        }
    }
};

export async function initFirebase() {
    try {
        const docRef = doc(db, "app", "siteData");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const firebaseData = docSnap.data();
            siteData = {
                ...siteData,
                ...firebaseData,
                brand: { ...siteData.brand, ...(firebaseData.brand || {}) },
                adminAccount: { ...siteData.adminAccount, ...(firebaseData.adminAccount || {}) },
                company: { ...siteData.company, ...(firebaseData.company || {}) },
                location: { ...siteData.location, ...(firebaseData.location || {}) },
                contact: { ...siteData.contact, ...(firebaseData.contact || {}) },
                inquiries: firebaseData.inquiries || [],
                i18n: {
                    ko: { ...siteData.i18n.ko, ...(firebaseData.i18n?.ko || {}) },
                    en: { ...siteData.i18n.en, ...(firebaseData.i18n?.en || {}) }
                }
            };
            console.log("Loaded data from Firebase.");
        } else {
            // Seed data to Firebase
            await setDoc(docRef, siteData);
            console.log("Seeded initial data to Firebase.");
        }
    } catch (error) {
        console.error("Error initializing Firebase data: ", error);
    }
}

export async function saveSiteDataToFirebase() {
    try {
        const docRef = doc(db, "app", "siteData");
        await setDoc(docRef, siteData);
    } catch (error) {
        console.error("Error saving siteData to Firebase: ", error);
        throw error;
    }
}

export const imageCache = {};

export async function loadFirebaseImages() {
    const imgs = document.querySelectorAll('.lazy-firebase-image');
    for (let img of imgs) {
        const imgId = img.getAttribute('data-img-id');
        if (imgId && imgId.startsWith('img_')) {
            if (imageCache[imgId]) {
                img.src = imageCache[imgId];
            } else {
                try {
                    const docRef = doc(db, "images", imgId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        imageCache[imgId] = docSnap.data().imageUrl;
                        img.src = imageCache[imgId];
                    }
                } catch(e) {
                    console.error("Failed to load image", imgId, e);
                }
            }
        } else if (imgId && imgId.startsWith('http')) {
            img.src = imgId;
        }
    }
}
