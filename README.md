# Gayatri Restaurant

A premium food ordering and reservation system for Gayatri Restaurant. Authentic Indian taste with a modern digital experience.

## ✨ Features

- **Premium Menu**: Explore our authentic Indian dishes with high-quality, professional food photography.
- **Real-time Cart**: Add items to your cart, adjust quantities, and place orders with ease.
- **Table Reservation**: Book your favorite table in advance for a seamless dining experience.
- **Admin Dashboard**: Comprehensive management of menu items, orders, and reservations.
- **Modern & Responsive UI**: Built with React, Tailwind CSS, and Shadcn UI, optimized for all devices.
- **Secure Backend**: Powered by Supabase for reliable data management and authentication.

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+)
- npm or pnpm
- Supabase account (for backend services)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

### GitHub
Push your code to a GitHub repository to enable version control and collaboration.
```bash
git init
git add .
git commit -m "Initial commit: Gayatri Restaurant Improvements"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Vercel
Connect your GitHub repository to [Vercel](https://vercel.com) for automatic deployments:
1. Import your project from GitHub.
2. Add your `.env` variables in the Vercel project settings.
3. Vercel will automatically build and deploy every time you push to `main`.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI (Radix UI)
- **Icons**: Lucide React
- **Backend**: Supabase (Database, Auth)
- **Forms**: React Hook Form
- **Toasts**: Sonner
