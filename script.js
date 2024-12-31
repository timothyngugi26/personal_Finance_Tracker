document.addEventListener('DOMContentLoaded', () => {
    let entries = JSON.parse(localStorage.getItem('entries')) || [];

    // Update the summary and chart
    updateSummary();
    updateChart();

    // Handle form submission
    document.getElementById('finance-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;
        const type = document.getElementById('type').value;

        const entry = { amount, category, date, type };

        entries.push(entry);

        localStorage.setItem('entries', JSON.stringify(entries));

        updateSummary();
        updateChart();

        document.getElementById('finance-form').reset();
    });

    // Update the total income, expenses, and balance
    function updateSummary() {
        let totalIncome = 0;
        let totalExpenses = 0;

        entries.forEach(entry => {
            if (entry.type === 'income') {
                totalIncome += entry.amount;
            } else if (entry.type === 'expense') {
                totalExpenses += entry.amount;
            }
        });

        const balance = totalIncome - totalExpenses;

        document.getElementById('total-income').textContent = totalIncome;
        document.getElementById('total-expenses').textContent = totalExpenses;
        document.getElementById('balance').textContent = balance;
    }

    // Update the chart with income vs expenses data
    function updateChart() {
        const income = entries.filter(entry => entry.type === 'income').reduce((total, entry) => total + entry.amount, 0);
        const expenses = entries.filter(entry => entry.type === 'expense').reduce((total, entry) => total + entry.amount, 0);

        const ctx = document.getElementById('finance-chart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Income', 'Expenses'],
                datasets: [{
                    data: [income, expenses],
                    backgroundColor: ['green', 'red']
                }]
            }
        });
    }

    // Display entries in a list (optional)
    function displayEntries() {
        const entryList = document.getElementById('entry-list');
        entryList.innerHTML = '';
        entries.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.date} - ${entry.category} - ${entry.amount} (${entry.type})`;
            entryList.appendChild(li);
        });
    }

    displayEntries();
});
