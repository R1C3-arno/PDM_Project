let loanData = {
    loanAmount: 50000,
    interestRate: 10,
    loanTermMonths: 60,
    purpose: ''
};

const amountSlider = document.getElementById('loanAmount');
const amountInput = document.getElementById('loanAmountValue');
const interestSlider = document.getElementById('interestRate');
const interestInput = document.getElementById('interestRateValue');
const termSlider = document.getElementById('loanTerm');
const termInput = document.getElementById('loanTermValue');
const purposeInput = document.getElementById('purpose');

amountSlider.addEventListener('input', function() {
    loanData.loanAmount = parseFloat(this.value);
    amountInput.value = '$' + loanData.loanAmount.toLocaleString();
    calculate();
});

interestSlider.addEventListener('input', function() {
    loanData.interestRate = parseFloat(this.value);
    interestInput.value = loanData.interestRate + '%';
    calculate();
});

termSlider.addEventListener('input', function() {
    loanData.loanTermMonths = parseInt(this.value);
    termInput.value = loanData.loanTermMonths + ' Months';
    calculate();
});

purposeInput.addEventListener('input', function() {
    loanData.purpose = this.value;
});

function calculate() {
    const P = loanData.loanAmount;
    const r = loanData.interestRate / 100 / 12;
    const n = loanData.loanTermMonths;

    const monthlyPayment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = monthlyPayment * n;
    const interest = totalAmount - P;

    document.getElementById('displayLoanAmount').textContent = '$' + P.toLocaleString();
    document.getElementById('displayMonthlyPayment').textContent = '$' + monthlyPayment.toFixed(2);
    document.getElementById('displayTotalAmount').textContent = '$' + totalAmount.toFixed(2);
    document.getElementById('displayInterest').textContent = '$' + interest.toFixed(2);
}

window.resetCalculator = function() {
    loanData = { loanAmount: 50000, interestRate: 10, loanTermMonths: 60, purpose: '' };
    amountSlider.value = 50000;
    interestSlider.value = 10;
    termSlider.value = 60;
    purposeInput.value = '';
    calculate();
}

window.applyLoan = function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please login first!');
        window.location.href = '/client/pages/Authentication/index.html';
        return;
    }

    const P = loanData.loanAmount;
    const r = loanData.interestRate / 100 / 12;
    const n = loanData.loanTermMonths;
    const monthlyPayment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = monthlyPayment * n;

    const loan = {
        userId: user.id,
        loanType: 'personal',
        loanAmount: loanData.loanAmount,
        interestRate: loanData.interestRate,
        loanTermMonths: loanData.loanTermMonths,
        monthlyPayment: monthlyPayment,
        totalAmount: totalAmount,
        outstandingBalance: totalAmount,
        status: 'pending',
        purpose: loanData.purpose || 'Personal loan',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + loanData.loanTermMonths * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    fetch('http://localhost:8080/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loan)
    })
        .then(r => r.json())
        .then(data => {
            alert('Loan application submitted successfully!');
            window.location.href = '/client/pages/Main/index.html';
        });
}

calculate();