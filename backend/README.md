# Foodflow Backend

Foodflow Backend API - Email OTP Authentication System for Food Delivery Platform.

## Features

- Email-based OTP authentication
- JWT token-based authorization
- MongoDB database integration
- Gmail SMTP for email delivery
- RESTful API design
- Input validation
- Error handling

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/Foodflow_backend?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
FRONTEND_URL=https://your-frontend-url.com
```

## Installation

```bash
npm install
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/send-otp` | Send OTP to email |
| POST | `/api/auth/verify-otp` | Verify OTP and login/register |
| POST | `/api/auth/register` | Register with email and password |
| POST | `/api/auth/login` | Login with email and password |
| POST | `/api/auth/check-email` | Check if email exists |

## API Examples

### Send OTP
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "otp": "123456"}'
```

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123", "name": "John Doe"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

## Deployment on Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure environment variables
4. Build Command: `cd backend && npm install`
5. Start Command: `cd backend && npm start`

## License

MIT
