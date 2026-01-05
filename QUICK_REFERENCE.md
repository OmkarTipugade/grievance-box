# Authentication Quick Reference

## 🎯 At a Glance

**Type:** React Context API + useReducer  
**Location:** `frontend/src/context/`  
**Protected Routes:** `/dash`, `/dash-details`  
**Login Endpoint:** `/login`  
**Test Credentials:** `admin.dypsn` / `admin@dypsn`

---

## 📋 File Locations

```
✓ AuthContext.js        → frontend/src/context/AuthContext.js
✓ useAuth.js            → frontend/src/context/useAuth.js
✓ ProtectedRoute.js     → frontend/src/components/ProtectedRoute.js
✓ Updated index.jsx     → frontend/src/components/index.jsx
✓ Updated LoginForm.js  → frontend/src/components/LoginForm.js
✓ Updated dashboard.js  → frontend/src/components/dashboard.js
```

---

## 🔑 Key Methods

### Login

```javascript
const { login } = useAuth();
await login("admin.dypsn", "admin@dypsn");
```

### Logout

```javascript
const { logout } = useAuth();
await logout();
```

### Get User

```javascript
const { user, isAuthenticated } = useAuth();
console.log(user.username);
```

### Clear Error

```javascript
const { clearError } = useAuth();
clearError();
```

---

## 📊 State Properties

```javascript
{
  isAuthenticated: false,      // boolean
  user: null,                  // null or { username, role, loginTime }
  loading: true,               // boolean
  error: null                  // null or string
}
```

---

## 🛡️ Protected Routes Setup

```jsx
<Route
  path="/protected"
  element={
    <ProtectedRoute>
      <YourComponent />
    </ProtectedRoute>
  }
/>
```

---

## ⚡ Common Tasks

### Show User Welcome Message

```jsx
const { user } = useAuth();
return <p>Welcome, {user?.username}!</p>;
```

### Handle Login Errors

```jsx
const { error, clearError } = useAuth();
useEffect(() => {
  if (error) {
    console.log("Login error:", error);
  }
}, [error]);
```

### Check If Loading

```jsx
const { loading } = useAuth();
if (loading) return <div>Loading auth...</div>;
```

### Redirect on Auth Change

```jsx
const { isAuthenticated } = useAuth();
useEffect(() => {
  if (isAuthenticated) {
    navigate("/dash");
  }
}, [isAuthenticated, navigate]);
```

---

## 🔄 Session Flow

```
1. User visits app
   ↓
2. AuthProvider checks localStorage
   ↓
3. If session exists → restore it
4. If no session → show loading, then ready
   ↓
5. User can now access protected routes if authenticated
   ↓
6. On logout → clear session and redirect to /login
```

---

## 📱 Login Flow

```
1. User enters credentials
   ↓
2. Submit form
   ↓
3. validate credentials
   ├─ If valid → LOGIN_SUCCESS
   ├─ If invalid → LOGIN_FAILURE
   ↓
4. Save to localStorage
   ↓
5. Redirect to /dash
```

---

## ✅ Checklist

- [x] AuthContext created with useReducer
- [x] AuthProvider wraps entire app
- [x] useAuth hook created and exported
- [x] ProtectedRoute component created
- [x] LoginForm integrated with useAuth
- [x] Dashboard logout button added
- [x] localStorage persistence working
- [x] Error handling implemented
- [x] Loading states added
- [x] Documentation complete

---

## 🧪 Quick Test

1. **Test Login:**

   - Go to `/login`
   - Enter: `admin.dypsn` / `admin@dypsn`
   - Should redirect to `/dash`

2. **Test Protection:**

   - Clear auth (logout)
   - Try to access `/dash`
   - Should redirect to `/login`

3. **Test Persistence:**

   - Login successfully
   - Refresh page (Cmd+R)
   - Should remain logged in

4. **Test Logout:**
   - Click logout button
   - Should return to login page
   - Try `/dash` → redirects to login

---

## 🚨 Troubleshooting

| Issue                 | Solution                       |
| --------------------- | ------------------------------ |
| useAuth error         | Wrap with AuthProvider         |
| Not staying logged in | Check localStorage enabled     |
| Redirects to login    | Check route has ProtectedRoute |
| Loading forever       | Check AuthProvider wraps app   |
| Can't logout          | Check logout button code       |

---

## 📚 Documentation Files

| File                      | Size  | Content            |
| ------------------------- | ----- | ------------------ |
| AUTHENTICATION_README.md  | ~8KB  | Complete reference |
| SETUP_GUIDE.md            | ~5KB  | Quick start        |
| DEVELOPER_GUIDE.md        | ~12KB | Extensions guide   |
| IMPLEMENTATION_SUMMARY.md | ~6KB  | Overview           |

---

## 🔗 Integration Points

### With Backend

Replace in `AuthContext.js`:

```javascript
// From: Hardcoded validation
if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {

// To: API call
const response = await axios.post("/api/auth/login", { username, password });
```

### With Redux (Optional)

```javascript
// Can dispatch Redux actions from AuthContext
dispatch({ type: "SET_USER", payload: userData });
```

### With Next.js (Optional)

```javascript
// Works with Next.js App Router
// Use in layout.jsx to wrap entire app
```

---

## 🎓 Key Concepts

- **Context API**: Global state management without Redux
- **useReducer**: Predictable state transitions
- **localStorage**: Client-side session persistence
- **Protected Routes**: Authentication-based routing
- **HOC Pattern**: ProtectedRoute as higher-order component

---

## 💾 localStorage Keys

```javascript
// Auth state
localStorage.getItem("authState");
// Returns: { isAuthenticated: true, user: {...} }

// Can extend with:
localStorage.getItem("token");
localStorage.getItem("rememberMe");
```

---

## 🔐 Security Checklist

- [x] Password not stored
- [x] Session in storage (upgrade to cookies for production)
- [x] No sensitive data in URL
- [x] Logout clears all data
- [x] Protected routes checked
- [x] Error messages don't expose info

⚠️ **Production Requirements:**

- [ ] HTTPS enforced
- [ ] Backend API authentication
- [ ] JWT token implementation
- [ ] httpOnly cookies
- [ ] CORS properly configured
- [ ] Rate limiting on login

---

## 🎯 Next Enhancement Ideas

```
Priority 1:
- Connect to backend API
- Implement JWT tokens
- Add HTTPS requirement

Priority 2:
- Add remember me
- Session timeout
- Account lockout

Priority 3:
- 2FA support
- OAuth integration
- Password reset

Priority 4:
- Role-based access
- Audit logging
- Analytics
```

---

## 📞 Quick Links

- **Start here:** Go to `/login`
- **Test credentials:** `admin.dypsn` / `admin@dypsn`
- **Protected routes:** `/dash`, `/dash-details`
- **Auth file:** `frontend/src/context/AuthContext.js`
- **Hook:** `frontend/src/context/useAuth.js`

---

**Status: ✅ Ready to Use**

Start by logging in at `/login` with test credentials.
