# Global Visa Hub Backend

Express.js + MongoDB API for the Next.js visa consultancy frontend. Public consultation requests are stored in MongoDB. If SMTP is configured, the admin also receives an email. Admin and team logins use JWT.

## Setup
1. Install Node.js 20+ and have MongoDB local or MongoDB Atlas ready.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and fill in the settings.
4. Add your Next.js origin to `CLIENT_ORIGINS`, usually `http://localhost:3000`.
5. Set `MONGODB_URI` to your MongoDB connection string and choose a long unique `JWT_SECRET`.

### Email setup (Gmail example)
- Use a Gmail account with 2-Step Verification enabled.
- Create a Google App Password and use it as `SMTP_PASS`. Do not use your normal Gmail password.
- Set `SMTP_USER` and `MAIL_FROM` to the sender address, and `ADMIN_NOTIFICATION_EMAIL` to the inbox that should receive leads.
- Keep `SMTP_PORT=465` and `SMTP_SECURE=true` for this configuration.
- If SMTP fails, the inquiry is still saved in MongoDB. Check server logs and the admin API.

### Create the first admin
Temporarily add these to `.env`:
```
ADMIN_NAME=Your Name
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=use-a-unique-password-at-least-12-characters
```
Then run `npm run create-admin`. Remove `ADMIN_PASSWORD` from `.env` after creating the admin. Never commit `.env` or share passwords.

### Run locally
`npm run dev`
Health check: `http://localhost:5000/api/health`

## Connect the Next.js form
In the Next.js project create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Restart the Next.js dev server after changing it. Your form submit handler should POST JSON to `${process.env.NEXT_PUBLIC_API_URL}/inquiries`:
```js
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inquiries`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, phone, destination, service, message })
});
const result = await response.json();
if (!response.ok) throw new Error(result.message || "Request failed");
```
Required fields: `name`, `email`, `phone`, `destination`, `service`. Destination must be one of `USA`, `Canada`, `UK`, `Australia`, `New Zealand`, `Other`. Service must be one of `Student Visa`, `University Admission`, `Visitor Visa`, `Work Visa`, `Immigration Consultation`, `Other`.

## API endpoints
- `GET /api/health` public health check
- `POST /api/inquiries` public consultation submission
- `POST /api/auth/login` body `{ "email": "...", "password": "..." }`
- `GET /api/auth/me` requires `Authorization: Bearer TOKEN`
- `GET /api/admin/dashboard` authenticated admin/team summary
- `GET /api/admin/inquiries?page=1&limit=20&status=new` authenticated; team sees only assigned inquiries
- `PATCH /api/admin/inquiries/:id` update status; admin may also assign with `{ "assignedTo": "TEAM_MEMBER_ID" }`
- `GET /api/admin/team` admin only
- `POST /api/admin/team` admin only; body `{ "name": "...", "email": "...", "password": "minimum 12 characters" }`
- `PATCH /api/admin/team/:id` admin only; body `{ "active": false }`
- `GET /api/inquiries?page=1&limit=20` admin only

Statuses: `new`, `contacted`, `in_progress`, `completed`, `rejected`.

## Deployment
Deploy as a Node.js web service on a host that supports Express. Configure every `.env` variable in the provider's environment settings. Set `CLIENT_ORIGINS` to the exact deployed Next.js domain, and set the frontend `NEXT_PUBLIC_API_URL` to the deployed backend URL plus `/api`. Free plans may sleep or have resource limits, so check current provider terms. Never put database passwords, SMTP credentials, or JWT secrets in any `NEXT_PUBLIC_` variable.

The API is ready for a Next.js dashboard to consume; the dashboard UI itself is a separate frontend task. Use HTTPS in production and back up the database.
