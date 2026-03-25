# Requirements Document

## 1. Application Overview

- **Application Name:** Gaytri Restaurant
- **Description:** A fully responsive restaurant website for Gaytri Restaurant, enabling users to browse an Indian menu with INR pricing, add items to a cart, place online orders via Cash on Delivery, make table reservations, and contact the restaurant. An admin panel allows staff to manage menu items and view orders.

---

## 2. Target Users & Use Cases

### Target Users
- Local customers (India-based)
- College students
- Office workers
- Families ordering food online

### Core Use Cases
- Browse the restaurant menu by category and add items to cart
- Complete checkout with delivery details and Cash on Delivery payment
- Make a table reservation
- Contact the restaurant or find its location
- Admin manages menu items and views placed orders

---

## 3. Page Structure & Core Features

### 3.1 Page Overview

```
Gaytri Restaurant Website
├── Home Page
├── Menu Page
├── Cart Page
├── Checkout Page
├── Contact Page
├── Table Reservation Page
└── Admin Panel
    ├── Menu Management
    └── Order Management
```

### 3.2 Home Page

- Sticky navigation bar with links to: Home, Menu, Reservation, Contact
- Cart icon in navbar showing current item count
- Hero banner with high-quality Indian food imagery
- Restaurant name: Gaytri Restaurant
- Tagline: 「Authentic Taste of India」
- Two prominent CTA buttons:
  - Order Now → navigates to Menu Page
  - View Menu → navigates to Menu Page
- Brief highlights section (e.g., fast delivery, authentic recipes, best prices)
- Footer with phone number, email, opening hours, and quick navigation links
- Color theme: Primary Saffron/Orange, Secondary Green, Background White

### 3.3 Menu Page

- Category filter tabs at the top:
  - Starters
  - Main Course
  - Indian Breads
  - Beverages
  - Desserts
- Menu items displayed in a responsive card grid layout
- Each card includes:
  - Item image
  - Item name
  - Category label
  - Price in INR (e.g., ₹220)
  - Add to Cart button
- Clicking Add to Cart increments cart count in navbar and adds item to cart state
- If a category has no items: display 「No items available in this category」
- Example items pre-loaded:
  - Paneer Butter Masala — ₹220 — Main Course
  - Butter Naan — ₹40 — Indian Breads

### 3.4 Cart Page

- List all cart items with:
  - Item image and name
  - Unit price in INR
  - Quantity controls (increase / decrease / remove)
  - Line total (unit price × quantity)
- Order summary panel:
  - Subtotal
  - Total amount in INR
- Example display:
  - Paneer Butter Masala × 2 = ₹440
  - Butter Naan × 3 = ₹120
  - Total = ₹560
- Proceed to Checkout button (disabled if cart is empty)
- Continue Shopping button → returns to Menu Page
- Empty cart state: illustration with message and Browse Menu button

### 3.5 Checkout Page

- Read-only order summary pulled from cart
- Customer details form:
  - Full Name (required)
  - Phone Number (required, 10-digit Indian mobile format)
  - Delivery Address (required, India format)
- Payment method selection:
  - Cash on Delivery (COD) — active and selectable
  - UPI — displayed but disabled with 「Coming Soon」 label
  - Card — displayed but disabled with 「Coming Soon」 label
- Place Order button — triggers form validation before submission
- On successful submission:
  - Display order confirmation screen with order summary and thank-you message
  - Clear cart state
- On server error: display 「Order could not be placed. Please try again.」

### 3.6 Contact Page

- Phone number (clickable tel: link on mobile)
- Email address (clickable mailto: link)
- Embedded Google Maps showing restaurant location
- Opening hours (days and time slots)
- Clean card-based layout with saffron accent colors

### 3.7 Table Reservation Page

- Reservation form:
  - Full Name (required)
  - Date (required, must be a future date)
  - Time (required, within opening hours)
  - Number of People (required, minimum 1)
- Submit Reservation button
- On successful submission: display confirmation message with reservation details
- On past date selection: show inline error 「Please select a future date」
- Reservation data persisted to backend database

### 3.8 Admin Panel

- Accessible via route /admin (no authentication in current scope)
- Menu Management:
  - View all menu items in a table with name, category, price, image
  - Add new menu item (name, price, category, image URL)
  - Edit existing menu item inline or via modal
  - Delete menu item with confirmation dialog before deletion
- Order Management:
  - View all placed orders in a table with: order ID, customer name, phone, address, items ordered, total amount, payment method, order date
  - Update order status (e.g., Pending → Preparing → Delivered)

---

## 4. Business Rules & Logic

- All prices are displayed and calculated exclusively in INR (₹)
- Cart state is maintained across page navigation within the session
- Quantity per item in cart must be at least 1; removing the last unit removes the item entirely
- Only Cash on Delivery is functional at checkout; UPI and Card are shown as disabled placeholders
- Admin panel is accessible via direct URL only; no login required in current scope
- Table reservation and order data must be persisted to the backend database
- Menu items on the Menu Page are sourced from the backend database
- Checkout button is disabled when cart is empty

---

## 5. Edge Cases & Boundary Conditions

| Scenario | Expected Behavior |
|---|---|
| Checkout attempted with empty cart | Checkout button disabled; prompt shown to add items |
| Checkout form submitted with missing required fields | Highlight missing fields with inline error messages; block submission |
| Phone number in invalid format | Show error: 「Please enter a valid 10-digit Indian mobile number」 |
| No items in selected menu category | Display 「No items available in this category」 |
| Admin deletes a menu item | Show confirmation dialog before deletion |
| Reservation submitted with a past date | Show error: 「Please select a future date」 |
| Order placement fails due to server error | Show error: 「Order could not be placed. Please try again.」 |
| Cart item quantity decreased below 1 | Remove item from cart automatically |

---

## 6. Acceptance Criteria

- Home page loads with hero banner, tagline 「Authentic Taste of India」, and functional CTA buttons
- Menu page displays all 5 categories with correct items and INR pricing
- Add to Cart correctly updates navbar cart count and cart item list
- Cart page accurately calculates line totals and overall total in INR
- Checkout form validates all required fields before allowing order submission
- Successful order submission displays confirmation message and clears cart
- Contact page displays phone, email, Google Maps embed, and opening hours
- Table reservation form submits successfully and stores data in backend
- Admin panel allows add, edit, and delete of menu items
- Admin panel displays all placed orders with status update capability
- Website is fully responsive on mobile and desktop viewports
- Navigation between all pages functions correctly
- Saffron/Orange and Green color theme is consistently applied throughout

---

## 7. Out of Scope (Current Version)

- Online payment integration (Razorpay, Stripe, functional UPI flow)
- User login, signup, and account management
- Order tracking after placement
- Reviews and ratings system
- AI-based food recommendations
- Admin authentication and access control
- SEO optimization configuration
- Performance optimization targets
- Deployment configuration