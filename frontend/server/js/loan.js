fetch('/frontend/server/components/loan_management/main.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('mainContent').innerHTML = html;
        loadLoans();
    });

fetch('/frontend/server/components/loan_management/view.html')
    .then(r => r.text())
    .then(html => document.getElementById('popupContainer').innerHTML = html);

fetch('/frontend/server/components/loan_management/edit.html')
    .then(r => r.text())
    .then(html => document.getElementById('editPopupContainer').innerHTML = html);

fetch('/frontend/server/components/loan_management/new.html')
    .then(r => r.text())
    .then(html => document.getElementById('newContainer').innerHTML = html);


function loadLoans() {
    fetch('/api/loans')
        .then(r => r.json())
        .then(loans => {
            const tbody = document.querySelector('tbody');
            tbody.innerHTML = loans.map(loan => `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm">#${loan.id}</td>
                    <td class="px-6 py-4 text-sm">${loan.userId}</td>
                    <td class="px-6 py-4 text-sm">${loan.loanType}</td>
                    <td class="px-6 py-4 text-sm font-semibold">$${loan.loanAmount}</td>
                    <td class="px-6 py-4">
                        <span class="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">${loan.status}</span>
                    </td>
                    <td class="px-6 py-4 text-sm">${loan.startDate || 'N/A'}</td>
                    <td class="px-6 py-4">
                        <div class="flex gap-2">
                            <button onclick="openLoanPopup(${loan.id})" class="text-blue-600 hover:text-blue-800">👁️</button>
                            <button onclick="openEditLoanPopup(${loan.id})" class="text-yellow-600 hover:text-yellow-800">✏️</button>
                            <button onclick="deleteLoan(${loan.id})" class="text-red-600 hover:text-red-800">🗑️</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        });
}


window.openLoanPopup = function(id) {
    fetch(`/api/loans/${id}`)
        .then(r => r.json())
        .then(loan => {
            document.getElementById('loanPopupId').textContent = `#${loan.id}`;
            document.getElementById('loanPopupUserId').textContent = loan.userId || 'N/A';
            document.getElementById('loanPopupType').textContent = loan.loanType || 'N/A';
            document.getElementById('loanPopupAmount').textContent = `$${loan.loanAmount || 0}`;
            document.getElementById('loanPopupInterest').textContent = `${loan.interestRate || 0}%`;
            document.getElementById('loanPopupTerm').textContent = `${loan.loanTermMonths || 0} months`;
            document.getElementById('loanPopupStatus').textContent = loan.status || 'N/A';
            document.getElementById('loanPopupStartDate').textContent = loan.startDate || 'N/A';
            document.getElementById('loanPopupEndDate').textContent = loan.endDate || 'N/A';
            document.getElementById('loanPopupMonthly').textContent = `$${loan.monthlyPayment || 0}`;
            document.getElementById('loanPopupPurpose').textContent = loan.purpose || 'N/A';
            document.getElementById('loanPopup').classList.remove('hidden');
        });
}

window.closeLoanPopup = function() {
    document.getElementById('loanPopup').classList.add('hidden');
}


window.openEditLoanPopup = function(id) {
    fetch(`/api/loans/${id}`)
        .then(r => r.json())
        .then(loan => {
            document.getElementById('editLoanPopupId').textContent = `#${loan.id}`;
            document.getElementById('editLoanUserId').value = loan.userId || '';
            document.getElementById('editLoanType').value = loan.loanType || '';
            document.getElementById('editLoanAmount').value = loan.loanAmount || '';
            document.getElementById('editLoanInterest').value = loan.interestRate || '';
            document.getElementById('editLoanTerm').value = loan.loanTermMonths || '';
            document.getElementById('editLoanStatus').value = loan.status || '';
            document.getElementById('editLoanStartDate').value = loan.startDate || '';
            document.getElementById('editLoanEndDate').value = loan.endDate || '';
            document.getElementById('editLoanPurpose').value = loan.purpose || '';
            document.getElementById('editLoanPopup').dataset.id = id;
            document.getElementById('editLoanPopup').classList.remove('hidden');
        });
}

window.closeEditLoanPopup = function() {
    document.getElementById('editLoanPopup').classList.add('hidden');
}

window.saveLoanChanges = function() {
    const id = document.getElementById('editLoanPopup').dataset.id;
    const data = {
        userId: document.getElementById('editLoanUserId').value,
        loanType: document.getElementById('editLoanType').value,
        loanAmount: document.getElementById('editLoanAmount').value,
        interestRate: document.getElementById('editLoanInterest').value,
        loanTermMonths: document.getElementById('editLoanTerm').value,
        status: document.getElementById('editLoanStatus').value,
        startDate: document.getElementById('editLoanStartDate').value,
        endDate: document.getElementById('editLoanEndDate').value,
        purpose: document.getElementById('editLoanPurpose').value
    };
    fetch(`/api/loans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(() => {
        closeEditLoanPopup();
        loadLoans();
        alert('Loan updated successfully!');
    });
}


window.openNewLoanPopup = function() {
    document.getElementById('newLoanForm').reset();
    document.getElementById('newLoanStartDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('newLoanStatus').value = 'Pending';
    document.getElementById('newLoanPopup').classList.remove('hidden');
}

window.closeNewLoanPopup = function() {
    document.getElementById('newLoanPopup').classList.add('hidden');
}

window.createNewLoan = function() {
    const data = {
        userId: document.getElementById('newLoanUserId').value,
        loanType: document.getElementById('newLoanType').value,
        loanAmount: document.getElementById('newLoanAmount').value,
        interestRate: document.getElementById('newLoanInterest').value,
        loanTermMonths: document.getElementById('newLoanTerm').value,
        status: document.getElementById('newLoanStatus').value,
        startDate: document.getElementById('newLoanStartDate').value,
        endDate: document.getElementById('newLoanEndDate').value,
        purpose: document.getElementById('newLoanPurpose').value
    };
    fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(() => {
        closeNewLoanPopup();
        loadLoans();
        alert('Loan created successfully!');
    });
}


window.deleteLoan = function(id) {
    if (confirm('Are you sure you want to delete this loan?')) {
        fetch(`/api/loans/${id}`, { method: 'DELETE' })
            .then(() => {
                loadLoans();
                alert('Loan deleted successfully!');
            });
    }
}