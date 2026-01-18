
---

  

# Task Pro — Task Management Dashboard

  

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black" />
  <img src="https://img.shields.io/badge/React-19-61dafb" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue" />
  <img src="https://img.shields.io/badge/Redux-RTK%20Query-764abc" />
  <img src="https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-ffca28" />
</p>




---

  

## 🚀 Project Overview

  

**Task Pro** is a production-ready task management dashboard focused on **performance, scalability, and clean architecture**.

![Preview](https://iili.io/fUPLqHg.png)  

Built with **Next.js App Router**, **React 19**, and **Redux Toolkit**, the app demonstrates real-world patterns: authentication, protected routes, real-time data sync, analytics, and internationalization.

  

---

  

## 🎯 Key Features

  

* 🔐 **Authentication** — Firebase Auth (Email / Guest), protected routes

* 📋 **Task Management** — CRUD, priorities, List & Kanban Board

* 📊 **Analytics** — real-time charts, completion metrics

* 🌍 **i18n** — English & Ukrainian

* 🎨 **UI/UX** — Tailwind CSS, Framer Motion, Dark/Light mode

* 💾 **Data Layer** — Firestore with LocalStorage fallback

  

---
## 🧠 Tech Stack

- **Framework & Architecture**
    
    - Next.js 15 (**App Router**) with clear server/client component separation
        
    - React 19 with **strict TypeScript** typing
        
- **State & Data Management**
    
    - **Redux Toolkit + RTK Query** for normalized global state
        
    - Cache invalidation, optimistic updates, and real-time Firestore sync
        
    - LocalStorage fallback for offline support and performance
        
- **Authentication & Security**
    
    - **Firebase Auth** (Email / Guest)
        
    - Auth Guard for protected routes and session persistence
        
- **UI & UX**
    
    - **Tailwind CSS 4** for scalable styling
        
    - **Framer Motion** for micro-animations
        
    - **Recharts** for analytics and data visualization
        
    - Modular UI system (reusable components, providers, custom hooks)
        
- **Forms & Validation**
    
    - **React Hook Form** with **Zod** schema validation
        
- **Backend / BaaS**
    
    - **Firebase Firestore** as real-time database
        
    - Secure, scalable backend-as-a-service architecture


  


  

---

## 🏗️ Project Architecture

The project follows a **modular, scalable architecture** aligned with modern **Next.js App Router** best practices.

### High-Level Architecture

- **App Router (Next.js 15)**
    
    - Clear separation between public, auth, and protected dashboard routes
    
    - Shared layout with global providers (Redux, Theme, i18n)
        
- **State & Data Layer**
    
    - **Redux Toolkit** for global state
        
    - **RTK Query** for server state, caching, and Firestore synchronization
        
    - Optimistic updates and automatic cache invalidation
        
- **Authentication Flow**
    
    - Firebase Auth listener initializes session state
        
    - Auth Guard protects private routes
        
    - Supports Guest and Authenticated modes without UI flicker
        
- **Data Persistence**
    
    - **Firestore** as primary real-time database
        
    - **LocalStorage** as offline fallback and performance optimization
        
    - Centralized error handling
        

---

### Directory Structure (Simplified)


```
task-pro/
├─ app/                     # Next.js App Router (routes & layouts)
│  ├─ (auth)/               # Authentication: Login / Register / Guest
│  ├─ (dashboard)/          # Protected dashboard routes
│  └─ layout.tsx            # Global layout & providers
│
├─ components/              # Reusable UI & feature components
│  ├─ ui/                   # Buttons, Inputs, Modals
│  └─ tasks/                # Task-related components
│
├─ store/                   # Redux Toolkit slices & RTK Query APIs
├─ lib/                     # Firebase, i18n, app configuration
├─ hooks/                   # Custom React hooks
└─ public/                  # Static assets
```




  

## 📸 Screenshots

  

<p align="center">

  <img src="https://i.ibb.co/YTPT17D3/profile.png" width="50%" />
  <img src="https://i.ibb.co/TB6Zwr09/tasks.png" width="50%" />

</p>

  

---
## 🔗 Links

* **Live Demo:** *(optional)*
