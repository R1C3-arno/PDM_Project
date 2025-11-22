fetch('/frontend/server/components/loan_management/main.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('mainContent').innerHTML = html;
        loadLoans(); // Load danh sách loans sau khi render HTML
    });

fetch('/frontend/server/components/loan_management/view.html')
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


// Load danh sách loans từ API
function loadLoans() {
    fetch('/api/loans')
        .then(r => r.json())
        .then(loans => {
            const tbody = document.querySelector('#loansTable tbody'); // Giả sử bạn có table với id="loansTable"
            tbody.innerHTML = '';
            loans.forEach(loan => {
                const row = `
                    <tr>
                        <td>${loan.id}</td>
                        <td>${loan.userId}</td>
                        <td>${loan.type}</td>
                        <td>$${loan.amount}</td>
                        <td>${loan.interest}%</td>
                        <td>${loan.term} months</td>
                        <td>${loan.status}</td>
                        <td>${loan.startDate}</td>
                        <td>${loan.endDate}</td>
                        <td>
                            <button onclick="openLoanPopup(${loan.id})">View</button>
                            <button onclick="openEditLoanPopup(${loan.id})">Edit</button>
                            <button onclick="deleteLoan(${loan.id})">Delete</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        });
}


// View Loan
function openLoanPopup(loanId) {
    fetch(`/api/loans/${loanId}`)
        .then(r => r.json())
        .then(loan => {
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
        });
}

function closeLoanPopup() {
    document.getElementById('loanPopup').classList.add('hidden');
}


// Edit Loan
function openEditLoanPopup(loanId) {
    fetch(`/api/loans/${loanId}`)
        .then(r => r.json())
        .then(loan => {
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

            document.getElementById('editLoanPopup').dataset.loanId = loanId;
            document.getElementById('editLoanPopup').classList.remove('hidden');
        });
}

function closeEditLoanPopup() {
    document.getElementById('editLoanPopup').classList.add('hidden');
}

function saveLoanChanges() {
    const loanId = document.getElementById('editLoanPopup').dataset.loanId;
    const updatedLoan = {
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
    fetch(`/api/loans/${loanId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedLoan)
    }).then(() => {
        closeEditLoanPopup();
        loadLoans(); // Reload danh sách sau khi edit
    });
}


// New Loan
function openNewLoanPopup() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('newLoanForm').reset();
    document.getElementById('newLoanStartDate').value = today;
    document.getElementById('newLoanStatus').value = 'Pending';
    document.getElementById('newLoanPopup').classList.remove('hidden');
}

function closeNewLoanPopup() {
    document.getElementById('newLoanPopup').classList.add('hidden');
}

function createNewLoan() {
    const newLoan = {
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
    fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLoan)
    }).then(() => {
        closeNewLoanPopup();
        loadLoans(); // Reload danh sách sau khi thêm mới
    });
}

// Delete Loan
function deleteLoan(loanId) {
    if (confirm('Xóa loan này?')) {
        fetch(`/api/loans/${loanId}`, {
            method: 'DELETE'
        }).then(() => loadLoans());
    }
}