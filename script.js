document.addEventListener('DOMContentLoaded', () => {
    let entries = JSON.parse(localStorage.getItem('entries')) || [];

    // Initial update
    updateSummary();
    updateChart();
    displayEntries();

    // Handle form submission
    document.getElementById('finance-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;
        const type = document.getElementById('type').value;

        const entry = { amount, category, date, type };
        entries.push(entry);

        saveAndRefresh();
        document.getElementById('finance-form').reset();
    });

    // Clear all entries
    document.getElementById('clear-all').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all entries?')) {
            entries = [];
            saveAndRefresh();
        }
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

        document.getElementById('total-income').textContent = totalIncome.toFixed(2);
        document.getElementById('total-expenses').textContent = totalExpenses.toFixed(2);
        document.getElementById('balance').textContent = balance.toFixed(2);
    }

    // Update the chart with income vs expenses data
    function updateChart() {
        const income = entries.filter(entry => entry.type === 'income').reduce((total, entry) => total + entry.amount, 0);
        const expenses = entries.filter(entry => entry.type === 'expense').reduce((total, entry) => total + entry.amount, 0);

        const ctx = document.getElementById('finance-chart').getContext('2d');
        new Chart(ctx, {
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

    // Display entries in separate lists
    function displayEntries() {
        const incomeList = document.getElementById('income-list');
        const expenseList = document.getElementById('expense-list');

        incomeList.innerHTML = '';
        expenseList.innerHTML = '';

        entries.forEach((entry, index) => {
            const li = document.createElement('li');
            li.textContent = `${entry.date} - ${entry.category} - ${entry.amount.toFixed(2)}`;
            
            // Add a delete button for each entry
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.style.marginLeft = '10px';
            deleteBtn.addEventListener('click', () => {
                deleteEntry(index);
            });

            li.appendChild(deleteBtn);

            if (entry.type === 'income') {
                incomeList.appendChild(li);
            } else if (entry.type === 'expense') {
                expenseList.appendChild(li);
            }
        });
    }

    // Delete an entry by index
    function deleteEntry(index) {
        entries.splice(index, 1); // Remove the entry at the given index
        saveAndRefresh();
    }

    // Save to localStorage and refresh the UI
    function saveAndRefresh() {
        localStorage.setItem('entries', JSON.stringify(entries));
        updateSummary();
        updateChart();
        displayEntries();
    }
});

