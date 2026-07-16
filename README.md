# Notes Binaried

A modern, full-stack notes management application with dark/light mode, JWT authentication, and a polished SaaS-grade UI.

- **Frontend**: Angular 19 (deployed on Vercel)
- **Backend**: Node.js + Express (deployed on Render)
- **Database**: MongoDB Atlas

## Folder Structure

```
notes-binaried/
├── client/                          # Angular frontend
│   ├── src/app/
│   │   ├── config/                  # API URL configuration
│   │   ├── guards/                  # AuthGuard for route protection
│   │   ├── interceptors/            # JWT token injection
│   │   ├── models/                  # TypeScript interfaces
│   │   ├── pages/                   # Login, Register, Dashboard, 404
│   │   ├── services/                # Auth, Note, Toast services
│   │   └── shared/components/       # Navbar, NoteCard, Dialog, Toast
│   ├── src/environments/            # Environment configs
│   ├── src/styles.css               # Global styles & CSS variables
│   ├── angular.json
│   ├── proxy.conf.json
│   └── package.json
├── server/                          # Express backend
│   ├── config/                      # MongoDB connection
│   ├── controllers/                 # Auth & Notes controllers
│   ├── middleware/                   # JWT auth & error handler
│   ├── models/                      # User & Note schemas
│   ├── routes/                      # API route definitions
│   ├── utils/                       # AppError class
│   ├── app.js                       # Express setup
│   ├── server.js                    # Entry point
│   └── .env
├── vercel.json                      # Vercel deployment config
├── render.yaml                      # Render deployment config
└── README.md
```

## Technologies

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 19, RxJS, Reactive Forms |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Styling | Custom CSS (Flexbox, Grid, CSS Variables) |
| Deployment | Vercel (frontend), Render (backend) |

## Local Setup

### Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB Atlas account

### 1. Clone

```bash
git clone <repo-url>
cd notes-binaried
```

### 2. Backend

```bash
cd server
npm install
```

Create `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/notes-app?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:4200
```

Start:
```bash
npm run dev
```

Server runs on http://localhost:5000.

### 3. Frontend

```bash
cd client
npm install
ng serve
```

App runs on http://localhost:4200. API calls are proxied to the backend via `proxy.conf.json`.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Log in |
| GET | /api/auth/me | Yes | Current user |
| GET | /api/notes | Yes | All user notes |
| GET | /api/notes/:id | Yes | Single note |
| POST | /api/notes | Yes | Create note |
| PUT | /api/notes/:id | Yes | Update note |
| DELETE | /api/notes/:id | Yes | Delete note |
| GET | /api/health | No | Health check |

## Environment Variables

### Backend (server/.env)

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB Atlas connection string | Required |
| JWT_SECRET | JWT signing secret | Required |
| JWT_EXPIRES_IN | Token expiry | 7d |
| CLIENT_URL | CORS allowed origin | http://localhost:4200 |

### Frontend

API URL is configured in `client/src/app/config/api.config.ts`:
- Development: `/api` (proxied to localhost:5000)
- Production: `https://notes-binaried.onrender.com/api`

## Deployment

### Deploy Backend to Render

1. Push the repo to GitHub.
2. Go to [render.com](https://render.com) and create a **New Web Service**.
3. Connect your GitHub repo.
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add environment variables: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`.
6. Deploy.

The `render.yaml` file at the project root can also be used for **Blueprint** deployments.

### Deploy Frontend to Vercel

1. Push the repo to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repo.
3. Configure:
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `dist/client/browser`
4. Deploy.

The `vercel.json` file at the project root auto-configures the build.

### MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas).
2. Go to **Database Access** and create a database user.
3. Go to **Network Access** and add your IP (or 0.0.0.0/0 for dev).
4. Click **Connect** -> **Connect your application** and copy the connection string.
5. Replace `<user>`, `<password>`, and `<cluster>` in the connection string.

## Live Demo

- **Frontend**: https://notes-binaried.vercel.app (to be updated after deployment)
- **Backend**: https://notes-binaried.onrender.com (to be updated after deployment)

## Design

- Dark mode default with light mode toggle
- Glassmorphism navbar with backdrop blur
- Background gradient blob animations
- Split-screen auth pages with hero section
- Horizontal snap-scroll carousel for notes
- Skeleton loaders with shimmer animation
- CSS variables for theming (200+ design tokens)
- Fully responsive (mobile, tablet, desktop)
- Zero UI framework dependencies (pure CSS)

## Future Improvements

- Rich text editor
- Categories and tags
- Search functionality
- Pagination
- File uploads
- Note sharing
- Dark/light mode system preference detection

## License

MIT
