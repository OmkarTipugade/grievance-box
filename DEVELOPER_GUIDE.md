# Developer Guide - Extending Authentication

This guide helps developers extend and customize the authentication system.

## Current Architecture

```
┌─────────────────────────────────────┐
│        AuthProvider                  │
│  (wraps entire app in index.jsx)    │
└────────────┬────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────────┐   ┌──────────────────┐
│ useAuth()   │   │ ProtectedRoute   │
│ (hook)      │   │ (HOC)            │
└─────────────┘   └──────────────────┘
    │                     │
    ▼                     ▼
┌─────────────┐   ┌──────────────────┐
│ Components  │   │ Protected Routes │
│ (LoginForm) │   │ (/dash, details) │
└─────────────┘   └──────────────────┘
```

## Common Extensions

### 1. Add Backend Authentication

**File:** `frontend/src/context/AuthContext.js`

```javascript
const login = useCallback((username, password) => {
  dispatch({ type: "SET_LOADING", payload: true });

  return axios
    .post("https://your-api.com/api/auth/login", { username, password })
    .then((response) => {
      const { user, token } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem(
        "authState",
        JSON.stringify({
          isAuthenticated: true,
          user,
        })
      );

      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      return user;
    })
    .catch((error) => {
      const errorMsg = error.response?.data?.message || "Login failed";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMsg });
      throw error;
    });
}, []);
```

### 2. Add JWT Token Handling

**File:** `frontend/src/context/AuthContext.js`

```javascript
// Add to AuthProvider component
useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    // Set default Authorization header
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}, []);

// Add to login method
.then((response) => {
  const { user, token } = response.data;
  localStorage.setItem("token", token);
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  // ... rest of login
})
```

### 3. Add Role-Based Access Control (RBAC)

**File:** `frontend/src/context/AuthContext.js`

```javascript
// Update initialState
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  roles: [], // Add roles array
};

// Update LOGIN_SUCCESS action
case "LOGIN_SUCCESS":
  return {
    ...state,
    isAuthenticated: true,
    user: action.payload.user,
    roles: action.payload.roles || [],
    error: null,
    loading: false,
  };
```

**File:** `frontend/src/components/RoleProtectedRoute.js`

```javascript
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const RoleProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, roles } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
```

### 4. Add Session Timeout

**File:** `frontend/src/context/AuthContext.js`

```javascript
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  let timeoutId;

  const resetTimeout = useCallback(() => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      logout();
    }, SESSION_TIMEOUT);
  }, []);

  useEffect(() => {
    if (state.isAuthenticated) {
      // Set up activity listeners
      window.addEventListener("mousemove", resetTimeout);
      window.addEventListener("keypress", resetTimeout);

      return () => {
        window.removeEventListener("mousemove", resetTimeout);
        window.removeEventListener("keypress", resetTimeout);
      };
    }
  }, [state.isAuthenticated, resetTimeout]);

  // ... rest of component
};
```

### 5. Add "Remember Me" Functionality

**File:** `frontend/src/components/LoginForm.js`

```javascript
const [rememberMe, setRememberMe] = useState(false);

const handleSubmit = (e) => {
  e.preventDefault();

  login(username, password)
    .then(() => {
      if (rememberMe) {
        localStorage.setItem(
          "rememberMe",
          JSON.stringify({
            username,
            // Note: NEVER store passwords
          })
        );
      }
      navigate("/dash");
    })
    .catch((err) => console.error("Login failed:", err))
    .finally(() => setIsLoading(false));
};

// On component mount
useEffect(() => {
  const remembered = JSON.parse(localStorage.getItem("rememberMe"));
  if (remembered) {
    setUsername(remembered.username);
    setRememberMe(true);
  }
}, []);

// In JSX
<label className="flex items-center">
  <input
    type="checkbox"
    checked={rememberMe}
    onChange={(e) => setRememberMe(e.target.checked)}
  />
  <span className="ml-2">Remember me</span>
</label>;
```

### 6. Add Two-Factor Authentication (2FA)

**File:** `frontend/src/context/AuthContext.js`

```javascript
// Add to initialState
const initialState = {
  // ... existing state
  requiresMFA: false,
  mfaPending: false,
};

// Add new action
case "MFA_REQUIRED":
  return {
    ...state,
    requiresMFA: true,
    mfaPending: true,
    loading: false,
  };

// Add MFA verification method
const verifyMFA = useCallback((code) => {
  return axios.post("https://your-api.com/api/auth/verify-mfa", { code })
    .then((response) => {
      const userData = response.data.user;
      localStorage.setItem("authState", JSON.stringify({
        isAuthenticated: true,
        user: userData,
      }));
      dispatch({ type: "LOGIN_SUCCESS", payload: userData });
      return userData;
    })
    .catch((error) => {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.response?.data?.message || "MFA verification failed",
      });
      throw error;
    });
}, []);
```

### 7. Add Account Lockout

**File:** `frontend/src/context/AuthContext.js`

```javascript
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

const login = useCallback((username, password) => {
  const attemptKey = `login_attempts_${username}`;
  const lockoutKey = `lockout_${username}`;

  // Check if account is locked
  const lockoutTime = localStorage.getItem(lockoutKey);
  if (lockoutTime && Date.now() < parseInt(lockoutTime)) {
    const remainingMinutes = Math.ceil(
      (parseInt(lockoutTime) - Date.now()) / 60000
    );
    dispatch({
      type: "LOGIN_FAILURE",
      payload: `Account locked. Try again in ${remainingMinutes} minutes.`,
    });
    return Promise.reject("Account locked");
  }

  // Verify credentials
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Clear attempts on success
    localStorage.removeItem(attemptKey);
    localStorage.removeItem(lockoutKey);
    // ... rest of login
  } else {
    // Increment failed attempts
    const attempts = parseInt(localStorage.getItem(attemptKey) || "0") + 1;
    localStorage.setItem(attemptKey, attempts.toString());

    if (attempts >= MAX_ATTEMPTS) {
      localStorage.setItem(lockoutKey, (Date.now() + LOCKOUT_TIME).toString());
      dispatch({
        type: "LOGIN_FAILURE",
        payload: "Too many failed attempts. Account locked for 15 minutes.",
      });
    } else {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: `Invalid credentials. ${
          MAX_ATTEMPTS - attempts
        } attempts remaining.`,
      });
    }
  }
}, []);
```

### 8. Add Password Reset

**File:** `frontend/src/components/PasswordReset.js`

```javascript
import React, { useState } from "react";
import axios from "axios";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://your-api.com/api/auth/reset-password", {
        email,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email");
    }
  };

  if (submitted) {
    return <div className="text-center">Check your email for reset link</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit">Send Reset Link</button>
    </form>
  );
};

export default PasswordReset;
```

## Testing the Extensions

### Unit Testing Example

```javascript
// __tests__/AuthContext.test.js
import { renderHook, act } from "@testing-library/react-hooks";
import { useAuth } from "../context/useAuth";

describe("AuthContext", () => {
  test("login should set isAuthenticated to true", async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login("admin.dypsn", "admin@dypsn");
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).not.toBeNull();
  });

  test("logout should clear auth state", async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login("admin.dypsn", "admin@dypsn");
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
```

## Performance Optimization

### 1. Memoize Auth Context

```javascript
const value = useMemo(
  () => ({
    ...state,
    login,
    logout,
    clearError,
  }),
  [state, login, logout, clearError]
);
```

### 2. Split Auth Context

Create separate contexts for read-only state and actions:

```javascript
export const AuthStateContext = createContext();
export const AuthDispatchContext = createContext();

// In provider:
<AuthStateContext.Provider value={state}>
  <AuthDispatchContext.Provider value={{ login, logout }}>
    {children}
  </AuthDispatchContext.Provider>
</AuthStateContext.Provider>;
```

## Best Practices

✅ **Do:**

- Store tokens securely (httpOnly cookies in production)
- Validate on both client and server
- Implement HTTPS always
- Use CORS properly
- Clear sensitive data on logout
- Implement token expiration
- Log security events

❌ **Don't:**

- Store passwords in localStorage
- Use localStorage for sensitive data in production
- Trust client-side validation alone
- Log sensitive information
- Hardcode credentials in code
- Disable HTTPS
- Implement custom crypto

## Debugging Tips

Enable debug logging:

```javascript
// In AuthContext.js
const login = useCallback((username, password) => {
  console.log("[AUTH] Login attempt:", username);
  // ... rest of login
  .then(() => {
    console.log("[AUTH] Login successful");
    // ...
  })
  .catch((error) => {
    console.log("[AUTH] Login failed:", error);
    // ...
  });
}, []);
```

Monitor localStorage changes:

```javascript
window.addEventListener("storage", (e) => {
  console.log("[STORAGE] Changed key:", e.key);
  console.log("[STORAGE] New value:", e.newValue);
});
```
