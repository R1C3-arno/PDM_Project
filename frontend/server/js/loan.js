fetch('/frontend/server/components/loan_management/main.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('mainContent').innerHTML = html;
    });

fetch('/frontend/server/components/loan_management/view.html')  // Đường dẫn tương đối
    .then(response => response.text())
    .then(html => {
        document.getElementById('popupContainer').innerHTML = html;
    });

fetch('/frontend/server/components/loan_management/edit.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('editPopupContainer').innerHTML = html;
    });

fetch('/frontend/server/components/loan_management/new.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('newContainer').innerHTML = html;
    });


// View Loan
function openLoanPopup(loanId) {
    const loans = {
        '001': {
            id: '#001',
            userId: 'U12345',
            type: 'Home Loan',
            amount: '$50,000',
            interest: '5.5%',
            term: '24 months',
            status: 'Active',
            startDate: 'Jan 15, 2025',
            endDate: 'Jan 15, 2027',
            monthly: '$2,200',
            purpose: 'Home renovation and expansion'
        },
        '002': {
            id: '#002',
            userId: 'U67890',
            type: 'Car Loan',
            amount: '$25,000',
            interest: '4.2%',
            term: '12 months',
            status: 'Pending',
            startDate: 'Jan 20, 2025',
            endDate: 'Jan 20, 2026',
            monthly: '$2,150',
            purpose: 'Purchase new vehicle'
        }
    };

    const loan = loans[loanId];
    document.getElementById('loanPopupId').textContent = loan.id;
    document.getElementById('loanPopupUserId').textContent = loan.userId;
    document.getElementById('loanPopupType').textContent = loan.type;
    document.getElementById('loanPopupAmount').textContent = loan.amount;
    document.getElementById('loanPopupInterest').textContent = loan.interest;
    document.getElementById('loanPopupTerm').textContent = loan.term;
    document.getElementById('loanPopupStatus').textContent = loan.status;
    document.getElementById('loanPopupStartDate').textContent = loan.startDate;
    document.getElementById('loanPopupEndDate').textContent = loan.endDate;
    document.getElementById('loanPopupMonthly').textContent = loan.monthly;
    document.getElementById('loanPopupPurpose').textContent = loan.purpose;

    document.getElementById('loanPopup').classList.remove('hidden');
}

function closeLoanPopup() {
    document.getElementById('loanPopup').classList.add('hidden');
}


// Edit Loan
function openEditLoanPopup(loanId) {
    const loans = {
        '001': {
            id: '#001',
            userId: 'U12345',
            type: 'Home Loan',
            amount: '50000',
            interest: '5.5',
            term: '24',
            status: 'Active',
            startDate: '2025-01-15',
            endDate: '2027-01-15',
            purpose: 'Home renovation and expansion'
        },
        '002': {
            id: '#002',
            userId: 'U67890',
            type: 'Car Loan',
            amount: '25000',
            interest: '4.2',
            term: '12',
            status: 'Pending',
            startDate: '2025-01-20',
            endDate: '2026-01-20',
            purpose: 'Purchase new vehicle'
        }
    };

    const loan = loans[loanId];

    // Set form values
    document.getElementById('editLoanPopupId').textContent = loan.id;
    document.getElementById('editLoanUserId').value = loan.userId;
    document.getElementById('editLoanType').value = loan.type;
    document.getElementById('editLoanAmount').value = loan.amount;
    document.getElementById('editLoanInterest').value = loan.interest;
    document.getElementById('editLoanTerm').value = loan.term;
    document.getElementById('editLoanStatus').value = loan.status;
    document.getElementById('editLoanStartDate').value = loan.startDate;
    document.getElementById('editLoanEndDate').value = loan.endDate;
    document.getElementById('editLoanPurpose').value = loan.purpose;

    // Store current loan ID for saving
    document.getElementById('editLoanPopup').dataset.loanId = loanId;
    document.getElementById('editLoanPopup').classList.remove('hidden');
}

function closeEditLoanPopup() {
    document.getElementById('editLoanPopup').classList.add('hidden');
}

function saveLoanChanges() {
    const loanId = document.getElementById('editLoanPopup').dataset.loanId;

    const updatedLoan = {
        id: document.getElementById('editLoanPopupId').textContent,
        userId: document.getElementById('editLoanUserId').value,
        type: document.getElementById('editLoanType').value,
        amount: document.getElementById('editLoanAmount').value,
        interest: document.getElementById('editLoanInterest').value,
        term: document.getElementById('editLoanTerm').value,
        status: document.getElementById('editLoanStatus').value,
        startDate: document.getElementById('editLoanStartDate').value,
        endDate: document.getElementById('editLoanEndDate').value,
        purpose: document.getElementById('editLoanPurpose').value
    };

    console.log('Saving loan:', updatedLoan);

    // TODO: Send to backend API
    alert('Loan updated successfully!');
    closeEditLoanPopup();
}

// New Loan
function openNewLoanPopup() {
    // Auto-generate new Loan ID
    const newId = '#' + String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    document.getElementById('newLoanId').value = newId;

    // Set default start date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('newLoanStartDate').value = today;

    // Reset form
    document.getElementById('newLoanForm').reset();
    document.getElementById('newLoanId').value = newId;
    document.getElementById('newLoanStartDate').value = today;
    document.getElementById('newLoanStatus').value = 'Pending';

    document.getElementById('newLoanPopup').classList.remove('hidden');
}

function closeNewLoanPopup() {
    document.getElementById('newLoanPopup').classList.add('hidden');
}

function createNewLoan() {
    // Get form values
    const newLoan = {
        id: document.getElementById('newLoanId').value,
        userId: document.getElementById('newLoanUserId').value,
        type: document.getElementById('newLoanType').value,
        amount: document.getElementById('newLoanAmount').value,
        interest: document.getElementById('newLoanInterest').value,
        term: document.getElementById('newLoanTerm').value,
        status: document.getElementById('newLoanStatus').value,
        startDate: document.getElementById('newLoanStartDate').value,
        endDate: document.getElementById('newLoanEndDate').value,
        purpose: document.getElementById('newLoanPurpose').value
    };

    // Validate required fields
    if (!newLoan.userId || !newLoan.type || !newLoan.amount || !newLoan.interest ||
        !newLoan.term || !newLoan.status || !newLoan.startDate || !newLoan.endDate) {
        alert('Please fill in all required fields!');
        return;
    }

    // Validate amount
    if (parseFloat(newLoan.amount) < 1000) {
        alert('Minimum loan amount is $1,000');
        return;
    }

    // Validate dates
    if (new Date(newLoan.endDate) <= new Date(newLoan.startDate)) {
        alert('End date must be after start date!');
        return;
    }

    console.log('Creating new loan:', newLoan);

    // TODO: Send to backend API
    alert('Loan created successfully!');
    closeNewLoanPopup();
}