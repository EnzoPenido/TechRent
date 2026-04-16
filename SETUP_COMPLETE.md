# TechRent - Setup Complete ✓

## Current Status
- ✓ Backend: Running on http://localhost:3001
- ✓ Frontend: Running on http://localhost:3000
- ✓ Database: MySQL on localhost:3307
- ✓ Database Tables: Created
- ✓ Test Users: Seeded

## Test Credentials
Use any of these accounts to test the application:

### Admin Account
- Email: `admin@test.com`
- Password: `admin123`
- Role: Admin

### Técnico Account
- Email: `tecnico@test.com`
- Password: `admin123`
- Role: Técnico

### Cliente Account
- Email: `cliente@test.com`
- Password: `admin123`
- Role: Cliente

## How to Login
1. Open http://localhost:3000/login in your browser
2. Enter an email and password from above
3. Click "Entrar"
4. You should be redirected to the dashboard

## Backend Routes
- POST `/auth/login` - Authenticate user
- POST `/auth/registro` - Register new user
- GET `/equipamentos` - List equipment
- POST `/chamados` - Create new ticket
- GET `/chamados` - List tickets

## Troubleshooting

### Backend not responding
1. Check if MySQL is running: `Get-Service MySQL80`
2. Check if Node process is running: `Get-Process node`
3. Start backend: `cd backend && node server.js`

### Database connection errors
- MySQL is running on port 3307 (not default 3306)
- Database name: `techrent_db`
- Database user: `root`
- Database password: `senai@123`

### Frontend not running
- Start frontend: `cd frontend && npm run dev`
- Frontend runs on http://localhost:3000

## Database Setup
Database and tables are automatically created when the app starts.
To seed test users, run: `node backend/add-test-users.js`
