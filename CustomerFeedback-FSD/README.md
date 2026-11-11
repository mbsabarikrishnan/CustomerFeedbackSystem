# Customer Feedback Management System (MERN)

Beginner-friendly full-stack project using MongoDB Atlas, Express, React and Node.js.

## Features
- Customer name, 10-digit Indian mobile number, 1–5 star rating and feedback comment.
- Required-field and mobile-number validation in React and Express.
- Success/error messages.
- Manager page reads saved feedback from MongoDB Atlas.
- Feedback remains saved after refreshing the browser.

## Requirements
Install Node.js and npm. Use VS Code and create a free MongoDB Atlas cluster.

## 1. Configure MongoDB Atlas
1. Sign in at https://www.mongodb.com/cloud/atlas and create a free cluster.
2. Create a database user (username and password).
3. In Network Access, add your current IP address for development.
4. Open the cluster, choose Connect → Drivers, and copy the connection string.
5. Copy `server/.env.example` to `server/.env`.
6. Replace the sample MONGODB_URI with your Atlas connection string. Include a database name such as `customer_feedback`. URL-encode special characters such as `@`, `:`, `/`, or `#` in the database user's password.
7. Keep `.env` private. Never upload it to GitHub.

Example:
`MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/customer_feedback?retryWrites=true&w=majority`

## 2. Start the backend
Open a VS Code terminal:
```bash
cd server
npm install
npm run dev
```
You should see MongoDB connected and the server running at http://localhost:5000.
Check `http://localhost:5000/api/health`.

## 3. Start the frontend
Open a SECOND VS Code terminal:
```bash
cd client
npm install
npm run dev
```
Open the local URL Vite prints, usually http://localhost:5173.
Keep both terminals running.

## How it works
1. React sends form data to POST `/api/feedback`.
2. Express validates the data.
3. Mongoose saves the record in MongoDB Atlas.
4. Manager page requests GET `/api/feedback` and displays saved records.

## Main files
- `client/src/App.jsx`: React form, page switching, API calls and feedback list.
- `client/src/App.css`: page design.
- `client/src/main.jsx`: starts React.
- `server/server.js`: Express server and MongoDB connection.
- `server/models/Feedback.js`: MongoDB document structure.
- `server/routes/feedbackRoutes.js`: GET and POST API endpoints.
- `server/.env.example`: sample configuration.

## Troubleshooting
- MongoDB connection error: check Atlas username/password, connection string and IP allowlist.
- `authentication failed`: reset the database user password in Atlas, update `PASSWORD` in `server/.env`, and URL-encode special characters. Keep real credentials out of `.env.example`.
- MONGODB_URI missing: ensure `server/.env` exists (not `.env.txt`) and restart backend.
- Failed to fetch: ensure backend is running on port 5000.
- Port in use: close the other process using that port.

## Learning/demo note
There is no login or manager authentication in this beginner project. Do not expose the manager page publicly with real customer data until authentication and production security are added. Mobile validation checks format only; it does not verify number ownership.
