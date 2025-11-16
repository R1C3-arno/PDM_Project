fetch('/frontend/server/components/wallet_management/main.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('mainContent').innerHTML = html;
    });

fetch('/frontend/server/components/wallet_management/view.html')  // Đường dẫn tương đối
    .then(response => response.text())
    .then(html => {
        document.getElementById('popupContainer').innerHTML = html;
    });

fetch('/frontend/server/components/wallet_management/edit.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('editPopupContainer').innerHTML = html;
    });



function openWalletPopup(walletId) {
    // Lấy data (tạm dùng data cứng)
    const wallets = {
        'W001': {
            id: '#W001',
            userId: 'U12345',
            balance: '$5,000',
            credit: '$10,000',
            borrowed: '$50,000',
            repaid: '$30,000'
        },
        'W002': {
            id: '#W002',
            userId: 'U12345',
            balance: '$5,000',
            credit: '$10,000',
            borrowed: '$50,000',
            repaid: '$30,000'
        }
    };



    const wallet = wallets[walletId];
    document.getElementById('walletPopupId').textContent = wallet.id;
    document.getElementById('walletPopupUserId').textContent = 'User: ' + wallet.userId;
    document.getElementById('walletPopupBalance').textContent = wallet.balance;
    document.getElementById('walletPopupCredit').textContent = wallet.credit;
    document.getElementById('walletPopupBorrowed').textContent = wallet.borrowed;
    document.getElementById('walletPopupRepaid').textContent = wallet.repaid;

    document.getElementById('walletPopup').classList.remove('hidden');
}

function closeWalletPopup() {
    document.getElementById('walletPopup').classList.add('hidden');
}