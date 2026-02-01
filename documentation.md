# Expense Tracker - Technical Documentation

## Project Overview
A client-side expense tracking application built with vanilla HTML, CSS, and JavaScript.

## Architecture

### Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Charts**: Chart.js library
- **Icons**: Font Awesome
- **Storage**: Browser localStorage API

### File Structure
- `index.html` - Main HTML structure
- `style.css` - All styling with dark/light theme
- `script.js` - Core application logic
- `README.md` - User guide
- `documentation.md` - This file

## Core Components

### 1. HTML Structure
- Header with logo and theme toggle
- Financial overview cards
- Transaction input form
- Chart visualization
- Transaction history table
- Modals for import/export

### 2. CSS Architecture
- CSS Variables for theme switching
- Mobile-first responsive design
- Modern card-based layout
- Smooth animations and transitions

### 3. JavaScript Modules

#### App Configuration
```javascript
const CONFIG = {
    currency: '₹',
    categories: [...],
    paymentMethods: [...]
};