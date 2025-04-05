# JobSearch API

## Project Overview
JobSearch API is a Node.js-based backend application built to power a modern job search platform. It supports user authentication, job listings, company management, and real-time communication between users and HR representatives.

## Features
- **User Authentication**: Email and Google-based sign up/login with JWT tokens.
- **Profile Management**: Users can update personal info, profile/cover pictures, and soft-delete their account.
- **Company Management**: Companies can be created, updated, and soft deleted. Admins can approve or ban companies.
- **Job Listings**: Company HRs can post jobs with filters for location, skills, and seniority. Users can apply and track jobs.
- **Applications**: Manage job applications with pagination, and notify applicants via email.
- **Admin Dashboard**: GraphQL-powered dashboard for managing users and companies.
- **Real-time Chat**: Built with Socket.IO for HR-to-user messaging.
- **Task Scheduling**: Automated cleanup for expired OTPs using `node-cron`.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT, Google OAuth, Bcrypt, OTP via Nodemailer
- **File Uploads**: Multer + Cloudinary
- **Security**: Helmet, CORS, Rate Limiting, Encrypted Fields
- **GraphQL**: GraphQL, graphql-http, playground middleware
- **Real-time Messaging**: Socket.IO
- **Scheduling**: node-cron

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/jobsearch-api.git
   ```
2. Navigate to the directory:
   ```bash
   cd jobsearch-api
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables in a `.env` file:

## Running the Project
To run the app in development mode:
```bash
npm run dev
```

## Documentation
- 📬 **Postman Collection**: [API Documentation via Postman](https://documenter.getpostman.com/view/32908076/2sB2cUAi6N)
- 🧠 **GraphQL Docs**: Available via GraphQL Playground at `/graphql/playground`
