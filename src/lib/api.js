/**
 * API Service for Tic-Tac-Toe Backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }

  getToken() {
    if (this.token) return this.token;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Backend sends validation errors as { errors: [...] } array
        // and single errors as { error: "..." } string
        const errorMessage =
          data.errors && data.errors.length > 0
            ? data.errors.join(", ")
            : data.error || "Something went wrong";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // ===== AUTH =====
  async register(username, password) {
    const data = await this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    if (data.data?.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  async login(username, password) {
    const data = await this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    if (data.data?.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  async getMe() {
    return this.request("/api/auth/me");
  }

  logout() {
    this.clearToken();
  }

  // ===== ROOMS =====
  async createRoom() {
    return this.request("/api/rooms", { method: "POST" });
  }

  async getRooms() {
    return this.request("/api/rooms");
  }

  async getRoom(code) {
    return this.request(`/api/rooms/${code}`);
  }

  async joinRoom(code) {
    return this.request(`/api/rooms/${code}/join`, { method: "POST" });
  }

  async spectateRoom(code) {
    return this.request(`/api/rooms/${code}/spectate`, { method: "POST" });
  }

  async leaveRoom(code) {
    return this.request(`/api/rooms/${code}/leave`, { method: "POST" });
  }

  // ===== GAME =====
  async makeMove(roomId, position, version) {
    return this.request(`/api/game/${roomId}/move`, {
      method: "POST",
      body: JSON.stringify({ position, version }),
    });
  }

  async getGameState(roomId) {
    return this.request(`/api/game/${roomId}/state`);
  }

  async getGameStatus(roomId) {
    return this.request(`/api/game/${roomId}/status`);
  }

  // ===== BOT =====
  async createBotGame(goFirst = true) {
    return this.request("/api/bot/create", {
      method: "POST",
      body: JSON.stringify({ goFirst }),
    });
  }

  async makeBotMove(gameId, position, version) {
    return this.request(`/api/bot/${gameId}/move`, {
      method: "POST",
      body: JSON.stringify({ position, version }),
    });
  }

  async getBotGame(gameId) {
    return this.request(`/api/bot/${gameId}`);
  }

  async getBotGames() {
    return this.request("/api/bot/user/games");
  }

  // ===== REPLAY =====
  async getReplay(roomId) {
    return this.request(`/api/replay/${roomId}`);
  }

  async getGameHistory() {
    return this.request("/api/replay/user/history");
  }
}

export const api = new ApiClient();
export default api;
