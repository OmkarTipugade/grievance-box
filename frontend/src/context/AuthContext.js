import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";

export const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        error: null,
        loading: false,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: action.payload,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
        loading: false,
      };
    case "RESTORE_SESSION":
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        loading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const storedAuth = localStorage.getItem("authState");
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          dispatch({
            type: "RESTORE_SESSION",
            payload: authData,
          });
        } else {
          dispatch({
            type: "SET_LOADING",
            payload: false,
          });
        }
      } catch (error) {
        console.error("Error restoring session:", error);
        dispatch({
          type: "SET_LOADING",
          payload: false,
        });
      }
    };

    checkSession();
  }, []);

  const login = useCallback((username, password) => {
    dispatch({ type: "SET_LOADING", payload: true });

    // Validate credentials
    const ADMIN_USERNAME = "admin.dypsn";
    const ADMIN_PASSWORD = "admin@dypsn";

    if (!username || !password) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: "Please fill in all fields",
      });
      return Promise.reject("Please fill in all fields");
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const userData = {
        username: username,
        role: "admin",
        loginTime: new Date().toISOString(),
      };

      // Store auth state in localStorage
      localStorage.setItem(
        "authState",
        JSON.stringify({
          isAuthenticated: true,
          user: userData,
        })
      );

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: userData,
      });

      return Promise.resolve(userData);
    } else {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: "Invalid credentials",
      });
      return Promise.reject("Invalid credentials");
    }
  }, []);

  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem("authState");

    dispatch({
      type: "LOGOUT",
    });

    return Promise.resolve();
  }, []);

  const clearError = useCallback(() => {
    dispatch({
      type: "CLEAR_ERROR",
    });
  }, []);

  const value = {
    ...state,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
