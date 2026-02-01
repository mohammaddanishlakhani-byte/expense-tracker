// ============================================
// EXPENSE TRACKER - WORKING VERSION
// ============================================

// App Configuration
const CONFIG = {
    currency: '₹',
    currencyCode: 'INR',
    locale: 'en-IN',
    categories: [
        { id: 'food', name: 'Food & Dining', icon: 'fa-utensils', color: '#4cc9f0' },
        { id: 'transportation', name: 'Transportation', icon: 'fa-car', color: '#7209b7' },
        { id: 'entertainment', name: 'Entertainment', icon: 'fa-film', color: '#f72585' },
        { id: 'shopping', name: 'Shopping', icon: 'fa-shopping-bag', color: '#ff9e00' },
        { id: 'utilities', name: 'Utilities', icon: 'fa-bolt', color: '#4361ee' },
        { id: 'healthcare', name: 'Healthcare', icon: 'fa-heartbeat', color: '#38b000' },
        { id: 'education', name: 'Education', icon: 'fa-graduation-cap', color: '#00b4d8' },
        { id: 'salary', name: 'Salary', icon: 'fa-money-check', color: '#06d6a0' },
        { id: 'freelance', name: 'Freelance', icon: 'fa-laptop', color: '#8338ec' },
        { id: 'investment', name: 'Investment', icon: 'fa-chart-line', color: '#ff9e00' },
        { id: 'other', name: 'Other', icon: 'fa-receipt', color: '#6c757d' }
    ],
    paymentMethods: [
        { id: 'cash', name: 'Cash', icon: 'fa-money-bill' },
        { id: 'upi', name: 'UPI', icon: 'fa-mobile-alt' },
        { id: 'card', name: 'Card', icon: 'fa-credit-card' },
        { id: 'netbanking', name: 'Net Banking', icon: 'fa-university' }
    ]
};

// App State
let transactions = JSON.parse(localStorage.getItem('expenseTrackerTransactions')) || [];
let currentTransactionType = 'expense';
let selectedCategoryId = null;
let selectedPaymentMethodId = 'cash';
let expenseChart = null;

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const transactionForm = document.getElementById('transactionForm');
const amountInput = document.getElementById('amount');
const descriptionInput = document.getElementById('description');
const dateInput = document.getElementById('date');
const categoryInput = document.getElementById('category');
const paymentMethodInput = document.getElementById('paymentMethod');
const categoryGrid = document.getElementById('categoryGrid');
const paymentMethodsContainer = document.getElementById('paymentMethods');
const formMessage = document.getElementById('formMessage');
const categoryError = document.getElementById('categoryError');

const totalIncomeEl = document.getElementById('totalIncome');
const totalExpensesEl = document.getElementById('totalExpenses');
const netBalanceEl = document.getElementById('netBalance');
const balanceStatusEl = document.getElementById('balanceStatus');
const transactionCountEl = document.getElementById('transactionCount');
const monthlyExpensesEl = document.getElementById('monthlyExpenses');
const categoryCountEl = document.getElementById('categoryCount');
const largestCategoryEl = document.getElementById('largestCategory');

const transactionsBody = document.getElementById('transactionsBody');
const searchInput = document.getElementById('searchTransactions');
const filterCategory = document.getElementById('filterCategory');
const filterType = document.getElementById('filterType');
const exportBtn = document.getElementById('exportBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

const importModal = document.getElementById('importModal');
const importDataTextarea = document.getElementById('importData');
const confirmImportBtn = document.getElementById('confirmImport');
const closeModalBtns = document.querySelectorAll('.close-modal');

const successToast = document.getElementById('successToast');
const confirmationDialog = document.getElementById('confirmationDialog');
const dialogMessage = document.getElementById('dialogMessage');
const dialogConfirmBtn = document.getElementById('dialogConfirm');
const dialogCancelBtn = document.getElementById('dialogCancel');

const themeSwitch = document.getElementById('themeSwitch');
const expenseChartEl = document.getElementById('expenseChart');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1000);
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    
    // Initialize UI components
    initializeCategories();
    initializePaymentMethods();
    initializeFilters();
    setupEventListeners();
    
    // Load transactions and update UI
    updateUI();
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeSwitch.checked = savedTheme === 'dark';
});

// Initialize categories
function initializeCategories() {
    // Clear category grid
    categoryGrid.innerHTML = '';
    
    // Add categories to grid
    CONFIG.categories.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.dataset.categoryId = category.id;
        categoryItem.innerHTML = `
            <i class="fas ${category.icon}"></i>
            <span>${category.name}</span>
        `;
        
        categoryItem.addEventListener('click', function() {
            // Remove active class from all categories
            document.querySelectorAll('.category-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked category
            this.classList.add('active');
            
            // Update selected category
            selectedCategoryId = category.id;
            categoryInput.value = category.id;
            
            // Clear category error
            categoryError.style.display = 'none';
        });
        
        categoryGrid.appendChild(categoryItem);
    });
    
    // Select first category by default
    const firstCategory = categoryGrid.querySelector('.category-item');
    if (firstCategory) {
        firstCategory.click();
    }
}

// Initialize payment methods
function initializePaymentMethods() {
    // Clear payment methods container
    paymentMethodsContainer.innerHTML = '';
    
    // Add payment methods
    CONFIG.paymentMethods.forEach(method => {
        const methodElement = document.createElement('div');
        methodElement.className = 'payment-method';
        methodElement.dataset.methodId = method.id;
        methodElement.innerHTML = `
            <i class="fas ${method.icon}"></i>
            <span>${method.name}</span>
        `;
        
        methodElement.addEventListener('click', function() {
            // Remove active class from all methods
            document.querySelectorAll('.payment-method').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked method
            this.classList.add('active');
            
            // Update selected method
            selectedPaymentMethodId = method.id;
            paymentMethodInput.value = method.id;
        });
        
        paymentMethodsContainer.appendChild(methodElement);
    });
    
    // Select first payment method by default
    const firstMethod = paymentMethodsContainer.querySelector('.payment-method');
    if (firstMethod) {
        firstMethod.click();
    }
}

// Initialize filters
function initializeFilters() {
    // Clear category filter options
    while (filterCategory.options.length > 1) {
        filterCategory.remove(1);
    }
    
    // Add categories to filter
    CONFIG.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        filterCategory.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.tab-btn').forEach(t => {
                t.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update transaction type
            currentTransactionType = this.dataset.type;
        });
    });
    
    // Form submission
    transactionForm.addEventListener('submit', handleAddTransaction);
    
    // Form reset
    transactionForm.addEventListener('reset', function() {
        // Select first category and payment method again
        const firstCategory = categoryGrid.querySelector('.category-item');
        const firstMethod = paymentMethodsContainer.querySelector('.payment-method');
        
        if (firstCategory) firstCategory.click();
        if (firstMethod) firstMethod.click();
        
        // Clear form message
        formMessage.style.display = 'none';
    });
    
    // Filter changes
    searchInput.addEventListener('input', updateUI);
    filterCategory.addEventListener('change', updateUI);
    filterType.addEventListener('change', updateUI);
    
    // Export button
    exportBtn.addEventListener('click', exportData);
    
    // Clear all button
    clearAllBtn.addEventListener('click', confirmClearAll);
    
    // Import modal
    document.getElementById('importBtn')?.addEventListener('click', () => {
        importModal.classList.add('active');
    });
    
    // Confirm import
    confirmImportBtn.addEventListener('click', importData);
    
    // Close modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.classList.remove('active');
        });
    });
    
    // Dialog buttons
    dialogConfirmBtn.addEventListener('click', function() {
        clearAllTransactions();
        confirmationDialog.classList.remove('active');
    });
    
    dialogCancelBtn.addEventListener('click', function() {
        confirmationDialog.classList.remove('active');
    });
    
    // Theme toggle
    themeSwitch.addEventListener('change', function() {
        const theme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update chart colors if chart exists
        if (expenseChart) {
            updateChart();
        }
    });
    
    // Close modal on outside click
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

// Handle add transaction
function handleAddTransaction(e) {
    e.preventDefault();
    
    // Get form values
    const amount = parseFloat(amountInput.value);
    const description = descriptionInput.value.trim();
    const date = dateInput.value;
    const category = categoryInput.value;
    const paymentMethod = paymentMethodInput.value;
    
    // Validation
    if (!validateForm(amount, description, category)) {
        return;
    }
    
    // Create transaction object
    const transaction = {
        id: Date.now(),
        type: currentTransactionType,
        amount: amount,
        description: description,
        date: date,
        category: category,
        paymentMethod: paymentMethod,
        createdAt: new Date().toISOString()
    };
    
    // Add to transactions array
    transactions.unshift(transaction);
    
    // Save to localStorage
    saveTransactions();
    
    // Update UI
    updateUI();
    
    // Show success message
    showFormMessage('Transaction added successfully!', 'success');
    showToast('Transaction added successfully!');
    
    // Reset form (except date)
    amountInput.value = '';
    descriptionInput.value = '';
    
    // Select first category and payment method
    const firstCategory = categoryGrid.querySelector('.category-item');
    const firstMethod = paymentMethodsContainer.querySelector('.payment-method');
    
    if (firstCategory) firstCategory.click();
    if (firstMethod) firstMethod.click();
}

// Validate form
function validateForm(amount, description, category) {
    let isValid = true;
    
    // Clear previous messages
    formMessage.style.display = 'none';
    categoryError.style.display = 'none';
    
    // Check amount
    if (!amount || amount <= 0) {
        showFormMessage('Please enter a valid amount greater than 0', 'error');
        isValid = false;
    }
    
    // Check description
    if (!description) {
        showFormMessage('Please enter a description', 'error');
        isValid = false;
    }
    
    // Check category
    if (!category) {
        categoryError.textContent = 'Please select a category';
        categoryError.style.display = 'block';
        isValid = false;
    }
    
    return isValid;
}

// Show form message
function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = 'form-message ' + type;
    formMessage.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// Update all UI components
function updateUI() {
    // Filter transactions based on search and filters
    const filteredTransactions = filterTransactions();
    
    // Update summary
    updateSummary(filteredTransactions);
    
    // Update transaction count
    updateTransactionCount();
    
    // Update transaction list
    updateTransactionList(filteredTransactions);
    
    // Update chart
    updateChart(filteredTransactions);
}

// Filter transactions
function filterTransactions() {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryFilter = filterCategory.value;
    const typeFilter = filterType.value;
    
    return transactions.filter(transaction => {
        // Search filter
        if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Category filter
        if (categoryFilter !== 'all' && transaction.category !== categoryFilter) {
            return false;
        }
        
        // Type filter
        if (typeFilter !== 'all' && transaction.type !== typeFilter) {
            return false;
        }
        
        return true;
    });
}

// Update summary
function updateSummary(filteredTransactions) {
    // Calculate totals
    const totalIncome = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const netBalance = totalIncome - totalExpenses;
    
    // Update DOM
    totalIncomeEl.textContent = formatNumber(totalIncome);
    totalExpensesEl.textContent = formatNumber(totalExpenses);
    netBalanceEl.textContent = formatNumber(netBalance);
    
    // Update balance status
    if (netBalance >= 0) {
        balanceStatusEl.textContent = 'Positive balance';
        netBalanceEl.style.color = 'var(--income-color)';
    } else {
        balanceStatusEl.textContent = 'Negative balance';
        netBalanceEl.style.color = 'var(--expense-color)';
    }
    
    // Calculate monthly expenses
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyExpenses = transactions
        .filter(t => t.type === 'expense')
        .filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);
    
    monthlyExpensesEl.textContent = formatCurrency(monthlyExpenses);
}

// Update transaction count
function updateTransactionCount() {
    transactionCountEl.textContent = transactions.length;
}

// Update transaction list
function updateTransactionList(filteredTransactions) {
    // Clear table body
    transactionsBody.innerHTML = '';
    
    if (filteredTransactions.length === 0) {
        transactionsBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="6">
                    <div class="empty-state">
                        <i class="fas fa-receipt"></i>
                        <h3>No transactions found</h3>
                        <p>Try changing your filters or add a new transaction</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Add transactions to table
    filteredTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.className = `${transaction.type}-row`;
        
        // Get category info
        const category = CONFIG.categories.find(c => c.id === transaction.category) || CONFIG.categories[CONFIG.categories.length - 1];
        const paymentMethod = CONFIG.paymentMethods.find(p => p.id === transaction.paymentMethod) || CONFIG.paymentMethods[0];
        
        // Format date
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${transaction.description}</td>
            <td>
                <span class="category-badge" style="border-left: 4px solid ${category.color}">
                    <i class="fas ${category.icon}"></i> ${category.name}
                </span>
            </td>
            <td>
                <span class="type-badge ${transaction.type}">
                    ${transaction.type === 'income' ? 'Income' : 'Expense'}
                </span>
            </td>
            <td class="text-right amount-cell ${transaction.type}-amount">
                ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
            </td>
            <td>
                <div class="action-buttons-cell">
                    <button class="action-btn edit-btn" data-id="${transaction.id}" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${transaction.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        transactionsBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            editTransaction(id);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            deleteTransaction(id);
        });
    });
}

// Update chart
function updateChart(filteredTransactions) {
    // Filter expense transactions
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    
    if (expenseTransactions.length === 0) {
        // Clear chart if it exists
        if (expenseChart) {
            expenseChart.destroy();
            expenseChart = null;
        }
        
        // Show message
        const chartWrapper = document.querySelector('.chart-wrapper');
        chartWrapper.innerHTML = `
            <div style="height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-muted);">
                <div style="text-align: center;">
                    <i class="fas fa-chart-pie" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                    <p>No expense data to display</p>
                </div>
            </div>
        `;
        
        categoryCountEl.textContent = '0';
        largestCategoryEl.textContent = '-';
        return;
    }
    
    // Group expenses by category
    const categoryTotals = {};
    expenseTransactions.forEach(transaction => {
        if (!categoryTotals[transaction.category]) {
            categoryTotals[transaction.category] = 0;
        }
        categoryTotals[transaction.category] += transaction.amount;
    });
    
    // Prepare chart data
    const labels = [];
    const data = [];
    const backgroundColors = [];
    
    Object.entries(categoryTotals).forEach(([categoryId, amount]) => {
        const category = CONFIG.categories.find(c => c.id === categoryId) || CONFIG.categories[CONFIG.categories.length - 1];
        labels.push(category.name);
        data.push(amount);
        backgroundColors.push(category.color);
    });
    
    // Update category stats
    categoryCountEl.textContent = Object.keys(categoryTotals).length;
    
    // Find largest category
    let largestCategoryName = '-';
    let largestAmount = 0;
    Object.entries(categoryTotals).forEach(([categoryId, amount]) => {
        if (amount > largestAmount) {
            largestAmount = amount;
            const category = CONFIG.categories.find(c => c.id === categoryId);
            largestCategoryName = category ? category.name : '-';
        }
    });
    largestCategoryEl.textContent = largestCategoryName;
    
    // Get chart context
    const ctx = expenseChartEl.getContext('2d');
    
    // Destroy existing chart
    if (expenseChart) {
        expenseChart.destroy();
    }
    
    // Create new chart
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                borderColor: 'var(--bg-card)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        },
                        color: 'var(--text-primary)'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Edit transaction
function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    
    if (!transaction) return;
    
    // Populate form with transaction data
    amountInput.value = transaction.amount;
    descriptionInput.value = transaction.description;
    dateInput.value = transaction.date;
    
    // Set transaction type
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.type === transaction.type) {
            tab.classList.add('active');
            currentTransactionType = transaction.type;
        }
    });
    
    // Set category
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.categoryId === transaction.category) {
            item.classList.add('active');
            selectedCategoryId = transaction.category;
            categoryInput.value = transaction.category;
        }
    });
    
    // Set payment method
    document.querySelectorAll('.payment-method').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.methodId === transaction.paymentMethod) {
            item.classList.add('active');
            selectedPaymentMethodId = transaction.paymentMethod;
            paymentMethodInput.value = transaction.paymentMethod;
        }
    });
    
    // Remove transaction from array
    transactions = transactions.filter(t => t.id !== id);
    
    // Update form button text
    const submitBtn = document.querySelector('.btn-submit');
    submitBtn.innerHTML = '<i class="fas fa-save"></i><span>Update Transaction</span>';
    
    // Change form submission to update
    transactionForm.onsubmit = function(e) {
        e.preventDefault();
        
        // Create updated transaction
        const updatedTransaction = {
            id: id,
            type: currentTransactionType,
            amount: parseFloat(amountInput.value),
            description: descriptionInput.value.trim(),
            date: dateInput.value,
            category: categoryInput.value,
            paymentMethod: paymentMethodInput.value,
            updatedAt: new Date().toISOString()
        };
        
        // Add back to transactions
        transactions.unshift(updatedTransaction);
        
        // Save and update
        saveTransactions();
        updateUI();
        
        // Show success message
        showFormMessage('Transaction updated successfully!', 'success');
        showToast('Transaction updated successfully!');
        
        // Reset form and button
        transactionForm.reset();
        submitBtn.innerHTML = '<i class="fas fa-check-circle"></i><span>Add Transaction</span>';
        
        // Reset form submission handler
        transactionForm.onsubmit = handleAddTransaction;
        
        // Select first category and payment method
        const firstCategory = categoryGrid.querySelector('.category-item');
        const firstMethod = paymentMethodsContainer.querySelector('.payment-method');
        
        if (firstCategory) firstCategory.click();
        if (firstMethod) firstMethod.click();
    };
    
    // Scroll to form
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

// Delete transaction
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveTransactions();
        updateUI();
        showToast('Transaction deleted successfully!');
    }
}

// Confirm clear all
function confirmClearAll() {
    if (transactions.length === 0) {
        showToast('No transactions to clear', 'info');
        return;
    }
    
    dialogMessage.textContent = `Are you sure you want to delete all ${transactions.length} transactions? This action cannot be undone.`;
    confirmationDialog.classList.add('active');
}

// Clear all transactions
function clearAllTransactions() {
    transactions = [];
    saveTransactions();
    updateUI();
    showToast('All transactions cleared!');
}

// Export data
function exportData() {
    const data = {
        app: 'Expense Tracker',
        version: '1.0',
        exportDate: new Date().toISOString(),
        transactions: transactions
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileName = `expense-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    showToast('Data exported successfully!');
}

// Import data
function importData() {
    const data = importDataTextarea.value.trim();
    
    if (!data) {
        showToast('Please paste JSON data to import', 'error');
        return;
    }
    
    try {
        const importedData = JSON.parse(data);
        
        if (!importedData.transactions || !Array.isArray(importedData.transactions)) {
            throw new Error('Invalid data format');
        }
        
        // Clear existing transactions
        transactions = [];
        
        // Add imported transactions
        importedData.transactions.forEach(transaction => {
            // Generate new ID for each transaction
            transaction.id = Date.now() + Math.random();
            transactions.push(transaction);
        });
        
        // Save and update
        saveTransactions();
        updateUI();
        
        // Close modal and clear textarea
        importModal.classList.remove('active');
        importDataTextarea.value = '';
        
        // Show success message
        showToast(`${transactions.length} transactions imported successfully!`);
        
    } catch (error) {
        showToast('Error importing data: Invalid JSON format', 'error');
    }
}

// Save transactions to localStorage
function saveTransactions() {
    localStorage.setItem('expenseTrackerTransactions', JSON.stringify(transactions));
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = successToast;
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set message
    toastMessage.textContent = message;
    
    // Set color based on type
    if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #ef476f, #f72585)';
    } else if (type === 'info') {
        toast.style.background = 'linear-gradient(135deg, #4361ee, #3a0ca3)';
    } else {
        toast.style.background = 'linear-gradient(135deg, #06d6a0, #4cc9f0)';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Format currency for display
function formatCurrency(amount) {
    return new Intl.NumberFormat(CONFIG.locale, {
        style: 'currency',
        currency: CONFIG.currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Format number without currency symbol
function formatNumber(num) {
    return new Intl.NumberFormat(CONFIG.locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(num);
}