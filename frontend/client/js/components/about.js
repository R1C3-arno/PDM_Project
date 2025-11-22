const statsData = [
    {
        number: "10+",
        label: "Years of Excellence"
    },
    {
        number: "12+",
        label: "Projects Completed"
    },
    {
        number: "20+",
        label: "Mn. Sq. Ft. Delivered"
    },
    {
        number: "25+",
        label: "Ongoing Projects"
    }
];

function renderStats() {
    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = '';

    statsData.forEach(stat => {
        const statDiv = document.createElement('div');
        statDiv.innerHTML = `
            <p class="text-4xl font-medium text-gray-800">${stat.number}</p>
            <p>${stat.label}</p>
        `;
        statsGrid.appendChild(statDiv);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('About component loaded');
    renderStats();
});