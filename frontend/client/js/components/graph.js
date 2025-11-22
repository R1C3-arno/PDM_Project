fetch('http://localhost:8080/api/forecast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        loanAmount: 50000,
        interestRate: 10,
        loanTermMonths: 60
    })
})
    .then(r => r.json())
    .then(data => {
        const ctx = document.getElementById('forecastChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.years,
                datasets: [
                    {
                        label: 'Principal Paid',
                        data: data.principal,
                        backgroundColor: 'rgba(196, 181, 253, 0.8)',
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Interest Paid',
                        data: data.interest,
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Rent',
                        data: data.rent,
                        type: 'line',
                        borderColor: 'rgb(99,165,255)',
                        yAxisID: 'y'
                    }
                ]
            }
        });
    });