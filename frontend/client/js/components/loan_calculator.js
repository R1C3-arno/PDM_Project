let loanData = {
    term: 'yearly',
    amount: 50000,
    interestRate: 10,
    duration: 5,
    startDate: new Date().toISOString().split('T')[0]
};

const termButtons = document.querySelectorAll('.term-btn');
const amountSlider = document.querySelector('.slider-container:nth-child(2) .slider');
const amountInput = document.querySelector('.slider-container:nth-child(2) .input-value');
const interestSlider = document.querySelector('.input-group:nth-child(3) .slider');
const interestInput = document.querySelector('.input-group:nth-child(3) .input-value');
const durationSlider = document.querySelector('.input-group:nth-child(4) .slider');
const durationInput = document.querySelector('.input-group:nth-child(4) .input-value');
const startDateInput = document.querySelector('.date-input:first-child');
const endDateInput = document.querySelector('.date-input:last-child');


termButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        termButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const termText = this.textContent.toLowerCase();
        loanData.term = termText === 'yearly' ? 'yearly' : termText === 'monthly' ? 'monthly' : 'weekly';

        updateDurationLabel();
        calculateLoan();
    });
});

if (amountSlider && amountInput) {
    amountSlider.addEventListener('input', function() {
        loanData.amount = parseFloat(this.value);
        amountInput.value = formatCurrency(loanData.amount);
        calculateLoan();
    });

    amountInput.addEventListener('input', function() {
        const value = parseFloat(this.value.replace(/[^0-9.]/g, ''));
        if (!isNaN(value)) {
            loanData.amount = value;
            amountSlider.value = value;
            calculateLoan();
        }
    });

    amountInput.addEventListener('blur', function() {
        this.value = formatCurrency(loanData.amount);
    });
}


if (interestSlider && interestInput) {
    interestSlider.addEventListener('input', function() {
        loanData.interestRate = parseFloat(this.value);
        interestInput.value = loanData.interestRate.toFixed(1) + '%';
        calculateLoan();
    });

    interestInput.addEventListener('input', function() {
        const value = parseFloat(this.value.replace(/[^0-9.]/g, ''));
        if (!isNaN(value)) {
            loanData.interestRate = value;
            interestSlider.value = value;
            calculateLoan();
        }
    });

    interestInput.addEventListener('blur', function() {
        this.value = loanData.interestRate.toFixed(1) + '%';
    });
}


if (durationSlider && durationInput) {
    durationSlider.addEventListener('input', function() {
        loanData.duration = parseFloat(this.value);
        updateDurationLabel();
        calculateLoan();
    });

    durationInput.addEventListener('input', function() {
        const value = parseFloat(this.value.replace(/[^0-9]/g, ''));
        if (!isNaN(value)) {
            loanData.duration = value;
            durationSlider.value = value;
            calculateLoan();
        }
    });

    durationInput.addEventListener('blur', function() {
        updateDurationLabel();
    });
}


if (startDateInput) {
    startDateInput.addEventListener('change', function() {
        loanData.startDate = this.value;
        updateEndDate();
    });
}


function formatCurrency(value) {
    return '$' + value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function updateDurationLabel() {
    if (!durationInput) return;

    let unit = '';
    switch(loanData.term) {
        case 'yearly':
            unit = loanData.duration === 1 ? 'Year' : 'Years';
            break;
        case 'monthly':
            unit = loanData.duration === 1 ? 'Month' : 'Months';
            break;
        case 'weekly':
            unit = loanData.duration === 1 ? 'Week' : 'Weeks';
            break;
    }
    durationInput.value = loanData.duration + ' ' + unit;
}

function updateEndDate() {
    if (!endDateInput || !loanData.startDate) return;

    const start = new Date(loanData.startDate);
    let end = new Date(start);

    switch(loanData.term) {
        case 'yearly':
            end.setFullYear(start.getFullYear() + loanData.duration);
            break;
        case 'monthly':
            end.setMonth(start.getMonth() + loanData.duration);
            break;
        case 'weekly':
            end.setDate(start.getDate() + (loanData.duration * 7));
            break;
    }

    endDateInput.value = end.toISOString().split('T')[0];
}


function calculateLoan() {
    const principal = loanData.amount;
    const rate = loanData.interestRate / 100;
    let duration = loanData.duration;
    let periodsPerYear = 1;

    switch(loanData.term) {
        case 'yearly':
            duration = duration * 12;
            periodsPerYear = 1;
            break;
        case 'monthly':
            periodsPerYear = 12;
            break;
        case 'weekly':
            duration = duration * (12/52);
            periodsPerYear = 52;
            break;
    }

    const monthlyRate = rate / 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, duration)) /
        (Math.pow(1 + monthlyRate, duration) - 1);


    const totalPayment = emi * duration;
    const totalInterest = totalPayment - principal;


    updateResults(principal, totalPayment, totalInterest, emi, duration);
    updateChart(principal, totalInterest);
    updateEndDate();
}


function updateResults(principal, totalPayment, totalInterest, emi, durationInMonths) {

    const chartTotal = document.querySelector('.chart-total-value');
    if (chartTotal) {
        chartTotal.textContent = formatCurrency(totalPayment);
    }

    const summaryValues = document.querySelectorAll('.summary-value');
    if (summaryValues.length >= 4) {
        summaryValues[0].textContent = formatCurrency(totalPayment);
        summaryValues[1].textContent = formatCurrency(totalInterest);

        let durationText = '';
        switch(loanData.term) {
            case 'yearly':
                durationText = loanData.duration + (loanData.duration === 1 ? ' Year' : ' Years');
                break;
            case 'monthly':
                durationText = loanData.duration + (loanData.duration === 1 ? ' Month' : ' Months');
                break;
            case 'weekly':
                durationText = loanData.duration + (loanData.duration === 1 ? ' Week' : ' Weeks');
                break;
        }
        summaryValues[2].textContent = durationText;

        let emiText = formatCurrency(emi);
        switch(loanData.term) {
            case 'yearly':
                emiText += '/yr';
                break;
            case 'monthly':
                emiText += '/mo';
                break;
            case 'weekly':
                emiText += '/wk';
                break;
        }
        summaryValues[3].textContent = emiText;
    }
}

function updateChart(principal, interest) {
    const total = principal + interest;
    const principalPercent = (principal / total) * 100;
    const interestPercent = (interest / total) * 100;

    const circumference = 251;
    const principalLength = (principalPercent / 100) * circumference;
    const interestLength = (interestPercent / 100) * circumference;

    const circles = document.querySelectorAll('.circle-chart circle');
    if (circles.length >= 3) {
        circles[1].setAttribute('stroke-dasharray', `${principalLength} ${circumference}`);

        circles[2].setAttribute('stroke-dasharray', `${interestLength} ${circumference}`);
        circles[2].setAttribute('stroke-dashoffset', `-${principalLength}`);
    }
}

const applyBtn = document.querySelector('.btn-apply');
if (applyBtn) {
    applyBtn.addEventListener('click', function() {
        alert('Loan application submitted!\n\n' +
            'Amount: ' + formatCurrency(loanData.amount) + '\n' +
            'Interest Rate: ' + loanData.interestRate + '%\n' +
            'Duration: ' + loanData.duration + ' ' + loanData.term);
    });
}

function init() {
    if (amountSlider) amountSlider.value = loanData.amount;
    if (amountInput) amountInput.value = formatCurrency(loanData.amount);
    if (interestSlider) interestSlider.value = loanData.interestRate;
    if (interestInput) interestInput.value = loanData.interestRate.toFixed(1) + '%';
    if (durationSlider) durationSlider.value = loanData.duration;
    if (startDateInput) startDateInput.value = loanData.startDate;

    updateDurationLabel();
    calculateLoan();
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}