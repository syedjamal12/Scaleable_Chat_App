import Env from "./env";

export const BASE_URL = Env.BACKEND_URL
export const API_URL =  BASE_URL + "/api";
export const LOGIN_URL = API_URL + "/auth/login";  // http://localhost:8000/api/auth/login

console.log("LOGIN_URL:", LOGIN_URL);  // Check if it's correct

