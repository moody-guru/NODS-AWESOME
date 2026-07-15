# Notes Binaried

A modern, full-stack notes management application built with Angular 19, Express.js, and MongoDB Atlas. Features JWT authentication, CRUD operations, and a polished glassmorphism UI.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 19 (Standalone Components, Reactive Forms) |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Styling | Custom CSS (Flexbox, Grid, Glassmorphism) |

## Folder Structure

```
notes-binaried/
├── client/                          # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── guards/              # Route guards (AuthGuard)
│   │   │   ├── interceptors/        # HTTP interceptors (JWT injection)
│   │   │   ├── models/              # TypeScript interfaces
│   │   │   ├── pages/
│   │   │   │   ├── dashboard/       # Main notes CRUD page
│   │   │   │   ├── login/           # Login page
│   │   │   │   ├── not-found/       # 404 page
│   │   │   │   └── register/        # Register page
│   │   │   ├── services/            # Auth, Note, Toast services
│   │   │   └── shared/
│   │   │       └── components/
│   │   │           ├── confirmation-dialog/
│   │   │           ├── navbar/
│   │   │           ├── note-card/
│   │   │           └── toast/
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css               # Global CSS variables & resets
│   ├── angular.json
│   ├── proxy.conf.json              # API proxy configuration
│   └── package.json
│
├── server/                          # Express backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Register, Login, GetMe
│   │   └── noteController.js        # CRUD operations
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   └── errorHandler.js          # Centralized error handling
│   ├── models/
│   │   ├── Note.js                  # Note schema
│   │   └── User.js                  # User schema (bcrypt hashing)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── noteRoutes.js
│   ├── utils/
│   │   └── AppError.js              # Custom error class
│   ├── app.js                       # Express app setup
│   ├── server.js                    # Server entry point
│   ├── .env                         # Environment variables
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation

### Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB Atlas account (free tier)

### 1. Clone the repository

```bash
git clone <repo-url>
cd notes-binaried
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/notes-app?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
```

Start the server:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd client
npm install
ng serve
```

The app proxies `/api` requests to `localhost:5000` automatically via the proxy config.

Open `http://localhost:4200` in your browser.

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create a new account | No |
| POST | `/api/auth/login` | Log in | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Notes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notes` | Get all user notes | Yes |
| GET | `/api/notes/:id` | Get a single note | Yes |
| POST | `/api/notes` | Create a new note | Yes |
| PUT | `/api/notes/:id` | Update a note | Yes |
| DELETE | `/api/notes/:id` | Delete a note | Yes |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

### Request/Response Examples

**Register:**

```json
// POST /api/auth/register
// Request
{ "name": "John", "email": "john@example.com", "password": "password123" }

// Response (201)
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "name": "John", "email": "john@example.com" }
}
```

**Create Note:**

```json
// POST /api/notes
// Request (Authorization: Bearer <token>)
{ "title": "My Note", "content": "This is the content." }

// Response (201)
{
  "success": true,
  "note": { "_id": "...", "title": "My Note", "content": "This is the content.", "user": "...", "createdAt": "...", "updatedAt": "..." }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string | Required |
| `JWT_SECRET` | Secret key for signing tokens | Required |
| `JWT_EXPIRES_IN` | Token expiration duration | `7d` |
| `CLIENT_URL` | CORS allowed origin | `http://localhost:4200` |

## Design Choices

- **Standalone Components**: All Angular components are standalone (no NgModules) for simplicity and tree-shaking.
- **Lazy Loading**: Each page is lazy-loaded via `loadComponent` in the router.
- **Reactive Forms**: Form validation with Angular Reactive Forms.
- **BehaviorSubject**: Services use `BehaviorSubject` for reactive state management.
- **CSS-only Styling**: No UI framework — custom CSS with CSS variables, Flexbox, and Grid.
- **Glassmorphism Navbar**: Navbar uses `backdrop-filter: blur()` for a modern glass effect.
- **Smooth Animations**: Cards have subtle hover transforms, modals have scale/fade transitions, toasts slide in.
- **Centralized Error Handling**: Backend uses a custom `AppError` class and middleware for consistent error responses.
- **Mongoose Indexes**: Notes are indexed by `(user, createdAt)` for efficient queries.

## Future Improvements

The architecture is designed to accommodate these features without major refactoring:

- Categories & Tags (add fields to Note model, filter UI)
- Rich text editor (swap textarea for a WYSIWYG)
- Search functionality (add query param to GET /api/notes)
- Pagination (add skip/limit to GET /api/notes)
- File uploads (multer + cloud storage)
- Note sharing (add sharedWith field, permissions)
- Dark mode (CSS variables toggle)
- PWA support (Angular service worker)

## License

MIT
