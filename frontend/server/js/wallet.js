fetch('/frontend/server/components/wallet_management/main.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('mainContent').innerHTML = html;
        loadWallets();
    });

fetch('/frontend/server/components/wallet_management/view.html')
    .then(r => r.text())
    .then(html => document.getElementById('popupContainer').innerHTML = html);

fetch('/frontend/server/components/wallet_management/edit.html')
    .then(r => r.text())
    .then(html => document.getElementById('editPopupContainer').innerHTML = html);

let currentWallet = null;

function loadWallets() {
    fetch('/api/wallets')
        .then(r => r.json())
        .then(wallets => {
            const tbody = document.querySelector('tbody');
            tbody.innerHTML = wallets.map(wallet => {
                return `
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm font-semibold">#${wallet.id}</td>
                        <td class="px-6 py-4 text-sm">${wallet.userId}</td>
                        <td class="px-6 py-4 text-sm font-semibold text-green-600">$${wallet.balance}</td>
                        <td class="px-6 py-4 text-sm">$${wallet.availableCredit}</td>
                        <td class="px-6 py-4 text-sm text-red-600">$${wallet.totalBorrowed}</td>
                        <td class="px-6 py-4 text-sm text-blue-600">$${wallet.totalRepaid}</td>
                        <td class="px-6 py-4">
                            <div class="flex gap-2">
                                <button onclick="openWalletPopup(${wallet.id})" class="text-blue-600 hover:text-blue-800">👁️</button>
                                <button onclick="openEditWalletPopup(${wallet.id})" class="text-yellow-600 hover:text-yellow-800">✏️</button>
                                <button onclick="deleteWallet(${wallet.id})" class="text-red-600 hover:text-red-800">🗑️</button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        });
}

window.openWalletPopup = function(id) {
    fetch(`/api/wallets/${id}`)
        .then(r => r.json())
        .then(wallet => {
            currentWallet = wallet;

            document.getElementById('walletPopupId').textContent = `#${wallet.id}`;
            document.getElementById('walletPopupUserId').textContent = `User: ${wallet.userId}`;
            document.getElementById('walletPopupBalance').textContent = `$${wallet.balance}`;
            document.getElementById('walletPopupCredit').textContent = `$${wallet.availableCredit}`;
            document.getElementById('walletPopupBorrowed').textContent = `$${wallet.totalBorrowed}`;
            document.getElementById('walletPopupRepaid').textContent = `$${wallet.totalRepaid}`;

            document.getElementById('walletPopup').classList.remove('hidden');
        });
}

window.closeWalletPopup = function() {
    document.getElementById('walletPopup').classList.add('hidden');
}

window.openEditWalletPopup = function(id) {
    fetch(`/api/wallets/${id}`)
        .then(r => r.json())
        .then(wallet => {
            currentWallet = wallet;

            document.getElementById('editWalletId').value = wallet.id;
            document.getElementById('editWalletUserId').value = wallet.userId;
            document.getElementById('editWalletBalance').value = wallet.balance;
            document.getElementById('editWalletCredit').value = wallet.availableCredit;
            document.getElementById('editWalletBorrowed').value = wallet.totalBorrowed;
            document.getElementById('editWalletRepaid').value = wallet.totalRepaid;

            document.getElementById('editWalletPopup').classList.remove('hidden');
        });
}

window.closeEditWalletPopup = function() {
    document.getElementById('editWalletPopup').classList.add('hidden');
}

window.saveWalletEdit = function() {
    const id = currentWallet.id;
    const data = {
        userId: currentWallet.userId,
        balance: document.getElementById('editWalletBalance').value,
        availableCredit: document.getElementById('editWalletCredit').value,
        totalBorrowed: document.getElementById('editWalletBorrowed').value,
        totalRepaid: document.getElementById('editWalletRepaid').value
    };

    fetch(`/api/wallets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(() => {
        closeEditWalletPopup();
        loadWallets();
        alert('Wallet updated successfully!');
    });
}

window.deleteWallet = function(id) {
    if (confirm('Are you sure you want to delete this wallet?')) {
        fetch(`/api/wallets/${id}`, {
            method: 'DELETE'
        }).then(() => {
            loadWallets();
            alert('Wallet deleted successfully!');
        });
    }
}