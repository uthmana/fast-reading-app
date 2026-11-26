# 🚀 Fast Reading App (Hızlı Okuma Platformu)

A comprehensive, institutional-grade web platform designed to enhance reading speed, comprehension, visual perception, and cognitive skills. Built with modern web technologies, it features role-based access control (Admin, Subscriber/Institution, Teacher, and Student), interactive exercises, performance tracking, dynamic certificate generation, and subscription/franchise management.

---

## ✨ Key Features

### 👤 Role-Based Portals & Dashboards
- **Admin**: Full system management, user administration, tenant/subscriber oversight, and data transfers.
- **Subscriber / Institution**: Manage classes, teachers, student rosters, billing, and institutional subscriptions.
- **Teacher**: Monitor student performance, assign lessons/exercises, and track comprehension metrics.
- **Student Portal**:
  - **Dersler (Lessons)**: Structured learning paths and progressive modules.
  - **Göz Egzersizleri (Eye Exercises)**: Vision expansion, saccadic movements, and fixation drills.
  - **Beyin Egzersizleri (Brain Exercises)**: Cognitive speed and mental agility training.
  - **Kelime Egzersizleri (Word Exercises)**: Vocabulary building and rapid word recognition.
  - **Metin Egzersizleri (Text Exercises)**: Speed reading practice with adjustable speeds and word counts.
  - **Okuma Anlama Testleri (Reading Comprehension Tests)**: Quizzes assessing comprehension rates and Words Per Minute (WPM).

### 🎓 Certificate Generation
- Fully customizable certificate module (`/sertifika`) allowing students to generate, view, and export professional completion certificates.

### 🌐 Landing & Corporate Pages
- Public-facing marketing pages, corporate overview, franchise applications (`/bayilik`), trial class registrations (`/basvur`), blog posts with dynamic slugs, and contact information.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (React 18 with App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & ORM**: MySQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: NextAuth.js / Custom Auth with `bcryptjs`
- **UI & Animations**: Framer Motion, `@dnd-kit`, React Icons, ApexCharts, React Calendar, React D3 Speedometer, TanStack Table
- **Export & Utilities**: jsPDF, `html-to-image`, `file-saver`, `xlsx`, `qrcode.react`

---

## 📁 Project Structure

```tree
fast-reading-app/
├── app/
│   ├── (admin)/         # Admin dashboard & management panels
│   ├── (auth)/          # Authentication (Student & Institution logins)
│   ├── (landing)/       # Public marketing, blog, franchise, & contact pages
│   ├── (ogrenci)/       # Student learning portal (exercises, tests, lessons)
│   ├── (sertifika)/     # Certificate generation & viewing module
│   └── api/             # Next.js API route handlers (users, articles, attempts, etc.)
├── prisma/
│   └── schema.prisma    # Database schema (Models: User, Student, Lesson, Article, etc.)
├── public/              # Static assets & images
└── package.json         # Project dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **MySQL** Database server

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd fast-reading-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and add your MySQL connection string and auth secrets:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/fast_reading_db"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Run database migrations / generate Prisma client:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📜 Scripts

- `npm run dev` — Starts the development server.
- `npm run build` — Generates Prisma client and builds the Next.js application for production.
- `npm run start` — Starts the production server.
- `npm run lint` — Runs ESLint for code quality checks.

---

## 📄 License

This project is proprietary and confidential.
