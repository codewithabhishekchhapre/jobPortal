# JobNest — Modern Responsive Job Portal Website

**JobNest** is a complete, modern, and fully responsive job portal website engineered exclusively with **semantic HTML5, modern CSS3, and Vanilla JavaScript (ES6+)**. It contains **zero** frameworks or external runtime libraries (no React, Next.js, Vue, Angular, Bootstrap, Tailwind CSS, or jQuery).

The portal replicates contemporary enterprise hiring platforms (such as LinkedIn, Indeed, and Naukri), connecting ambitious job seekers with leading employers and enterprises.

---

## 🚀 Quick Start / How to Run

Because JobNest is built purely with vanilla web standards, it requires no compilation, build steps, or package installations.

### Option 1: Direct Browser Launch
1. Navigate to the project root: `jobPortal/`
2. Double-click or open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).

### Option 2: Local HTTP Server (Recommended)
Running through a local web server ensures standard URL handling:
```bash
# Using Python:
python -m http.server 3000

# Using Node.js npx:
npx serve -l 3000

# Open in browser:
http://localhost:3000
```

---

## 🔑 Demo Accounts & Credentials

JobNest includes pre-seeded demo accounts in `js/data.js` and initializes them into browser `localStorage`:

| Role | Name | Email | Password | Pre-loaded Data |
| :--- | :--- | :--- | :--- | :--- |
| **Job Seeker** | Aarav Sharma | `seeker@demo.com` | `password123` | 3 active applications, 2 saved bookmarks, ATS resume metadata |
| **Employer** | Priya Patel (TCS) | `employer@demo.com` | `password123` | 3 active jobs posted, applicant pipeline with status actions |

> ⚡ **Tip:** The `login.html` page features **1-Click Demo Sign-in buttons** that instantly pre-fill and submit the credentials.

---

## 🎨 Design System & Visual Guidelines

The design adheres to the strict design requirements:

- **Primary Color:** `#2563EB` (Royal Blue)
- **Primary Hover:** `#1D4ED8`
- **Primary Light / Surface:** `#EFF6FF`
- **Background Canvas:** `#F8FAFC` (Slate Tint)
- **Main Text / Headings:** `#0F172A` (Slate 900)
- **Secondary Text:** `#64748B` (Slate 500)
- **Card Background:** `#FFFFFF` with subtle 1px border (`#E2E8F0`) and multi-layer shadows (`--shadow-sm`, `--shadow-md`)
- **Success / Shortlisted:** `#10B981` (Emerald)
- **Warning / Review:** `#F59E0B` (Amber)
- **Danger / Rejected:** `#EF4444` (Rose Red)
- **Icons:** Lucide icons via CDN (with defensive fallback handling)
- **Typography:** Inter & system font stack (`--font-sans`)

---

## 📂 Project Structure

```text
jobPortal/
├── index.html               # Home landing page with hero search, categories, featured jobs & top companies
├── jobs.html                # Jobs directory with live multi-criteria filtering, search, sorting & pagination
├── job-details.html         # Comprehensive single job specification, responsibilities, perks & apply flow
├── companies.html           # Companies directory with search and industry filtering
├── company-details.html     # Dedicated company profile with active openings
├── login.html               # Demo login with 1-click test credentials and validation
├── register.html            # Registration with Seeker vs Employer role toggle
├── seeker-dashboard.html    # Candidate dashboard (profile edit, skills chips, resume upload mock, applications)
├── employer-dashboard.html  # Employer dashboard (stats, job management, applicant pipeline, status updater)
├── post-job.html            # Dedicated job posting page for employers
├── saved-jobs.html          # Bookmarked jobs management page for seekers
├── applications.html        # Candidate application status tracker
├── about.html               # Platform mission, vision, seeker benefits & employer benefits
├── contact.html             # Contact form with validation and local message simulation
├── README.md                # Comprehensive documentation, testing guide, and setup instructions
├── assets/
│   ├── icons/               # Icon assets
│   └── images/              # Image placeholders
├── css/
│   ├── style.css            # Design tokens, CSS variables, typography, reset, buttons, inputs, modals, toasts
│   ├── components.css       # Navbar, mobile drawer, footer, job cards, company cards, category cards, pagination
│   ├── dashboard.css        # Dashboard sidebar, stats cards, data tables, status badges, profile form
│   └── responsive.css       # Mobile & tablet media queries (1024px, 768px, 480px)
└── js/
    ├── data.js              # Initial seed dataset (12+ realistic jobs, 8 companies, users, applications)
    ├── storage.js           # Centralized LocalStorage CRUD manager with seed restoration
    ├── validation.js        # Input format validation, field error helpers, and HTML sanitization (XSS defense)
    ├── auth.js              # Session management, demo authentication, and role guard redirection
    ├── app.js               # Global controller (navbar auth state, mobile drawer, toasts, icons, formatters)
    ├── jobs.js              # Live multi-filter engine, search, sort, pagination, and apply modal logic
    ├── companies.js         # Companies directory filtering and company profile active jobs rendering
    ├── seeker-dashboard.js  # Seeker metrics, profile update, skill tag manager, and resume metadata
    └── employer-dashboard.js# Employer metrics, job CRUD, candidate reviews, and status change handler
```

---

## 🌟 Features Overview

### 1. Home Page (`index.html`)
- **Dynamic Header:** Adapts depending on authentication state (Guest sees Login/Register; Authenticated user sees Avatar dropdown with role badge and dashboard links).
- **Responsive Mobile Drawer:** Smooth slide-in navigation drawer with backdrop blur.
- **Hero Search Bar:** Search by keyword/skills and location with popular search query tags (Python, React, Data Analyst, Remote, TCS, Infosys).
- **Key Metrics Bar:** 25,000+ active jobs, 1,200+ employers, 500,000+ candidates.
- **Browse Categories:** Software Development, Data & AI, Cloud & DevOps, UI/UX Design, Marketing, Product Management.
- **Featured Jobs Grid:** Dynamically populated from storage with company logo badges, salaries, skills, and direct apply triggers.
- **Top Companies Section:** Verified enterprise cards (TCS, Infosys, Accenture, Wipro, Google, Microsoft, Amazon, Razorpay) with active job counts.
- **Footer:** 4-column layout with quick links, contact info, and a global **Reset Demo Data** button.

### 2. Jobs Listing & Filtering (`jobs.html`)
- **Multi-Criteria Dynamic Filters:**
  - Keyword search (title, company, or skills)
  - Location search (city, state, or remote)
  - Category dropdown
  - Job Type checkboxes: Full-Time, Part-Time, Internship, Contract
  - Experience Level checkboxes: Fresher, Junior, Mid-Level, Senior
  - Work Mode checkboxes: On-site, Remote, Hybrid
  - Minimum Salary range slider (₹0 to ₹30L+)
- **Sorting:** Newest First, Highest Salary, Job Title (A-Z).
- **Dynamic Pagination:** 6 jobs per page with interactive previous/next and page number controls.
- **Empty State:** Highlighting no results found with a single-click filter reset action.
- **Interactive Apply Modal:** Pre-fills seeker details, checks profile resume, captures cover note, validates inputs, and prevents duplicate applications.

### 3. Job Details Page (`job-details.html`)
- Accessible via query string (e.g., `job-details.html?id=job-1`).
- Displays full job description, bulleted responsibilities, requirements, and benefits.
- Quick facts sidebar: Salary package, experience required, work mode, and application deadline.
- About Company snapshot with verified badge.
- Similar jobs recommendation grid.
- Dynamic Save Job / Apply Now state handling.

### 4. Companies Directory & Details (`companies.html` & `company-details.html`)
- Filter companies by name, location, or industry category.
- Shows total active job count per company computed directly from live job listings.
- Dedicated company profile page displaying company history, size, website, and an active job list with one-click application links.

### 5. Authentication & Registration (`login.html` & `register.html`)
- **Role Selection:** Register as a Job Seeker or as an Employer (dynamically reveals company fields).
- **Form Validation:** Email regex, password length, password confirmation match, mobile number format, required fields, and Terms checkbox.
- **Duplicate Prevention:** Rejects duplicate email registrations against existing demo records.
- **Protected Route Guards:** Automatically redirects unauthenticated users or users with incorrect roles (e.g., a Job Seeker trying to access employer job posting).

### 6. Job Seeker Dashboard (`seeker-dashboard.html`)
- **Overview Metrics:** Total Applied, Under Review, Shortlisted, Selected/Hired, Saved Bookmarks.
- **Application History Table:** Tracks status badges across 5 stages:
  - `Applied` (Blue)
  - `Under Review` (Amber)
  - `Shortlisted` (Green)
  - `Selected (Hired)` (Emerald Bordered)
  - `Rejected` (Red)
- **Profile Editor:** Edit full name, headline, location, phone, and professional summary.
- **Skills Tag Manager:** Add or remove technical skill chips dynamically.
- **Resume Manager:** Upload simulation storing clean metadata (`fileName`, `fileSize`, `uploadDate`, ATS extraction preview) without polluting localStorage with heavy base64 strings.
- **Saved Bookmarks Tab:** Revisit, review, and apply to saved jobs.

### 7. Employer Dashboard & Job Management (`employer-dashboard.html` & `post-job.html`)
- **Overview Metrics:** Active Postings, Total Applicants, Shortlisted Candidates, Hired Count.
- **Manage Job Listings:** Table of posted jobs with applicant count, View, Edit, and Delete actions.
- **Edit Job Modal:** In-place modification of job specifications and compensation.
- **Candidate Pipeline:** View applicant details, cover notes, and attached resume names.
- **Live Status Selector:** Recruiters can update candidate status (`Applied` ➔ `Under Review` ➔ `Shortlisted` ➔ `Selected` ➔ `Rejected`). Changes immediately reflect across seeker dashboards!
- **Post a Job Form:** Comprehensive form validating title, category, type, work mode, salary range, deadline, skills, description, responsibilities, and qualifications.

### 8. About Us & Contact Us (`about.html` & `contact.html`)
- **About:** Comprehensive mission, vision, candidate advantages, and employer tools.
- **Contact:** Interactive form with full validation. Submissions are saved locally in `jobnest_contact_messages` and confirmed with live toast alerts.

---

## 🧪 Functional Testing Checklist (Verification Scenarios)

Follow this step-by-step test plan to verify all features:

### Test 1: Navigation & Responsiveness
1. Open `index.html`.
2. Resize browser window to mobile width (<768px). Click the hamburger icon `☰`.
3. Verify the mobile drawer opens smoothly and links navigate correctly. Close drawer.

### Test 2: Demo Login & Navbar Auth State
1. Go to `login.html`.
2. Click **"Job Seeker Demo"** 1-Click button. Notice credentials auto-fill and login succeeds.
3. Observe the navbar: The guest buttons are replaced by an avatar with initials ("AS"), role badge, and a dropdown menu.
4. Click "Sign Out". Notice you are logged out and return to guest state with a toast notification.

### Test 3: Registration & Duplicate Check
1. Go to `register.html`.
2. Select **"Employer"** radio pill. Observe the "Company Name" input dynamically appear.
3. Try registering with `seeker@demo.com`. Observe validation error: *"An account with this email address already exists."*
4. Enter unique details and submit. Observe successful registration and automatic redirection to the dashboard.

### Test 4: Job Search, Filtering & Sorting
1. Go to `jobs.html`.
2. Type **"Python"** into the search bar. Observe the list filter instantly to Python Developer at TCS.
3. Check the **"Remote"** checkbox under Work Mode. Observe that only remote positions are shown.
4. Drag the **Min. Salary** slider to ₹15L+. Notice that entry-level jobs are filtered out.
5. Click **"Reset All"**. Observe all jobs reappear with count updated.

### Test 5: Job Details & Bookmark Toggle
1. Click on **"Python Developer"** or visit `job-details.html?id=job-1`.
2. Verify all responsibilities, qualifications, and company overview appear.
3. Click **"Save Job"**. Toast confirms: *"Job saved to your bookmarks!"*
4. Go to `saved-jobs.html` or Seeker Dashboard `Saved Jobs` tab. Verify the job is bookmarked.

### Test 6: Job Application & Duplicate Guard
1. While logged in as `seeker@demo.com`, open `job-details.html?id=job-5` (Google Cloud Solutions Architect).
2. Click **"Apply Now"**. The modal opens pre-filled with candidate name, email, phone, and profile resume.
3. Enter a cover note and click **"Submit Application"**.
4. Observe success toast: *"Your job application has been submitted successfully!"*
5. Try clicking "Apply" on that job again. Observe the button is disabled with text *"Applied Already"*.
6. Go to `applications.html`. Confirm Google Cloud Solutions Architect is listed with status `Applied`.

### Test 7: Employer Candidate Review & Status Transition
1. Sign in as Employer (`employer@demo.com` / `password123`).
2. Go to `employer-dashboard.html` and click the **"View Applicants"** tab.
3. Locate Aarav Sharma's application.
4. Change the status dropdown from **"Applied"** to **"Shortlisted"** or **"Selected (Hired)"**. Toast confirms the update.
5. Sign out and sign back in as `seeker@demo.com`.
6. Open `applications.html`. Observe that the status badge has transitioned to the newly chosen status!

### Test 8: Employer Job Creation, Edit & Delete
1. In the Employer Dashboard, click **"Post New Job"** or open `post-job.html`.
2. Fill out the form and submit. Notice it is created and redirects to the new job page.
3. In `employer-dashboard.html` under **"Manage Jobs"**, click the **Edit** icon on any job. Change the title and save.
4. Click the **Delete** icon on a job. Confirm the alert. Observe the job is removed from the table and global listings.

### Test 9: Data Reset
1. Click **"Reset Demo Data"** in the top banner or footer anytime.
2. Confirm prompt. All localStorage keys are reset to the pristine initial seed dataset.

---

## 🔒 Demo Limitations & Production Architecture Notice

JobNest is designed as a standalone, zero-framework client-side application. The following highlights how a production environment would differ:

| Feature | Current Frontend Demo Implementation | Production Architecture Required |
| :--- | :--- | :--- |
| **Authentication** | Demo session stored in `localStorage` | Secure HTTP-only cookies, JSON Web Tokens (JWT), bcrypt password hashing on a server (Node.js/Go/Python). |
| **Data Persistence** | Browser `localStorage` (per browser instance) | Relational database (PostgreSQL, MySQL) with transactional ACID guarantees. |
| **Resume Storage** | File metadata only (size, name, date) | Cloud object storage (AWS S3, Google Cloud Storage) with signed download URLs. |
| **Email Alerts** | Simulated in localStorage & toast notifications | Transactional email provider (SendGrid, AWS SES, Resend) for real-time notifications. |
| **Role Authorization** | Client-side routing guards in JavaScript | Server-side API middleware validating user claims on every request. |

---

## 📄 License & Credits

- **Author:** Built for JobNest Job Portal
- **Stack:** Semantic HTML5, CSS3 Variables, Modern Vanilla JavaScript (ES6+)
- **Icons:** [Lucide Icons](https://lucide.dev/) (CDN)
- **Fonts:** [Google Fonts Inter](https://fonts.google.com/specimen/Inter)
