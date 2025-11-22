fetch('/frontend/server/components/transaction_management/main.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('mainContent').innerHTML = html;
    });

fetch('/frontend/server/components/transaction_management/view.html')  // Đường dẫn tương đối
    .then(response => response.text())
    .then(html => {
        document.getElementById('popupContainer').innerHTML = html;
    });

fetch('/frontend/server/components/transaction_management/print.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('editPopupContainer').innerHTML = html;
    });




function openTransactionPopup(txId) {
    const transactions = {
        'TX001': {
            id: '#TX001',
            userId: 'U12345',
            loanId: 'L001',
            type: 'Payment',
            amount: '$1,500',
            status: 'Completed',
            date: 'Jan 15, 2025',
            reference: 'REF20250115001'
        },
        'TX002': {
            id: '#TX002',
            userId: 'U12345',
            loanId: 'L001',
            type: 'Payment',
            amount: '$1,500',
            status: 'Completed',
            date: 'Jan 15, 2025',
            reference: 'REF20250115001'
        },
        'TX003': {
            id: '#TX003',
            userId: 'U12345',
            loanId: 'L001',
            type: 'Payment',
            amount: '$1,500',
            status: 'Completed',
            date: 'Jan 15, 2025',
            reference: 'REF20250115001'
        }
    };

    const tx = transactions[txId];
    document.getElementById('txPopupId').textContent = tx.id;
    document.getElementById('txPopupUserId').textContent = tx.userId;
    document.getElementById('txPopupLoanId').textContent = tx.loanId;
    document.getElementById('txPopupType').textContent = tx.type;
    document.getElementById('txPopupAmount').textContent = tx.amount;
    document.getElementById('txPopupStatus').textContent = tx.status;
    document.getElementById('txPopupDate').textContent = tx.date;
    document.getElementById('txPopupReference').textContent = tx.reference;

    document.getElementById('transactionPopup').classList.remove('hidden');
}

function closeTransactionPopup() {
    document.getElementById('transactionPopup').classList.add('hidden');
}


function openPrintTransactionPopup(txId) {
    const transactions = {
        'TX001': {
            id: '#TX001',
            userId: 'U12345',
            loanId: 'L001',
            type: 'Payment',
            amount: '$1,500',
            status: 'Completed',
            date: 'Jan 15, 2025',
            reference: 'REF20250115001'
        },
        'TX002': {
            id: '#TX002',
            userId: 'U12345',
            loanId: 'L001',
            type: 'Payment',
            amount: '$1,500',
            status: 'Completed',
            date: 'Jan 15, 2025',
            reference: 'REF20250115001'
        },
        'TX003': {
            id: '#TX003',
            userId: 'U12345',
            loanId: 'L001',
            type: 'Payment',
            amount: '$1,500',
            status: 'Completed',
            date: 'Jan 15, 2025',
            reference: 'REF20250115001'
        }
    };

    const tx = transactions[txId];

    // Fill data
    document.getElementById('printTxId').textContent = tx.id;
    document.getElementById('printTxReference').textContent = tx.reference;
    document.getElementById('printTxUserId').textContent = tx.userId;
    document.getElementById('printTxLoanId').textContent = tx.loanId;
    document.getElementById('printTxType').textContent = tx.type;
    document.getElementById('printTxStatus').textContent = tx.status;
    document.getElementById('printTxDate').textContent = tx.date;
    document.getElementById('printTxAmount').textContent = tx.amount;

    // Current date
    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('printCurrentDate').textContent = today;

    // Show popup
    document.getElementById('printTransactionPopup').classList.remove('hidden');
}

function closePrintTransactionPopup() {
    document.getElementById('printTransactionPopup').classList.add('hidden');
}

function printReceipt() {
    // Lấy nội dung receipt
    const content = document.getElementById('receiptContent').innerHTML;

    // Mở window mới để print
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Print Receipt</title>');
    printWindow.document.write('<style>body{font-family:Arial;padding:20px;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}