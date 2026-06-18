export const siteData = {
    menus: [
        { id: 'company', link: '#company', ko: '회사소개', en: 'Company' },
        { id: 'products', link: '#products', ko: '제품소개', en: 'Products' },
        { id: 'equipment', link: '#equipment', ko: '설비현황', en: 'Equipment' },
        { id: 'clients', link: '#clients', ko: '주요고객사', en: 'Clients' },
        { id: 'location', link: '#location', ko: '오시는길', en: 'Location' }
    ],
    company: {
        ceoMsg: {
            ko: "안녕하십니까, 에이펙스 MCT 대표입니다.<br><br>당사는 설립 이래 끊임없는 기술 혁신과 철저한 품질 관리를 바탕으로, 프리미엄 정밀 가공 분야의 기준을 세워왔습니다.<br>글로벌 탑티어 고객사들이 요구하는 까다로운 스펙과 완벽한 마감을 구현하기 위해, 우리는 매 순간 한 치의 오차도 허용하지 않는 장인정신으로 임하고 있습니다.<br><br>고객의 신뢰를 최우선으로 생각하며, 최고의 품질과 정확한 납기로 성공적인 비즈니스 파트너가 될 것을 약속드립니다.",
            en: "Hello, I am the CEO of Apex MCT.<br><br>Since our establishment, we have set the standard in premium precision machining through continuous technological innovation and strict quality control.<br>To meet the demanding specifications and perfect finishes required by global top-tier clients, we work with uncompromising craftsmanship that allows no room for error.<br><br>Prioritizing your trust, we promise to be your successful business partner with the highest quality and precise delivery."
        },
        certs: [
            { name: 'ISO 9001', detail: '품질경영시스템 인증', enDetail: 'Quality Management System' },
            { name: 'ISO 14001', detail: '환경경영시스템 인증', enDetail: 'Environmental Management System' },
            { name: '벤처기업인증', detail: '혁신성장유형', enDetail: 'Innovative Venture Company' }
        ]
    },
    products: [
        {
            img: 'ph-cpu',
            ko: { title: '반도체 장비 부품', desc: '초정밀 공차가 요구되는 반도체 설비용 진공 챔버 및 핵심 구조물.' },
            en: { title: 'Semiconductor Parts', desc: 'Vacuum chambers and core structures requiring ultra-precision tolerances.' }
        },
        {
            img: 'ph-airplane-tilt',
            ko: { title: '항공우주 부품', desc: '경량화 및 고강도가 필수적인 특수 합금(티타늄, 인코넬 등) 가공.' },
            en: { title: 'Aerospace Components', desc: 'Special alloy machining (Titanium, Inconel) where lightweight and high strength are essential.' }
        },
        {
            img: 'ph-guitar',
            ko: { title: '프리미엄 하드웨어', desc: '미려한 외관과 정교한 조립 공차가 필요한 하이엔드 악기 및 기구 부품.' },
            en: { title: 'Premium Hardware', desc: 'High-end instrument and device parts requiring flawless aesthetics and precise assembly tolerances.' }
        }
    ],
    equipment: [
        { name: 'Matsuura 5-Axis', spec: 'MAM72-35V (2대)', ko: '초정밀 5축 머시닝센터', en: '5-Axis Machining Center' },
        { name: 'DMG MORI', spec: 'DMU 50 (3대)', ko: '고속 5축 머시닝센터', en: 'High-speed 5-Axis Machining Center' },
        { name: 'Mazak', spec: 'VCN-530C (5대)', ko: '수직형 머시닝센터', en: 'Vertical Machining Center' },
        { name: 'Zeiss CMM', spec: 'CONTURA (1대)', ko: '3차원 측정기', en: 'Coordinate Measuring Machine' }
    ],
    clients: [
        'GLOBAL TECH INC.', 'AEROSPACE DYNAMICS', 'PREMIUM INSTRUMENTS', 'KOREA SEMICON', 'NEXUS INNOVATION'
    ],
    location: {
        ko: "경기도 부천시 정밀산업단지로 123, 에이펙스 스마트팩토리",
        en: "123, Precision Industrial Complex-ro, Bucheon-si, Gyeonggi-do, Apex Smart Factory"
    },
    i18n: {
        ko: {
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
            clientSub: "주요고객사",
            clientTitle: "신뢰로 맺어진 글로벌 파트너",
            locationSub: "오시는길",
            locationTitle: "에이펙스 MCT 본사 및 공장",
            mapDesc: "지도 API (Google Maps / Kakao Map) 연동 영역입니다.",
            ctaTitle: "당신의 다음 혁신을 함께합니다",
            ctaDesc: "엄격한 품질 기준을 요구하는 글로벌 기업들이 당사를 신뢰하는 이유를 직접 확인하십시오.",
            contactEmailLabel: "프로젝트 문의 및 도면 접수",
            contactPhoneLabel: "고객 지원 센터",
            footerAddress: "경기도 부천시 정밀산업단지로 123",
            chatTitle: "Apex AI 기술지원",
            chatStatus: "온라인",
            chatPlaceholder: "메시지를 입력하세요..."
        },
        en: {
            heroBadge: "New Standard of Precision",
            heroTitle: "Where <span class='gradient-text'>Precision</span><br>Becomes Art",
            heroDesc: "Uncompromising craftsmanship and cutting-edge MCT tech. The perfect partner for clients demanding world-class standards.",
            btnConsult: "Inquire Project",
            btnExplore: "View Products",
            companySub: "Company",
            ceoTitle: "CEO Greeting",
            certTitle: "Certifications",
            productSub: "Products",
            productTitle: "Major Products",
            equipSub: "Equipment",
            equipTitle: "Advanced Infrastructure",
            clientSub: "Major Clients",
            clientTitle: "Global Partners Bound by Trust",
            locationSub: "Location",
            locationTitle: "Apex MCT HQ & Factory",
            mapDesc: "Map API (Google Maps / Kakao Map) Integration Area.",
            ctaTitle: "Partner in Your Next Innovation",
            ctaDesc: "Discover why global companies requiring strict quality standards trust us.",
            contactEmailLabel: "Project Inquiries & Blueprints",
            contactPhoneLabel: "Customer Support Center",
            footerAddress: "123, Precision Industrial Complex-ro, Bucheon-si, Gyeonggi-do",
            chatTitle: "Apex AI Support",
            chatStatus: "Online",
            chatPlaceholder: "Type a message..."
        }
    }
};
