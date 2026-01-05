# Authentication System Diagram

## System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                        React App                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │             AuthProvider (wraps entire app)              │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  AuthContext                                       │  │  │
│  │  │  ├─ State: isAuthenticated, user, loading, error   │  │  │
│  │  │  ├─ Methods: login(), logout(), clearError()       │  │  │
│  │  │  └─ localStorage: persists authState               │  │  │
│  │  │                                                     │  │  │
│  │  │  ┌──────────────────────────────────────────────┐  │  │  │
│  │  │  │  Router                                      │  │  │  │
│  │  │  │  ├─ Route: "/" → HomeScreen                 │  │  │  │
│  │  │  │  ├─ Route: "/login" → LoginForm              │  │  │  │
│  │  │  │  ├─ Route: "/dash" → ProtectedRoute          │  │  │  │
│  │  │  │  │                    └→ Dashboard            │  │  │  │
│  │  │  │  ├─ Route: "/dash-details" → ProtectedRoute  │  │  │  │
│  │  │  │  │                          └→ GrievanceDetailsDash │  │  │
│  │  │  │  └─ ... other public routes                  │  │  │  │
│  │  │  └──────────────────────────────────────────────┘  │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Login Flow

```
User Input
    ↓
LoginForm Component
    ↓
useAuth() hook
    ↓
AuthContext.login()
    ↓
Validate Credentials
    ├─ Valid ──→ LOGIN_SUCCESS action
    │           ├─ Create user object
    │           ├─ Save to localStorage
    │           └─ Update context state
    │
    └─ Invalid → LOGIN_FAILURE action
                ├─ Set error message
                └─ Keep isAuthenticated = false

Result:
├─ Success → Redirect to /dash
└─ Failure → Show error, stay on /login
```

### Protected Route Flow

```
User Visits /dash
    ↓
Check isAuthenticated state
    ├─ loading = true  → Show loading spinner
    ├─ authenticated   → Render Dashboard
    └─ not authenticated → Redirect to /login
```

### Session Restoration Flow

```
App Loads
    ↓
AuthProvider useEffect
    ↓
Check localStorage for "authState"
    ├─ Found ──→ RESTORE_SESSION action
    │           ├─ Parse stored auth data
    │           ├─ Update context state
    │           └─ Set loading = false
    │
    └─ Not found → SET_LOADING = false
                   (no session to restore)

Result:
User is either authenticated or needs to login
```

## Component Hierarchy

```
index.jsx (Index)
├─ AuthProvider (Context Provider)
│  ├─ Router
│  │  ├─ Navbar (always visible)
│  │  ├─ Suspense (lazy loading)
│  │  └─ Routes
│  │     ├─ Route "/" → HomeScreen
│  │     ├─ Route "/login" → LoginForm
│  │     │                   └─ Uses: useAuth()
│  │     ├─ Route "/dash" → ProtectedRoute
│  │     │                  └─ Dashboard
│  │     │                     └─ Uses: useAuth()
│  │     ├─ Route "/dash-details" → ProtectedRoute
│  │     │                          └─ GrievanceDetailsDash
│  │     │                             └─ Uses: useAuth()
│  │     └─ ... other routes
```

## State Machine Diagram

```
                    ┌─────────────────┐
                    │   Not Loaded    │
                    │  loading: true  │
                    └────────┬────────┘
                             │
                    Check localStorage
                             │
                  ┌──────────┴──────────┐
                  │                     │
                  ▼                     ▼
         ┌─────────────────┐  ┌─────────────────┐
         │  Session Found  │  │ No Session      │
         └────────┬────────┘  └────────┬────────┘
                  │                     │
                  ▼                     ▼
         ┌──────────────────┐ ┌──────────────────┐
         │ RESTORE_SESSION  │ │ loading: false   │
         └────────┬─────────┘ └────────┬─────────┘
                  │                     │
                  └──────────┬──────────┘
                             │
                             ▼
                    ┌─────────────────────┐
                    │   Ready State       │
                    │ ┌─────────────────┐ │
                    │ │ Not Authenticated│ │ ← Can login
                    │ │ OR              │ │
                    │ │ Authenticated   │ │ ← Can access /dash
                    │ └─────────────────┘ │
                    └────────┬────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
        ┌───────────────────┐  ┌────────────────┐
        │ LOGIN_SUCCESS     │  │   LOGOUT       │
        │ (go to /dash)     │  │ (go to /login) │
        └─────────┬─────────┘  └────────┬───────┘
                  │                     │
                  └──────────┬──────────┘
                             │
                    (back to Ready State)
```

## localStorage Schema

```javascript
// When authenticated
localStorage.getItem("authState")
{
  "isAuthenticated": true,
  "user": {
    "username": "admin.dypsn",
    "role": "admin",
    "loginTime": "2024-01-05T14:00:00.000Z"
  }
}

// Optional (for future enhancements)
localStorage.getItem("token")          // JWT token
localStorage.getItem("rememberMe")     // Remember me data
localStorage.getItem("sessionId")      // Session identifier
```

## Context Value Structure

```javascript
useAuth() returns:
{
  // State
  isAuthenticated: boolean,
  user: {
    username: string,
    role: string,
    loginTime: string (ISO)
  } | null,
  loading: boolean,
  error: string | null,

  // Methods
  login: (username: string, password: string) => Promise,
  logout: () => Promise,
  clearError: () => void
}
```

## Error Handling Flow

```
Login Attempt
    ↓
Validation Check
    ├─ Empty fields ──→ Error: "Please fill in all fields"
    ├─ Wrong credentials → Error: "Invalid credentials"
    └─ Success ────→ No error

Error Display
    ├─ Show in UI (red alert box)
    ├─ Available via useAuth().error
    └─ Can be cleared with clearError()
```

## Protected Route Logic

```
ProtectedRoute
    ├─ Check loading state
    │  └─ If true → Show loading spinner
    │
    ├─ Check isAuthenticated
    │  ├─ If true → Render children component
    │  └─ If false → Redirect to /login using Navigate
    │
    └─ Return JSX
```

## Async Operation States

### Login Operation

```
Initial
  ↓
SET_LOADING: true
  ↓
(validate credentials)
  ↓
├─ Success → LOGIN_SUCCESS + loading: false
└─ Failure → LOGIN_FAILURE + loading: false
```

### Logout Operation

```
Initial
  ↓
LOGOUT action
  ↓
├─ Clear localStorage
├─ Update state
└─ loading: false
```

## Session Lifecycle

```
1. App Start
   └─ Check localStorage
      └─ Restore or initialize

2. During Session
   ├─ User can access protected routes
   ├─ User can perform actions
   └─ Session persists

3. Page Refresh
   └─ localStorage restored
      └─ User remains logged in

4. Logout
   ├─ Clear localStorage
   ├─ Clear state
   └─ Redirect to login

5. New Session
   ├─ User logs in
   ├─ Store in localStorage
   └─ Set authentication state
```

## Integration Points

```
Frontend Components
    ↓
useAuth Hook (custom hook)
    ↓
AuthContext (React Context API)
    ↓
└─ Can integrate with:
   ├─ Redux (dispatch actions)
   ├─ GraphQL (apollo client)
   ├─ API calls (axios/fetch)
   ├─ localStorage (persistence)
   └─ Router (navigation)
```

## Performance Considerations

```
Rendering
    ├─ Components using useAuth hook re-render on auth change
    ├─ Suspense prevents multiple renders during loading
    ├─ useMemo can optimize context value
    └─ useCallback prevents hook re-creation

State Updates
    ├─ useReducer provides predictable updates
    ├─ Single source of truth (AuthContext)
    └─ No unnecessary re-renders to unrelated components
```

## Security Flow

```
Login Request
    ↓
Validate Input
    ├─ Check for empty fields
    └─ Check for valid format
    ↓
Verify Credentials
    ├─ Compare with credentials
    └─ Match validation
    ↓
├─ Match → Create user session
│          ├─ Create user object
│          ├─ Save to localStorage
│          └─ Mark as authenticated
│
└─ No match → Set error
              ├─ Don't reveal specifics
              └─ Keep user logged out
```

---

**Legend:**

- `→` Flow/Direction
- `├─` Option/Branch
- `└─` Last option/End
- `↓` Downward flow
- `○` State
- `□` Action/Process
