fetch('/frontend/server/components/transaction_management/main.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('mainContent').innerHTML = html;
        loadTransactions();
    });

fetch('/frontend/server/components/transaction_management/view.html')
    .then(r => r.text())
    .then(html => document.getElementById('popupContainer').innerHTML = html);

fetch('/frontend/server/components/transaction_management/print.html')
    .then(r => r.text())
    .then(html => document.getElementById('editPopupContainer').innerHTML = html);

fetch('/frontend/server/components/transaction_management/new.html')
    .then(r => r.text())
    .then(html => document.getElementById('newContainer').innerHTML = html);


let currentTransaction = null;


function loadTransactions() {
    fetch('/api/transactions')
        .then(r => r.json())
        .then(transactions => {
            const tbody = document.querySelector('tbody');
            tbody.innerHTML = transactions.map(tx => {
                const typeColors = {
                    'Payment': 'bg-blue-100 text-blue-600',
                    'Disbursement': 'bg-purple-100 text-purple-600',
                    'Refund': 'bg-orange-100 text-orange-600',
                    'Fee': 'bg-gray-100 text-gray-600'
                };
                const statusColors = {
                    'Completed': 'bg-green-100 text-green-600',
                    'Pending': 'bg-yellow-100 text-yellow-600',
                    'Failed': 'bg-red-100 text-red-600'
                };

                return `
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm font-semibold">#${tx.id}</td>
                        <td class="px-6 py-4 text-sm">${tx.userId}</td>
                        <td class="px-6 py-4 text-sm">${tx.loanId}</td>
                        <td class="px-6 py-4">
                            <span class="px-3 py-1 text-xs rounded-full ${typeColors[tx.transactionType] || 'bg-gray-100 text-gray-600'}">${tx.transactionType}</span>
                        </td>
                        <td class="px-6 py-4 text-sm font-semibold text-green-600">$${tx.amount}</td>
                        <td class="px-6 py-4">
                            <span class="px-3 py-1 text-xs rounded-full ${statusColors[tx.status] || 'bg-gray-100 text-gray-600'}">${tx.status}</span>
                        </td>
                        <td class="px-6 py-4 text-sm">${tx.transactionDate || 'N/A'}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">${tx.referenceNumber || 'N/A'}</td>
                        <td class="px-6 py-4">
                            <div class="flex gap-2">
                                <button onclick="openTransactionPopup(${tx.id})" class="text-blue-600 hover:text-blue-800">👁️</button>
                                <button onclick="openPrintTransactionPopup(${tx.id})" class="text-purple-600 hover:text-purple-800">🖨️</button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        });
}


window.openTransactionPopup = function(id) {
    fetch(`/api/transactions/${id}`)
        .then(r => r.json())
        .then(tx => {
            currentTransaction = tx;

            const typeColors = {
                'Payment': 'bg-blue-100 text-blue-600',
                'Disbursement': 'bg-purple-100 text-purple-600',
                'Refund': 'bg-orange-100 text-orange-600',
                'Fee': 'bg-gray-100 text-gray-600'
            };
            const statusColors = {
                'Completed': 'bg-green-100 text-green-600',
                'Pending': 'bg-yellow-100 text-yellow-600',
                'Failed': 'bg-red-100 text-red-600'
            };

            document.getElementById('txPopupId').textContent = `#${tx.id}`;
            document.getElementById('txPopupReference').textContent = tx.referenceNumber || 'N/A';
            document.getElementById('txPopupUserId').textContent = tx.userId;
            document.getElementById('txPopupLoanId').textContent = tx.loanId;
            document.getElementById('txPopupAmount').textContent = `$${tx.amount}`;
            document.getElementById('txPopupDate').textContent = tx.transactionDate || 'N/A';
            document.getElementById('txPopupDescription').textContent = tx.description || 'N/A';

            const typeEl = document.getElementById('txPopupType');
            typeEl.textContent = tx.transactionType;
            typeEl.className = `px-3 py-1 text-xs rounded-full ${typeColors[tx.transactionType] || 'bg-gray-100 text-gray-600'}`;

            const statusEl = document.getElementById('txPopupStatus');
            statusEl.textContent = tx.status;
            statusEl.className = `px-3 py-1 text-xs rounded-full ${statusColors[tx.status] || 'bg-gray-100 text-gray-600'}`;

            document.getElementById('transactionPopup').classList.remove('hidden');
        });
}

window.closeTransactionPopup = function() {
    document.getElementById('transactionPopup').classList.add('hidden');
}


window.openPrintTransactionPopup = function(id) {
    fetch(`/api/transactions/${id}`)
        .then(r => r.json())
        .then(tx => {
            document.getElementById('printTxId').textContent = `#${tx.id}`;
            document.getElementById('printTxReference').textContent = tx.referenceNumber || 'N/A';
            document.getElementById('printTxUserId').textContent = tx.userId;
            document.getElementById('printTxLoanId').textContent = tx.loanId;
            document.getElementById('printTxType').textContent = tx.transactionType;
            document.getElementById('printTxStatus').textContent = tx.status;
            document.getElementById('printTxDate').textContent = tx.transactionDate || 'N/A';
            document.getElementById('printTxAmount').textContent = `$${tx.amount}`;

            const today = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            document.getElementById('printCurrentDate').textContent = today;

            document.getElementById('printTransactionPopup').classList.remove('hidden');
        });
}

window.closePrintTransactionPopup = function() {
    document.getElementById('printTransactionPopup').classList.add('hidden');
}

window.openPrintFromView = function() {
    if (currentTransaction) {
        closeTransactionPopup();
        openPrintTransactionPopup(currentTransaction.id);
    }
}

window.printReceipt = function() {
    const content = document.getElementById('receiptContent').innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Print Receipt</title>');
    printWindow.document.write('<style>body{font-family:Arial;padding:20px;} .border-b{border-bottom:1px solid #ddd;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}


window.openNewTransactionPopup = function() {
    document.getElementById('newTransactionForm').reset();
    document.getElementById('newTxStatus').value = 'Pending';
    document.getElementById('newTransactionPopup').classList.remove('hidden');
}

window.closeNewTransactionPopup = function() {
    document.getElementById('newTransactionPopup').classList.add('hidden');
}

window.createNewTransaction = function() {
    const data = {
        userId: document.getElementById('newTxUserId').value,
        loanId: document.getElementById('newTxLoanId').value,
        transactionType: document.getElementById('newTxType').value,
        amount: document.getElementById('newTxAmount').value,
        status: document.getElementById('newTxStatus').value,
        referenceNumber: document.getElementById('newTxReference').value,
        description: document.getElementById('newTxDescription').value
    };

    fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(() => {
        closeNewTransactionPopup();
        loadTransactions();
        alert('Transaction created successfully!');
    });
}
