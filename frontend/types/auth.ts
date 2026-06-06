// This file contains the TypeScript interfaces for the authentication API.
export interface LoginRequest { // This is the request body for the login API.
  phone: string;
  password: string;
}

export interface LoginResponse { // This is the response body for the login API.
  access_token: string;
  token_type: string;
  name: string;
}