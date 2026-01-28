import { useCallback } from "react";

export function useAuth() {
  const user = {
      id: 1,
      name: "User",
      email: "user@example.com"
  };

  return {
    user,
    loading: false,
    error: null,
    isAuthenticated: true,
    refresh: () => {},
    logout: () => {},
  };
}
