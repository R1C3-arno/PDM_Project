const startYear = 2022;
const years = 31;
const labels = [];

for (let i = 0; i < years; i++) {
    labels.push(startYear + i);
}

const principalData = [];
const interestData = [];
const rentData = [];

for (let i = 0; i < years; i++) {

    principalData.push(1000 + (i * 80) + Math.random() * 200);

    interestData.push(800 + (i * 70) + Math.random() * 150);

    rentData.push(1500 + (i * 150));
}

const ctx = document.getElementById('forecastChart').getContext('2d');
const forecastChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Principal Paid',
                data: principalData,
                backgroundColor: 'rgba(196, 181, 253, 0.8)',
                yAxisID: 'y1',
                barPercentage: 0.7,
                categoryPercentage: 0.6,
            },
            {
                label: 'Interest Paid',
                data: interestData,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                yAxisID: 'y1',
                barPercentage: 0.7,
                categoryPercentage: 0.6,
            },
            {
                label: 'Rent',
                data: rentData,
                type: 'line',
                borderColor: 'rgb(99,165,255)',
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 0,
                yAxisID: 'y',
            }
        ]

    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: true,
                    color: 'rgba(229, 231, 235, 0.5)'
                },
                ticks: {
                    font: {
                        size: 11
                    },
                    maxRotation: 0,
                    autoSkip: true,
                    autoSkipPadding: 20
                }
            },
            y: {
                stacked: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Rent',
                    font: {
                        size: 13,
                        weight: 'normal'
                    }
                },
                grid: {
                    display: true,
                    color: 'rgba(229, 231, 235, 0.5)'
                },
                ticks: {
                    callback: function(value) {
                        return '$' + (value / 1000).toFixed(0) + 'K';
                    }
                }
            },
            y1: {
                position: 'right',
                title: {
                    display: true,
                    text: 'Loan Principal',
                    font: {
                        size: 13,
                        weight: 'normal'
                    }
                },
                grid: {
                    display: false
                },
                ticks: {
                    callback: function(value) {
                        return '$' + (value / 1000).toFixed(0) + 'K';
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 13
                },
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += '$' + context.parsed.y.toLocaleString();
                        return label;
                    }
                }
            }
        }
    }
});