const savedLoan = JSON.parse(localStorage.getItem('loanApplication'));

if (savedLoan) {
    setTimeout(() => {
        const amountInput = document.querySelector('input[placeholder="$"]');
        if (amountInput) amountInput.value = '$' + savedLoan.loanAmount.toLocaleString();

        const durations = [12, 18, 24, 36, 48];
        const closest = durations.reduce((prev, curr) =>
            Math.abs(curr - savedLoan.loanTermMonths) < Math.abs(prev - savedLoan.loanTermMonths) ? curr : prev
        );

        document.querySelectorAll('input[name="duration"]').forEach((radio, index) => {
            if (durations[index] === closest) radio.checked = true;
        });

        const purposeField = document.getElementById('loanPurpose');
        if (purposeField && savedLoan.purpose) purposeField.value = savedLoan.purpose;
    }, 500);
}

window.goToStep = function(step) {
    document.getElementById('step1-content').classList.add('hidden');
    document.getElementById('step2-content').classList.add('hidden');
    document.getElementById('step3-content').classList.add('hidden');

    for (let i = 1; i <= 3; i++) {
        document.getElementById(`step${i}-icon`).className = 'step-icon inactive';
        document.getElementById(`step${i}-text`).className = 'step-text inactive';
    }

    document.getElementById(`step${step}-content`).classList.remove('hidden');
    document.getElementById(`step${step}-icon`).className = 'step-icon active';
    document.getElementById(`step${step}-text`).className = 'step-text active';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.loan-type-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.loan-type-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

let uploadedFiles = [];

document.getElementById('fileUpload')?.addEventListener('change', function(e) {
    uploadedFiles = Array.from(e.target.files);
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = uploadedFiles.map(f => `
        <div style="padding: 0.5rem; background: #f3f4f6; border-radius: 0.5rem; margin-bottom: 0.5rem;">
            <i class="fas fa-file"></i> ${f.name} (${(f.size / 1024).toFixed(2)} KB)
        </div>
    `).join('');
});

window.submitLoanApplication = function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please login first!');
        window.location.href = '/frontend/client/pages/Authentication/index.html';
        return;
    }

    const activeLoanType = document.querySelector('.loan-type-btn.active');
    const loanAmountDisplay = document.getElementById('loanAmountDisplay')?.value || '';
    const loanAmountValue = parseFloat(loanAmountDisplay.replace(/[$,]/g, '')) || 50000;

    const selectedDuration = document.querySelector('input[name="duration"]:checked');
    const loanTermMonths = selectedDuration ? parseInt(selectedDuration.value) : 60;

    const purpose = document.getElementById('loanPurpose')?.value || 'Personal loan';
    const phoneNumber = document.getElementById('phoneNumber')?.value;
    const address = document.getElementById('address')?.value;
    const agreeTerms = document.getElementById('agreeTerms')?.checked;

    if (!agreeTerms) {
        alert('Please agree to terms and conditions');
        return;
    }

    if (!activeLoanType) {
        alert('Please select a loan type');
        return;
    }

    if (!selectedDuration) {
        alert('Please select loan duration');
        return;
    }

    const savedLoan = JSON.parse(localStorage.getItem('loanApplication')) || {};
    const interestRate = savedLoan.interestRate || 10;
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = loanAmountValue * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
    const totalAmount = monthlyPayment * loanTermMonths;

    const fileNames = uploadedFiles.map(f => f.name).join(', ');
    const purposeText = purpose + (fileNames ? ' | Files: ' + fileNames : '');

    const loanApplication = {
        userId: user.id,
        loanType: activeLoanType.textContent.trim().toLowerCase().replace(/\s+/g, '_'),
        loanAmount: loanAmountValue,
        interestRate: interestRate,
        loanTermMonths: loanTermMonths,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        outstandingBalance: Math.round(totalAmount * 100) / 100,
        status: 'pending',
        purpose: purposeText,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + loanTermMonths * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    if (phoneNumber || address) {
        fetch(`http://localhost:8080/api/users/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: phoneNumber, address: address })
        });
    }

    fetch('http://localhost:8080/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loanApplication)
    })
        .then(r => r.json())
        .then(data => {
            localStorage.removeItem('loanApplication');
            alert('Loan application submitted successfully!');
            window.location.href = '/frontend/client/pages/Main/index.html';
        });
}