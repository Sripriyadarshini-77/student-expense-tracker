let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let budget = Number(localStorage.getItem("budget")) || 0;
let income = Number(localStorage.getItem("income")) || 0;
function addExpense() {

    const name = document.getElementById("expenseName").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    if (name === "" || amount === "" || category === "" || date === "") {
        alert("Please fill all fields!");
        return;
    }
    if (Number(amount) <= 0) {
    alert("Amount must be greater than 0!");
    return;
}
const today = new Date().toISOString().split("T")[0];

if (date > today) {
    alert("Expense date cannot be in the future!");
    return;
}

    const expense = {
        name: name,
        amount: Number(amount),
        category: category,
        date: date
    };

    expenses.push(expense);

    saveExpenses();
    displayExpenses();
    clearForm();
}


function displayExpenses() {

    const expenseList = document.getElementById("expenseList");

    const searchText =
        document.getElementById("search").value.toLowerCase();

    const selectedCategory =
        document.getElementById("filterCategory").value;
        const selectedMonth =
    document.getElementById("filterMonth").value;

    expenseList.innerHTML = "";

    let total = 0;
    let visibleExpenses = 0;

    expenses.forEach((expense, index) => {

        const matchesSearch =
            expense.name.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            expense.category === selectedCategory;
            const matchesMonth =
    selectedMonth === "" ||
    expense.date.startsWith(selectedMonth);

        if (matchesSearch && matchesCategory && matchesMonth) {
            visibleExpenses++;
            total += expense.amount;

            const div = document.createElement("div");

            div.className = "expense";

            div.innerHTML = `
    <div class="expense-details">

        <div class="expense-title">
            <strong>${expense.name}</strong>
            <span class="category-badge">
                ${expense.category}
            </span>
        </div>

        <p class="expense-date">
            📅 ${expense.date}
        </p>

    </div>

    <div class="expense-actions">

        <strong class="expense-amount">
            ₹${expense.amount}
        </strong>

        <button
            class="edit-btn"
            onclick="editExpense(${index})">
            Edit
        </button>

        <button
            class="delete-btn"
            onclick="deleteExpense(${index})">
            Delete
        </button>

    </div>
`;
            

            expenseList.appendChild(div);
        }
    });
    if (visibleExpenses === 0) {
    expenseList.innerHTML = `
        <div class="empty-state">
            <div>🧾</div>
            <h3>No expenses found</h3>
            <p>Add an expense or change your filters.</p>
        </div>
    `;
}

    document.getElementById("total").textContent = total;
    updateSummary();
    updateChart();
    updateBudget();
    updateMoneySummary();
}

function editExpense(index) {

    const expense = expenses[index];

    document.getElementById("expenseName").value = expense.name;
    document.getElementById("amount").value = expense.amount;
    document.getElementById("category").value = expense.category;
    document.getElementById("date").value = expense.date;

    expenses.splice(index, 1);

    saveExpenses();
    displayExpenses();
}


function deleteExpense(index) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this expense?"
    );

    if (confirmDelete) {

        expenses.splice(index, 1);

        saveExpenses();
        displayExpenses();
    }
}


function saveExpenses() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );
}


function clearForm() {

    document.getElementById("expenseName").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";
    document.getElementById("date").value = "";
}


displayExpenses();
function updateSummary() {

    let food = 0;
    let travel = 0;
    let education = 0;
    let shopping = 0;

    expenses.forEach((expense) => {

        if (expense.category === "Food") {
            food += expense.amount;
        }

        if (expense.category === "Travel") {
            travel += expense.amount;
        }

        if (expense.category === "Education") {
            education += expense.amount;
        }

        if (expense.category === "Shopping") {
            shopping += expense.amount;
        }

    });

    document.getElementById("foodTotal").textContent = food;

    document.getElementById("travelTotal").textContent = travel;

    document.getElementById("educationTotal").textContent = education;

    document.getElementById("shoppingTotal").textContent = shopping;
}


let expenseChart = null;

function updateChart() {

    const chartBox = document.querySelector(".chart-box");

    if (!chartBox) {
        return;
    }

    let food = 0;
    let travel = 0;
    let education = 0;
    let shopping = 0;
    let other = 0;

    expenses.forEach(function(expense) {

        if (expense.category === "Food") {
            food += Number(expense.amount);
        }

        else if (expense.category === "Travel") {
            travel += Number(expense.amount);
        }

        else if (expense.category === "Education") {
            education += Number(expense.amount);
        }

        else if (expense.category === "Shopping") {
            shopping += Number(expense.amount);
        }

        else {
            other += Number(expense.amount);
        }
    });

    const data = [
        ["Food", food],
        ["Travel", travel],
        ["Education", education],
        ["Shopping", shopping],
        ["Other", other]
    ];

    const maxAmount = Math.max(...data.map(item => item[1]), 1);

    chartBox.innerHTML = `
        <h2>Expense Summary</h2>

        <div class="bar-chart">

            ${data.map(item => `
                <div class="bar-item">

                    <div class="bar-label">
                        <span>${item[0]}</span>
                        <strong>₹${item[1]}</strong>
                    </div>

                    <div class="bar-background">
                        <div
                            class="bar-fill"
                            style="width: ${(item[1] / maxAmount) * 100}%">
                        </div>
                    </div>

                </div>
            `).join("")}

        </div>
    `;
}
function setBudget() {

    const budgetInput = document.getElementById("budget").value;

    if (budgetInput === "" || Number(budgetInput) <= 0) {
        alert("Please enter a valid budget!");
        return;
    }

    budget = Number(budgetInput);

    localStorage.setItem("budget", budget);

    updateBudget();

    document.getElementById("budget").value = "";
}


function updateBudget() {

    let totalSpent = 0;

    expenses.forEach(function(expense) {
        totalSpent += Number(expense.amount);
    });

    const remaining = budget - totalSpent;

    document.getElementById("budgetAmount").textContent = budget;

    document.getElementById("spentAmount").textContent = totalSpent;

    document.getElementById("remainingAmount").textContent =
        remaining >= 0 ? remaining : 0;

    const message = document.getElementById("budgetMessage");

    if (budget === 0) {

        message.textContent = "Set your monthly budget.";

    } else if (remaining < 0) {

        message.textContent =
            "⚠️ Budget exceeded by ₹" + Math.abs(remaining);

    } else {

        message.textContent =
            "You have ₹" + remaining + " remaining.";

    }
}
function addIncome() {

    const incomeInput =
        document.getElementById("income").value;

    if (incomeInput === "" || Number(incomeInput) <= 0) {
        alert("Please enter a valid income!");
        return;
    }

    income += Number(incomeInput);

    localStorage.setItem("income", income);

    updateMoneySummary();

    document.getElementById("income").value = "";
}


function updateMoneySummary() {

    let totalExpenses = 0;

    expenses.forEach(function(expense) {
        totalExpenses += Number(expense.amount);
    });

    const balance = income - totalExpenses;

    document.getElementById("incomeAmount").textContent =
        income;

    document.getElementById("expenseAmount").textContent =
        totalExpenses;

    document.getElementById("balanceAmount").textContent =
        balance;
        document.getElementById("quickIncome").textContent = income;
document.getElementById("quickExpense").textContent = totalExpenses;
document.getElementById("quickBalance").textContent = balance;
document.getElementById("quickEntries").textContent = expenses.length;
}
function clearAllData() {

    const confirmClear = confirm(
        "Are you sure you want to clear all your data?"
    );

    if (!confirmClear) {
        return;
    }

    expenses = [];
    income = 0;
    budget = 0;

    localStorage.removeItem("expenses");
    localStorage.removeItem("income");
    localStorage.removeItem("budget");

    displayExpenses();
    updateSummary();
    updateChart();
    updateBudget();
    updateMoneySummary();

    alert("All data has been cleared!");

}
function exportCSV() {

    if (expenses.length === 0) {
        alert("No expenses available to export!");
        return;
    }

    let csv = "Expense Name,Amount,Category,Date\n";

    expenses.forEach(function(expense) {

        csv += `"${expense.name}",`;
        csv += `"${expense.amount}",`;
        csv += `"${expense.category}",`;
        csv += `"${expense.date}"\n`;

    });

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "student-expenses.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}