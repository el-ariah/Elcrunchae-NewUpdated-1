/**
 * Auth API — PHP/MySQL JWT implementation.
 * Re-exports from api.ts for backward compatibility.
 */
import { getCurrentUser, loginUser, registerUser, logout, isLoggedIn } from "./api";

class AuthApi {
  async getCurrentUser() {
    return getCurrentUser();
  }

  async login(email: string, password: string) {
    return loginUser(email, password);
  }

  async register(email: string, password: string, name: string) {
    return registerUser(email, password, name);
  }

  logout() {
    logout();
  }

  isLoggedIn(): boolean {
    return isLoggedIn();
  }
}

export const authApi = new AuthApi();