### Task Pro

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white) ![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Task Pro** is a modern, feature-rich task management application built to help users organize their daily activities efficiently. It combines a robust tech stack with a clean, responsive user interface to deliver a seamless experience for tracking tasks, monitoring productivity, and managing personal workflows.

![Dashboard](https://i.ibb.co/hFNbWTtp/Task-Tasks-page.png)

## Project Overview


Task Pro is designed with a focus on user experience and performance. It leverages **Next.js 16** for server-side rendering and optimized routing, **Firebase** for secure authentication, and **Redux Toolkit** for efficient state management. The application supports multiple languages, dark/light themes, and provides real-time analytics to help users visualize their progress.


## Tech Stack
### Core Frameworks & Languages
- **Next.js 16**: The React framework for production, utilizing the App Router for nested layouts and streaming.
- **React 19**: The latest version of React for building interactive user interfaces.
- **TypeScript**: Ensures type safety and improves developer experience across the codebase.
### State Management & Data Fetching
- **Redux Toolkit**: The official, opinionated, batteries-included toolset for efficient Redux development.
- **RTK Query**: A powerful data fetching and caching tool designed to simplify loading data in a web application.
### Backend & Authentication
- **Firebase**: **Authentication**: Secure email/password login and anonymous guest access.
### Styling & UI
- **Tailwind CSS 4**: A utility-first CSS framework for rapid UI development.
- **Framer Motion**: A production-ready motion library for React to create smooth animations.
- **Lucide React**: Beautiful & consistent icons.
- **Radix UI**: Unstyled, accessible components for building high-quality design systems.
- **React Hook Form** + **Zod**: Performant, flexible, and extensible forms with schema validation.
### Other Tools
- **i18next**: Internationalization framework for English and Ukrainian language support.
- **Recharts**: A composable charting library built on React components.
## Key Features
### Authentication
- **Secure Login/Register**: Email and password authentication via Firebase.
- **Guest Access**: Try the application instantly without creating an account.
- **Protected Routes**: Middleware ensures sensitive pages are only accessible to authenticated users.
### Task Management
- **CRUD Operations**: Create, Read, Update, and Delete tasks seamlessly.
- **Status Tracking**: Categorize tasks as "To Do", "In Progress", or "Done".
- **Priority Levels**: Assign Low, Medium, or High priority to tasks.
- **Visual Indicators**: Color-coded badges and status indicators for quick scanning.
### Analytics Dashboard
- **Real-time Metrics**: View completion rates and total task counts.
- **Visualizations**: Interactive pie charts and bar graphs displaying task distribution by status and priority.
### Localization & Theming
- **Multi-language Support**: Toggle between English and Ukrainian instantly.
- **Dark/Light Mode**: Fully supported themes that respect system preferences or user selection.


## Installation & Setup
Follow these steps to get a local copy up and running.
### Prerequisites

- Node.js (v18 or higher)

- npm or yarn

### 1. Clone the repository

```bash

git clone https://github.com/mirasto/task-pro.git

cd task-pro

```

  

### 2. Install dependencies

```bash

npm install

# or

yarn install

```

  

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add your Firebase configuration credentials. You can use `.env.example` as a template.

  

```env

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

```

  

### 4. Run the development server

```bash

npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

  

## Project Structure

  

```

task-pro/
├── app/                  # Next.js App Router pages and layouts
│   ├── (auth)/           # Authentication routes (Login, Register)
│   ├── (dashboard)/      # Protected application routes (Tasks, Analytics)
│   └── (marketing)/      # Public landing page
├── components/           # Reusable UI components
│   ├── tasks/            # Task-specific components (TaskCard, TaskForm)
│   ├── ui/               # Generic UI elements (Buttons, Inputs)
│   └── providers/        # Context providers (Theme, Store, i18n)
├── lib/                  # Utility functions and configurations
├── store/                # Redux store and API slices
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

### Screenshots

**Analytics**

![Analytics](https://i.ibb.co/8LzCj0Zr/Task-Tasks-analytics.png)
