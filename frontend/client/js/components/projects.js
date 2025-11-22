// projects.js - Plain JavaScript (no modules)

const projectsData = [
    {
        title: "Delux",
        range: "$12,500,000",
        credit: "10,000",
        interest: "5%",
        image: "/frontend/client/assets/images/main/project_img_1.jpg"
    },
    {
        title: "Bussiness",
        range: "$2,500,000",
        credit: "5,000",
        interest: "8%",
        image: "/frontend/client/assets/images/main/project_img_2.jpg"
    },
    {
        title: "Kickstarter",
        range: "$500,000",
        credit: "500",
        interest: "10%",
        image: "/frontend/client/assets/images/main/project_img_3.jpg"
    },
    {
        title: "Delux",
        range: "$12,500,000",
        credit: "10,000",
        interest: "5%",
        image: "/frontend/client/assets/images/main/project_img_1.jpg"
    },
    {
        title: "Bussiness",
        range: "$2,500,000",
        credit: "5,000",
        interest: "8%",
        image: "/frontend/client/assets/images/main/project_img_2.jpg"
    },
    {
        title: "Kickstarter",
        range: "$500,000",
        credit: "500",
        interest: "10%",
        image: "/frontend/client/assets/images/main/project_img_3.jpg"
    },
];

let currentIndex = 0;
let cardsToShow = 1;

function updateCardsToShow() {
    if (window.innerWidth >= 1024) {
        cardsToShow = projectsData.length;
    } else {
        cardsToShow = 1;
    }
}

function renderProjects() {
    const projectSlider = document.getElementById('projectSlider');
    if (!projectSlider) {
        console.error('projectSlider not found');
        return;
    }

    projectSlider.innerHTML = '';

    projectsData.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'relative flex-shrink-0 w-full sm:w-1/4';
        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="w-full h-auto mb-14"/>
            <div class="absolute left-0 right-0 bottom-5 flex justify-center">
                <div class="inline-block bg-white w-3/4 px-4 py-2 shadow-md">
                    <h2 class="text-xl font-semibold text-gray-800">${project.title}</h2>
                    <p class="text-gray-500 text-sm">
                        ${project.range} <span class="mx-2">|</span> ${project.interest}
                        <span class="mx-2">|</span> ${project.credit}
                    </p>
                </div>
            </div>
        `;
        projectSlider.appendChild(projectCard);
    });

    console.log(`✓ Rendered ${projectsData.length} projects`);
}

function updateSlider() {
    const projectSlider = document.getElementById('projectSlider');
    if (!projectSlider) return;

    projectSlider.style.transform = `translateX(-${(currentIndex * 100) / cardsToShow}%)`;
}

function initProjects() {
    console.log('Initializing projects component...');

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!prevBtn || !nextBtn) {
        console.error('Navigation buttons not found');
        return;
    }

    updateCardsToShow();
    renderProjects();

    prevBtn.addEventListener('click', () => {
        currentIndex = currentIndex === 0 ? projectsData.length - 1 : currentIndex - 1;
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % projectsData.length;
        updateSlider();
    });

    window.addEventListener('resize', () => {
        updateCardsToShow();
        updateSlider();
    });

    console.log('✓ Projects component initialized');
}

// Initialize when DOM is ready or when component is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjects);
} else {
    // DOM already loaded
    initProjects();
}

// Also listen for custom event from main.js
document.addEventListener('componentsLoaded', () => {
    if (document.getElementById('projectSlider')) {
        initProjects();
    }
});