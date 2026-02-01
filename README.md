# ₹ Expense Tracker - Premium Edition

A modern, feature-rich expense tracking web application designed specifically for Indian users with complete Indian Rupees (₹) support.

![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 🌟 Live Demo
👉 **[View Live Application](https://yourusername.github.io/expense-tracker/)**

*Replace `yourusername` with your actual GitHub username after deployment*

## ✨ Features

### 📊 **Core Features**
- ✅ **Income & Expense Tracking** - Separate tracking for earnings and spendings
- ✅ **Smart Categorization** - 11+ Indian-specific categories with icons
- ✅ **Real-time Financial Summary** - Instant income, expenses, and balance calculations
- ✅ **Indian Rupees Support** - Complete ₹ integration with proper formatting
- ✅ **Data Visualization** - Interactive pie charts for expense analysis
- ✅ **Advanced Filtering** - Search, category, and type filters
- ✅ **Dark/Light Mode** - Toggle between themes for comfortable viewing
- ✅ **Data Persistence** - localStorage for offline access
- ✅ **Export/Import** - Backup and restore transaction data
- ✅ **Full CRUD Operations** - Create, Read, Update, Delete transactions
- ✅ **Responsive Design** - Perfect on mobile, tablet, and desktop

### 🎁 **Premium Features**
- 🌙 **Dark/Light Theme Toggle** - Smooth transitions between themes
- 🏷️ **Category Grid Selection** - Visual category selection with icons
- 💳 **Payment Method Tracking** - Cash, UPI, Card, Net Banking support
- 📱 **Mobile-First Design** - Optimized for all screen sizes
- 🔍 **Advanced Search** - Real-time transaction search
- 📊 **Multiple Chart Views** - Pie, Bar, and Line chart options
- 🔔 **Toast Notifications** - User feedback for all actions
- 📋 **Pagination** - Efficient handling of transaction lists
- ⚡ **Quick Actions** - Edit and delete with single click
- 🎯 **Financial Insights** - Automated spending analysis

## 🚀 Quick Start

### **Method 1: Direct File Opening**
1. Download or clone this repository
2. Open `index.html` in any modern web browser
3. Start tracking your expenses immediately!

### **Method 2: Online Demo**
Visit the live demo link above to try the application without installation.

## 📱 How to Use

### **Adding a Transaction**
1. Select **Expense** or **Income** tab
2. Enter the **amount** in ₹
3. Add a **description** (e.g., "Lunch at restaurant")
4. Choose a **date** (defaults to today)
5. Select a **category** by clicking on icons
6. Choose **payment method** (Cash/UPI/Card/Net Banking)
7. Click **"Add Transaction"**

### **Managing Transactions**
- **Edit**: Click the pencil icon (✏️) on any transaction
- **Delete**: Click the trash icon (🗑️) on any transaction
- **Filter**: Use dropdowns to filter by category or type
- **Search**: Type in the search box to find specific transactions

### **Viewing Reports**
- **Overview Cards**: See totals at a glance
- **Pie Chart**: Visualize expense distribution
- **Transaction History**: Browse all transactions in a table
- **Financial Insights**: Get automated spending analysis

### **Data Management**
- **Export**: Click "Export" to download all data as JSON
- **Import**: Click "Import" to restore from JSON backup
- **Clear All**: Remove all transactions (with confirmation)


### **File Details:**
- **`index.html`** - Main application structure with semantic HTML5
- **`style.css`** - Complete styling with CSS Variables for theming
- **`script.js`** - Core application logic with ES6+ features
- **`README.md`** - User guide and documentation (this file)
- **`documentation.md`** - Technical implementation details

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic markup and structure |
| **CSS3** | Styling with CSS Variables, Flexbox, Grid |
| **JavaScript (ES6+)** | Application logic and interactivity |
| **Chart.js** | Data visualization and charts |
| **Font Awesome** | Icons for categories and UI elements |
| **Google Fonts** | Typography (Poppins & Inter fonts) |
| **LocalStorage API** | Client-side data persistence |
| **Intl API** | Indian Rupees formatting |

## 🌐 Browser Support

- ✅ **Google Chrome** (v60+)
- ✅ **Mozilla Firefox** (v55+)
- ✅ **Microsoft Edge** (v79+)
- ✅ **Safari** (v12+)
- ✅ **Opera** (v50+)
- ✅ **Mobile Browsers** (Chrome Mobile, Safari Mobile)

## 📊 Data Model

### **Transaction Structure:**
```javascript
{
    id: number,                 // Unique identifier
    type: 'income' | 'expense', // Transaction type
    amount: number,            // Amount in ₹
    description: string,       // User description
    date: string,             // YYYY-MM-DD format
    category: string,         // Category ID
    paymentMethod: string,    // Payment method ID
    createdAt: string         // ISO timestamp
}
