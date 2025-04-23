# GrievanceBox Backend

This is the backend server for the GrievanceBox application, handling grievance submissions, management, and email notifications.

## Features

- RESTful API for grievance management
- Email notifications for grievance status updates
- MongoDB database integration
- User authentication (coming soon)

## Folder Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Express middlewares
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── .env                 # Environment variables (create this - not in repo)
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- MongoDB

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd grievance-box/backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root of the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/grievancebox
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   NODE_ENV=development
   ```

### Running the Server

Development mode:

```
npm run dev
```

Production mode:

```
npm start
```

## API Endpoints

### Grievances

- `POST /grievance` - Create a new grievance
- `GET /grievance/all` - Get all grievances
- `GET /grievance/:applicationNumber` - Get grievance by application number
- `PATCH /grievance/:applicationNumber/resolve` - Mark grievance as resolved
- `PATCH /grievance/:applicationNumber/reject` - Reject a grievance
- `PATCH /grievance/:applicationNumber/scrutiny` - Mark grievance as under scrutiny
- `DELETE /grievance` - Delete all grievances (admin only)

### Email

- `POST /send-verification-email` - Send verification email to department

## License

This project is licensed under the ISC License.
