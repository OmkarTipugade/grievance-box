# Global Authentication State Management

This document describes the global state management system for dashboard authentication implemented using React Context API.

## Architecture Overview

The authentication system consists of the following components:

### 1. **AuthContext** (`src/context/AuthContext.js`)

- Manages global authentication state using `useReducer`
- Handles login/logout operations
- Persists authentication state to localStorage
- Provides automatic session restoration on app load

**State Structure:**

```javascript
{
  isAuthenticated: boolean,      // Whether user is logged in
  user: object | null,           // User data {username, role, loginTime}
  loading: boolean,              // Loading state during auth operations
  error: string | null           // Error messages
}
```

**Available Actions:**

- `LOGIN_SUCCESS` - User logged in successfully
- `LOGIN_FAILURE` - Login failed
- `LOGOUT` - User logged out
- `RESTORE_SESSION` - Restore session from localStorage
- `SET_LOADING` - Update loading state
- `CLEAR_ERROR` - Clear error messages

### 2. **AuthProvider Component**

Wraps the app and provides the auth context to all child components.

**Methods:**

- `login(username, password)` - Authenticates user and stores session
- `logout()` - Clears auth state and localStorage
- `clearError()` - Clears error messages

### 3. **useAuth Hook** (`src/context/useAuth.js`)

Custom hook for accessing auth context in components.

**Usage:**

```javascript
const { isAuthenticated, user, loading, error, login, logout, clearError } =
  useAuth();
```

### 4. **ProtectedRoute Component** (`src/components/ProtectedRoute.js`)

Higher-order component that protects routes requiring authentication.

**Features:**

- Redirects unauthenticated users to login page
- Shows loading state while checking auth status
- Prevents unauthorized access to dashboard routes

## Usage Examples

### Protected Route Setup

```jsx
<Route
  exact
  path="/dash"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### Using Auth in Components

```jsx
import { useAuth } from "../context/useAuth";

function MyComponent() {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome {user.username}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Login Flow

```jsx
const { login, error } = useAuth();

const handleLogin = async (username, password) => {
  try {
    await login(username, password);
    navigate("/dash");
  } catch (err) {
    console.error("Login failed:", err);
  }
};
```

## Features

### ✅ Persistent Sessions

- Authentication state is saved to localStorage
- Sessions are restored automatically when app reloads
- Users remain logged in unless they explicitly logout

### ✅ Protected Routes

- Dashboard and related routes are protected
- Unauthenticated users are redirected to login
- Route loading state prevents flickering

### ✅ Error Handling

- Login failures display error messages
- Error messages can be cleared
- Loading states prevent multiple submissions

### ✅ User Context

- Current user information accessible throughout app
- User data includes username, role, and login time
- Enables personalized dashboard features

## File Structure

```
frontend/
├── src/
│   ├── context/
│   │   ├── AuthContext.js       # Auth context and provider
│   │   └── useAuth.js           # Custom hook
│   ├── components/
│   │   ├── index.jsx            # App routing (wrapped with AuthProvider)
│   │   ├── LoginForm.js         # Login component (updated)
│   │   ├── dashboard.js         # Dashboard (updated with logout)
│   │   ├── ProtectedRoute.js    # Protected route wrapper
│   │   └── ...other components
```

## Credentials

**Test Login Credentials:**

- Username: `admin.dypsn`
- Password: `admin@dypsn`

## Session Management

### On Login:

1. Credentials are validated
2. User object is created with metadata
3. Auth state is updated
4. Session is persisted to localStorage
5. User is redirected to dashboard

### On Logout:

1. Auth state is cleared
2. localStorage is cleared
3. User is redirected to login page
4. All user data is removed

### On App Load:

1. Auth state checks localStorage
2. If session exists, it's restored
3. User can access protected routes
4. If no session, loading state is cleared

## Security Considerations

⚠️ **Note:** This implementation is for demonstration purposes. For production:

1. **Server-side authentication** - Use backend API for login
2. **JWT tokens** - Implement JWT token-based auth
3. **HTTPS only** - Always use HTTPS in production
4. **Secure storage** - Use secure/httpOnly cookies instead of localStorage for sensitive data
5. **Token refresh** - Implement token refresh mechanism
6. **CORS** - Properly configure CORS on backend
7. **Input validation** - Add comprehensive input validation

## Integration with Backend

To connect to a real backend:

```javascript
// Modify login method in AuthContext.js
const login = useCallback((username, password) => {
  return axios
    .post("https://your-api.com/auth/login", {
      username,
      password,
    })
    .then((response) => {
      const userData = response.data.user;
      localStorage.setItem(
        "authState",
        JSON.stringify({
          isAuthenticated: true,
          user: userData,
          token: response.data.token,
        })
      );
      dispatch({ type: "LOGIN_SUCCESS", payload: userData });
      return userData;
    })
    .catch((error) => {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.response?.data?.message || "Login failed",
      });
      throw error;
    });
}, []);
```

## Troubleshooting

### User redirected to login after page reload

- Check if localStorage is enabled in browser
- Verify AuthProvider wraps entire app

### "useAuth must be used within an AuthProvider" error

- Ensure component is inside Router which is inside AuthProvider
- Check component import path

### Protected route not working

- Verify ProtectedRoute component is wrapping the route
- Check that AuthProvider is at top level

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] Role-based access control (RBAC)
- [ ] Token expiration and refresh
- [ ] Session timeout
- [ ] Account lockout after failed attempts
- [ ] Password reset functionality
- [ ] OAuth/SSO integration
