# Liftora Admin Dashboard

A modern, professional admin dashboard built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Authentication**: Secure login/logout with context-based state management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Component Architecture**: Reusable, modular components following best practices
- **Professional UI**: Clean, modern interface with consistent design system
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Performance**: Optimized with Next.js App Router and React Icons

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **Icons**: React Icons (Feather Icons)
- **State Management**: React Context API
- **Build Tool**: Turbopack
- **Package Manager**: npm

## 📁 Project Structure

```
liftora-admin/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Login page
├── components/            # React components
│   ├── UI/               # Reusable UI components
│   ├── context/          # Context providers
│   ├── LoginForm.tsx     # Login form component
│   ├── SignUp.tsx        # Sign up form component
│   └── ForgotPassword.tsx # Password reset component
├── types/                # TypeScript type definitions
├── constants/            # Application constants
├── utils/                # Utility functions
├── public/               # Static assets
└── README.md            # Project documentation
```

## 🎨 Design System

### Colors
- **Primary Blue**: `#2563EB` (Professional blue for primary actions)
- **Dark Blue**: `#1D4ED8` (Darker blue for hover states)
- **Light Blue**: `#3B82F6` (Lighter blue for accents)
- **Background**: `#F8FAFC` (Content), `#F1F5F9` (Main), `#FFFFFF` (Sidebar/Header)

### Components
- **Button**: Multiple variants (primary, secondary, outline, ghost, danger)
- **Input**: Form inputs with validation and error states
- **Modal**: Accessible modal dialogs with backdrop handling
- **Card**: KPI and report cards with consistent styling

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd liftora-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_APP_NAME=Liftora Admin
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### TypeScript Configuration
The project uses strict TypeScript configuration with path aliases:
- `@/*` - Root directory
- `@/components/*` - Components directory
- `@/types/*` - Type definitions
- `@/constants/*` - Application constants
- `@/utils/*` - Utility functions

## 🏗️ Architecture

### Component Structure
- **Atomic Design**: Components follow atomic design principles
- **Composition**: Components are composable and reusable
- **Props Interface**: All components have proper TypeScript interfaces
- **Error Boundaries**: Proper error handling throughout the application

### State Management
- **Context API**: Authentication state managed with React Context
- **Local State**: Component-specific state with useState
- **Form State**: Controlled components with proper validation

### Routing
- **App Router**: Next.js 13+ App Router for file-based routing
- **Dynamic Routes**: Support for dynamic page generation
- **Layout System**: Nested layouts for consistent UI

## 🎯 Key Features

### Authentication
- Secure login/logout functionality
- Form validation with error handling
- Remember me functionality
- Password reset flow
- User registration

### Dashboard
- KPI cards with trend indicators
- Responsive grid layout
- Real-time data visualization
- User activity tracking

### User Management
- User listing with search functionality
- User details modal
- Edit user information
- Status management (Restricted/Unrestricted)


## 🔒 Security

- **Input Validation**: Client-side and server-side validation
- **XSS Protection**: Proper data sanitization
- **CSRF Protection**: Built-in Next.js protection
- **Secure Headers**: Automatic security headers

## ♿ Accessibility

- **WCAG 2.1 AA**: Compliant with accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and roles
- **Color Contrast**: High contrast ratios for readability

## 📱 Responsive Design

- **Mobile First**: Mobile-first responsive design
- **Breakpoints**: Tailwind CSS breakpoint system
- **Touch Friendly**: Optimized for touch devices
- **Cross Browser**: Compatible with modern browsers

## 🧪 Testing

The project is set up for testing with:
- **TypeScript**: Compile-time type checking
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting (recommended)

## 📈 Performance

- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Built-in bundle analyzer
- **Lazy Loading**: Component and route lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@Liftora.com or create an issue in the repository.

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Complete authentication system
- Dashboard with KPI cards
- User management functionality
- Professional UI/UX design
