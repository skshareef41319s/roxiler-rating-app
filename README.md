# ROXILER PROJECT

A full-stack web application for store ratings that supports multiple user roles (Admin, Owner, User). This repository contains a React frontend and a Python backend that implements REST APIs for authentication, store management, and ratings. The app was built as part of the FullStack Intern Coding Challenge.

## Summary

Users can sign up and rate stores from 1 to 5 stars. Role-based access controls give admins the ability to manage users and stores and owners a dashboard to view the ratings for their store. The frontend is a React app and the backend is implemented in Python (FastAPI), using SQLAlchemy for ORM and Alembic for migrations. MySQL (or MariaDB) is used as the relational database.

---

## Features

- Role-based authentication and session management (Admin, Owner, User)
- Admin dashboard: manage users, stores, and view totals (users, stores, ratings)
- User flows: signup, login, search stores, submit and modify ratings (1–5 stars)
- Owner flows: view ratings for their store and see average score
- Store CRUD with image uploads (configurable storage)
- Validation rules for forms (name, address, password, email)
- Seed script to create demo accounts and initial data
- REST API backend and React frontend kept in separate folders

---

## Tech stack

- Backend: Python, FastAPI
- ORM & migrations: SQLAlchemy + Alembic
- Database: MySQL / MariaDB
- Frontend: React.js (Create React App)
- Authentication: JWT (or session-based, configurable)
- Optional: Cloud storage for images (S3 / Cloudinary)
- Development tools: pip, node, npm/yarn, uvicorn

---

## Project structure

```
roxiler-project/
├── roxiler-backend/      # FastAPI backend (Python)
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin.py
│   │   │   ├── auth.py
│   │   │   ├── owner.py
│   │   │   ├── stores.py
│   │   │   └── user.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   └── main.py       # FastAPI app factory
│   ├── alembic/          # Alembic migration scripts
│   ├── seed.py           # Optional seeding script
│   ├── requirements.txt
│   └── .env.example
├── roxiler-frontend/     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── api.js
│   ├── package.json
│   └── README.md
└── README.md             # This file
```

---

## Getting started — run the project locally

These steps will get both backend and frontend running on your machine for development.

Prerequisites
- Python 3.9+ (3.10 recommended)
- Node.js 16+ and npm or yarn
- MySQL or MariaDB running locally (or a managed instance)

1. Clone the repository
```bash
git clone https://github.com/skshareef41319s/roxiler-project.git
cd roxiler-project
```

2. Backend setup
```bash
cd roxiler-backend

# create virtual environment (recommended)
python -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows (PowerShell)
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

3. Configure environment variables

Copy the example and update:
```bash
cp .env.example .env
```
Edit `.env` with your DB credentials and other secrets, for example:
```
DATABASE_URL=mysql+pymysql://dbuser:dbpass@localhost:3306/roxiler_db
SECRET_KEY=your_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

4. Run migrations and seed data

Generate and apply migrations with Alembic:
```bash
alembic upgrade head
```
(Optional) Populate demo accounts and sample stores:
```bash
python seed.py
```

5. Start the backend
```bash
# using uvicorn
uvicorn app.main:app --reload --port 8000
```
The API will be available at: `http://localhost:8000`

6. Frontend setup
Open a new terminal and run:
```bash
cd roxiler-frontend
npm install
npm start
```
The React app will run by default at `http://localhost:3000`.

---

## Default demo credentials

(These are created by the `seed.py` script. Change them before deploying.)

- Admin: admin@roxiler.com / Admin@123
- Owner: owner@shop.com / Owner@123

To add or change demo accounts, edit `roxiler-backend/seed.py` before running the seed script.

---

## Validation rules

- Name: 20–60 characters
- Address: up to 400 characters
- Password: 8–16 characters, at least one uppercase letter and one special character
- Email: standard format validation

---

## Common issues & troubleshooting

- Database connection errors: ensure MySQL is running and `DATABASE_URL` is correct.
- Alembic errors: run `alembic revision --autogenerate -m "message"` if you change models, then `alembic upgrade head`.
- Frontend CORS: the backend should enable CORS for `http://localhost:3000` in development.
- Ports in use: change ports via `.env` (backend) or `package.json` (frontend).

---

## Development tips

- Use the FastAPI interactive docs at `http://localhost:8000/docs` to explore and test APIs.
- Use a tool such as Postman or Insomnia for manual API testing.
- Use `uvicorn --reload` for development to auto-reload on code changes.
- Use `npx create-react-app` tools and React devtools when updating frontend components.

---

## Recommended VS Code extensions

- Python
- Pylance
- ESLint
- Prettier
- Prisma (if using in other projects)
- Reactjs code snippets

---

## Contributing

Contributions are welcome. Suggested workflow:
1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit, push, and open a pull request

Please include tests or verification steps for changes affecting authentication, rating calculations, or migrations.

---

## License

This project is provided for learning and demonstration purposes. Add a LICENSE file (MIT recommended) to make the terms explicit.

---

## Contact

Author: skshareef41319s  
GitHub: https://github.com/skshareef41319s
