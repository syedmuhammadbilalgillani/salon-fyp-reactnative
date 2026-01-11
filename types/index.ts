export type UserType = "salon_admin" | "customer" | null;

// Registration request/response types
export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: "salon_admin" | "customer";
  }
  
  export interface RegisterResponse {
    // Add your API response type here based on what the API returns
    // Example:
    // message?: string;
    // user?: any;
    // token?: string;
    [key: string]: any;
  }
  export interface LoginRequest {
    email: string;
    password: string;
    userType: "salon_admin" | "customer";
  }
