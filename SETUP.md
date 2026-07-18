# Barangay Bakilid Client Setup

## Features Implemented

### 1. Authentication System
- Login with email and password
- JWT token management
- Protected routes
- Auto-redirect on token expiration

### 2. Resident Dashboard
- View all document requests
- Create new document requests
- View announcements
- Statistics overview
- Real-time status updates

### 3. API Integration (Axios)
- Centralized API service (`src/services/api.js`)
- Automatic token injection
- Error handling and interceptors
- CORS-ready for backend communication

## File Structure

```
src/
├── components/
│   ├── protectedRoute.tsx    # Route protection
│   └── ui/                    # Reusable UI components
├── context/
│   └── AuthContext.jsx        # Authentication state management
├── pages/
│   ├── landingpage.jsx        # Public landing page
│   ├── loginpage.jsx          # Login page with backend integration
│   └── dashboard.jsx          # Resident dashboard
├── services/
│   └── api.js                 # Axios API service
└── App.tsx                    # Main app with routing
```

## API Endpoints Used

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Requests
- `GET /api/requests` - Get all user requests
- `POST /api/requests` - Create new request
- `GET /api/requests/:id` - Get request by ID

### Announcements
- `GET /api/announcements` - Get all announcements

## Testing Accounts

Use these accounts from your seeded database:

### Resident Account
- **Email:** maria.santos@email.com
- **Password:** resident123

### Admin Account
- **Email:** admin@bakilid.gov.ph
- **Password:** admin123

### Staff Account
- **Email:** staff@bakilid.gov.ph
- **Password:** staff123

## Running the Application

### 1. Start the Backend Server
```bash
cd barangay_server
npm start
```
Server runs on: http://localhost:5000

### 2. Start the Frontend Client
```bash
cd barangay_client
npm run dev
```
Client runs on: http://localhost:5173

## How to Test

1. **Visit Landing Page**
   - Go to http://localhost:5173
   - Click "Login" button

2. **Login**
   - Use email: maria.santos@email.com
   - Password: resident123
   - Click "Sign In to Portal"

3. **Dashboard**
   - View your statistics
   - Create a new document request
   - View announcements
   - Logout when done

## Features in Dashboard

### Statistics Cards
- Total Requests
- Pending Requests
- Completed Requests

### Document Requests Section
- View all your requests
- Status badges (Pending, Processing, Ready for Release, Claimed, Rejected)
- Create new requests with modal form
- Document types: Barangay Clearance, Certificate of Residency, Indigency Certificate, Business Permit

### Announcements Section
- View latest barangay announcements
- Sorted by date

## API Configuration

The API base URL is configured in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

Change this if your backend runs on a different port.

## Token Storage

- JWT tokens are stored in `localStorage`
- Automatically attached to all API requests
- Removed on logout or token expiration

## Error Handling

- 401 errors automatically redirect to login
- Network errors show user-friendly messages
- Form validation on all inputs

## Next Steps

1. Add more dashboard features (complaints, profile editing)
2. Add admin/staff dashboards with different permissions
3. Add file upload for document requests
4. Add real-time notifications
5. Add search and filter functionality
