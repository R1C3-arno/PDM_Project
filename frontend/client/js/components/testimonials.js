const testimonialsData = [
    {
        name: "Đào Hữu Hoài",
        title: "Full-stack Developer",
        image: '/frontend/client/assets/images/main/unknown.png',
        alt: "Đào Hữu Hoài",
        rating: 5,
        text: "Làm việc có trách nhiệm, đóng góp quan trọng cho cả frontend và backend."
    },
    {
        name: "Lê Thành Danh (Leader)",
        title: "Full-stack Developer / Team Leader",
        image: '/frontend/client/assets/images/main/unknown.png',
        alt: "Lê Thành Danh",
        rating: 5,
        text: "Lãnh đạo nhóm hiệu quả, có tầm nhìn rõ ràng và hỗ trợ các thành viên tận tình."
    },
    {
        name: "Võ Quang Khải",
        title: "Report Writer",
        image: '/frontend/client/assets/images/main/unknown.png',
        alt: "Võ Quang Khải",
        rating: 4,
        text: "Cẩn thận trong trình bày báo cáo, đảm bảo tài liệu nhóm rõ ràng và mạch lạc."
    },
    {
        name: "Phan Minh Khánh",
        title: "ERD Designer",
        image: '/frontend/client/assets/images/main/unknown.png',
        alt: "Phan Minh Khánh",
        rating: 4,
        text: "Thiết kế ERD logic và tối ưu, giúp hệ thống có cấu trúc dữ liệu hợp lý."
    },
    {
        name: "Trần Châu Thanh Tuấn",
        title: "Report Writer",
        image: '/frontend/client/assets/images/main/unknown.png',
        alt: "Trần Châu Thanh Tuấn",
        rating: 4,
        text: "Đóng góp tích cực trong việc hoàn thiện báo cáo và chỉnh sửa tài liệu dự án."
    },
    {
        name: "Vũ Đức Nhân",
        title: "Backend Developer",
        image: '/frontend/client/assets/images/main/unknown.png',
        alt: "Vũ Đức Nhân",
        rating: 5,
        text: "Phát triển backend ổn định, tối ưu hiệu năng và bảo mật hệ thống."
    },
    {
        name: "Lê Hoàng Quốc Anh",
        title: "Frontend Developer",
        image: '/frontend/client/assets/images/main/unknown.png',
        alt: "Lê Hoàng Quốc Anh",
        rating: 5,
        text: "Xây dựng giao diện trực quan, tối ưu trải nghiệm người dùng và tương tác mượt mà."
    },
    {
        name: "Trương Minh Trí",
        title: "Frontend Developer",
        image: '/frontend/client/assets/images/main/unknown.png',
        alt: "Trương Minh Trí",
        rating: 4,
        text: "Hỗ trợ phát triển phần giao diện với thiết kế hiện đại và dễ dùng."
    },
    {
        name: "Hoàng Triệu Nam",
        title: "Report Writer",
        image: '/frontend/client/assets/images/main/unknown.png',
        alt: "Hoàng Triệu Nam",
        rating: 4,
        text: "Chịu trách nhiệm biên tập và rà soát tài liệu, giúp báo cáo hoàn thiện hơn."
    },
    {
        name: "Võ Trí Khôi",
        title: "Backend Developer",
        image: '/frontend/client/assets/images/main/unknown.png',
        alt: "Võ Trí Khôi",
        rating: 5,
        text: "Đảm nhận phần backend với khả năng xử lý logic chính xác và tối ưu."
    },
    {
        name: "Võ Nguyễn Đình Bảo",
        title: "ERD Designer",
        image: '/frontend/client/assets/images/main/unknown.png',
        alt: "Võ Nguyễn Đình Bảo",
        rating: 4,
        text: "Thiết kế cơ sở dữ liệu hợp lý, đảm bảo tính toàn vẹn và khả năng mở rộng."
    }
];

function renderTestimonials() {
    const testimonialsContainer = document.getElementById('testimonialsContainer');
    if (!testimonialsContainer) {
        console.error('testimonialsContainer not found');
        return;
    }

    testimonialsContainer.innerHTML = '';

    testimonialsData.forEach(testimonial => {
        const testimonialCard = document.createElement('div');
        testimonialCard.className = 'max-w-[340px] border shadow-lg rounded px-8 py-12 text-center';

        let starsHTML = '';
        for (let i = 0; i < testimonial.rating; i++) {
            starsHTML += '<img src="/frontend/client/assets/images/main/star_icon.png" alt="" class="w-4 h-4 object-contain"/>';
        }

        testimonialCard.innerHTML = `
            <img class="w-20 h-20 rounded-full mx-auto mb-4" src="${testimonial.image}" alt="${testimonial.alt}"/>
            <h2 class="font-semibold">${testimonial.name}</h2>
            <p class="text-gray-500 text-sm mb-2">${testimonial.title}</p>
            <div class="flex justify-center gap-1 text-red-500 mb-4">
                ${starsHTML}
            </div>
            <p class="text-gray-600">${testimonial.text}</p>
        `;
        testimonialsContainer.appendChild(testimonialCard);
    });

    console.log(`✓ Rendered ${testimonialsData.length} testimonials`);
}

function initTestimonials() {
    console.log('Initializing testimonials component...');
    renderTestimonials();
    console.log('✓ Testimonials component initialized');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestimonials);
} else {
    initTestimonials();
}

document.addEventListener('componentsLoaded', () => {
    if (document.getElementById('testimonialsContainer')) {
        initTestimonials();
    }
});