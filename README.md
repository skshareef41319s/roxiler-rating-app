# ⭐️ ROXILER PROJECT

A full-stack web application for store ratings, supporting multiple user roles (Admin, Owner, User).  
Built for the **FullStack Intern Coding Challenge**.

---

## 🚀 Tech Stack

- **Backend:** Express.js (Node.js)
- **Database:** MySQL (uses Prisma ORM)
- **Frontend:** React.js

---

## 📁 Project Structure

```
roxiler-backend/    # Express.js backend, Prisma ORM
roxiler-frontend/   # React.js frontend
```
See full file tree below.

---

## 🎯 Requirements & Purpose

Build a web app for users to submit ratings for stores registered on the platform.  
Ratings are between **1** and **5**.  
A single login system is used for all users, with role-based access.

---

## 👥 User Roles

- System Administrator
- Normal User
- Store Owner

---

## ⚡ Functionalities

### 🛡️ System Administrator

- Add new stores, users, owners, and admins.
- Dashboard displays:
  - Total users
  - Total stores
  - Total ratings
- Add new users (Name, Email, Address, Password, Role).
- List & manage stores (Name, Owner, Address, Rating).
- List & manage users (Name, Email, Address, Role).
- View details for all users, including their ratings/stores.
- Delete stores/users (except self).
- Logout.

### 🙋 Normal User

- Sign up & log in.
- **Signup form:** Name, Email, Address, Password.
- Update password after login.
- View/search all stores (by Name/Address).
- Store listings show:
  - Store Name, Address
  - Overall Rating
  - User's Submitted Rating
  - Option to submit/modify rating
- Submit ratings (1-5) for stores via a star-based UI.
- Logout.

### 🏬 Store Owner

- Log in.
- Update password after login.
- Dashboard shows:
  - List of users who rated their store
  - Average rating of their store
- Logout.

---

## ✅ Form Validations

- **Name:** Min 20, Max 60 chars.
- **Address:** Max 400 chars.
- **Password:** 8-16 chars, at least one uppercase & special character.
- **Email:** Standard email rules.

---

## 📦 Full File Tree

```
ROXILER PROJECT
├── roxiler-backend/
│   ├── node_modules/ 🚫 (auto-hidden)
│   ├── prisma/
│   │   ├── migrations/
│   │   │   ├── 20250822170045_init/
│   │   │   │   └── migration.sql
│   │   │   └── migration_lock.toml
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── admin.js
│   │   │   ├── auth.js
│   │   │   ├── owner.js
│   │   │   ├── stores.js
│   │   │   └── user.js
│   │   ├── utils/
│   │   │   └── validators.js
│   │   ├── app.js
│   │   ├── prisma.js
│   │   └── server.js
│   ├── .env 🚫 (auto-hidden)
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── roxiler-api.postman_collection.json
└── roxiler-frontend/
    ├── .git/ 🚫 (auto-hidden)
    ├── node_modules/ 🚫 (auto-hidden)
    ├── public/
    │   ├── favicon.ico
    │   ├── index.html
    │   ├── logo192.png
    │   ├── logo512.png
    │   ├── manifest.json
    │   └── robots.txt
    ├── src/
    │   ├── pages/
    │   │   ├── AdminDashboard.js
    │   │   ├── LoginPage.js
    │   │   ├── LogoutButton.js
    │   │   ├── OwnerDashboard.js
    │   │   ├── SignupPage.js
    │   │   ├── UpdatePassword.js
    │   │   └── UserDashboard.js
    │   ├── App.css
    │   ├── App.js
    │   ├── App.test.js
    │   ├── api.js
    │   ├── index.css
    │   ├── index.js
    │   ├── logo.svg
    │   ├── reportWebVitals.js
    │   └── setupTests.js
    ├── .gitignore
    ├── README.md
    ├── package-lock.json
    └── package.json
```

---

## 🖥️ UI Features

- **Premium look:** Glassmorphism, smooth gradients, animated buttons.
- **Star-based rating:** Users rate stores by clicking stars, with visual gold fill.
- **Role-based dashboards:** Each user sees tailored UI and actions.
- **Responsive design.**

---

## 🏁 Getting Started — Run This Project from GitHub (For Beginners)

If you’re new and only have **VS Code** installed, follow these step-by-step instructions:

---

### 1. Clone the Repository

Open VS Code, press <kbd>Ctrl</kbd> + <kbd>`</kbd> (backtick) to open the terminal, and run:

```bash
git clone https://github.com/skshareef41319s/roxiler-project.git
cd roxiler-project
```

---

### 2. Install Node.js

- Download and install **Node.js** (includes npm) from [nodejs.org](https://nodejs.org/en/download).
- After installation, restart VS Code.

---

### 3. Set Up the Backend

```bash
cd roxiler-backend
npm install
```

#### 3.1. Configure the Database

- Install **PostgreSQL** or **MySQL** locally ([PostgreSQL Download](https://www.postgresql.org/download/) | [MySQL Download](https://dev.mysql.com/downloads/installer/)).
- Create an empty database (e.g., `roxiler_db`).

- In `roxiler-backend/.env` (create this file if missing), add:

  ```
  DATABASE_URL="mysql://username:password@localhost:3306/roxiler_db"
  JWT_SECRET="yoursecretkey"
  ```

#### 3.2. Run Migrations and Seed Data

```bash
npx prisma migrate dev --name init
node prisma/seed.js
```

#### 3.3. Start the Backend Server

```bash
npm start
```

Your backend API will run at `http://localhost:4000`.

---

### 4. Set Up the Frontend

Open a new terminal tab/window in VS Code and run:

```bash
cd ../roxiler-frontend
npm install
npm start
```

Your React app will run at `http://localhost:3000`.

---

### 5. Access the App

- Open your browser and go to `http://localhost:3000`
- You can now use the application!

---

### 6. Common Issues & Solutions

- **Port already in use:** Use a different port (change in `package.json` or `.env`).
- **Database errors:** Check your database credentials and make sure the database server is running.
- **Missing .env file:** Create it and copy the sample above.
- **npm not recognized:** Make sure Node.js and npm are installed.
- **Prisma errors:** Run `npx prisma generate`
- **Seed not running?** Make sure the DB is created and accessible.

---

### 7. Useful VS Code Extensions

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)

---

### 8. Explore & Edit

- All project files are ready in VS Code.
- You can explore backend code in `roxiler-backend/src/`
- You can explore frontend code in `roxiler-frontend/src/pages/`

---

## 🔑 Default Logins & How To Login (Demo/Test Accounts)

> **For development or demo purposes, use the following credentials.  
> You can change these in `prisma/seed.js` before running `node prisma/seed.js`.**

| Role   | Email              | Password    |
|--------|--------------------|------------|
| Admin  | admin@roxiler.com  | Admin@123  |
| Owner  | owner@shop.com     | Owner@123  |

- **User:** Register any new user via the Signup page.  
- **Admin/Owner:** Provided via seed data for quick demo access.
- **To add more Admins/Owners:** Use the "Add User" form from the Admin dashboard and select the desired role.

---

## 📝 Additional Notes

- Tables support sorting for key fields (Name, Email, etc.).
- Best practices used for frontend & backend.
- Database schema follows best practices.
- All features validated as per challenge requirements.

---

## 🧑‍💻 Author

- [skshareef41319s](https://github.com/skshareef41319s)

---

## 💡 License

This project is for learning and demo purposes (FullStack Intern Coding Challenge).
