# ByteContest

A comprehensive online coding contest platform built with React, TypeScript, Node.js, and MongoDB.

## Features

- **User Authentication**: Secure login/register system with JWT tokens
- **Contest Management**: Create and manage coding contests
- **Problem Management**: Add, edit, and organize coding problems
- **Real-time Code Execution**: Integrated Judge0 API for code compilation and testing
- **Leaderboard**: Real-time contest rankings and performance tracking
- **Assignment System**: Create assignments for students
- **Admin Dashboard**: Comprehensive admin panel for contest management
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router
- Monaco Editor (Code Editor)

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- Cookie Parser
- CORS

### External APIs
- Judge0 API (Code execution)
- RapidAPI

## Project Structure

```
ByteContest/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── api/           # API service functions
│   │   ├── store/         # Redux store configuration
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── server/                # Backend Node.js application
    ├── src/
    │   ├── controllers/   # Route controllers
    │   ├── models/        # MongoDB models
    │   ├── routes/        # API routes
    │   ├── middleware/    # Custom middleware
    │   ├── functions/     # Business logic functions
    │   └── utils/         # Utility functions
    └── config/            # Configuration files
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- RapidAPI account (for Judge0 API)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/KushalP47/ByteContest.git
cd ByteContest
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. **Environment Configuration**

Create a `.env` file in the `server` directory:
```env
MONGODB_URI=your_mongodb_connection_string
DB_NAME=your_database_name
ACCESS_TOKEN_SECRET=your_jwt_secret
ACCESS_TOKEN_EXPIRY=5h
PORT=8000
RAPIDAPI_URL=https://judge0-ce.p.rapidapi.com
RAPIDAPI_HOST=judge0-ce.p.rapidapi.com
RAPIDAPI_KEY=your_rapidapi_key
```

4. **Start the development servers**

```bash
# Start backend server (from server directory)
cd server
npm run dev

# Start frontend server (from client directory)
cd client
npm run dev
```

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Admin Features** (if admin):
   - Create contests
   - Add coding problems
   - Manage users
   - View contest analytics
3. **Student Features**:
   - Join contests
   - Solve problems
   - Submit code
   - View leaderboard
   - Track performance

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout

### Contests
- `GET /api/v1/contests` - Get all contests
- `POST /api/v1/contests/create` - Create new contest
- `GET /api/v1/contests/:contestId` - Get specific contest
- `PUT /api/v1/contests/:contestId` - Update contest
- `POST /api/v1/contests/signIn/:contestId` - Sign in to contest

### Problems
- `GET /api/v1/problems` - Get all problems
- `POST /api/v1/problems/create` - Create new problem
- `GET /api/v1/problems/:problemId` - Get specific problem
- `PUT /api/v1/problems/:problemId` - Update problem

### Code Execution
- `POST /api/v1/judge/submit` - Submit code for execution
- `POST /api/v1/judge/storeSubmission` - Store submission results
- `GET /api/v1/judge/getSubmissions` - Get user submissions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@bytecontest.com or create an issue in the repository.