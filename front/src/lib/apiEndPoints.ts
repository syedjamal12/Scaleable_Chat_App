import Env from "./env";

export const BASE_URL = Env.BACKEND_URL
export const API_URL =  BASE_URL + "/api";
export const LOGIN_URL = API_URL + "/auth/login";  // http://localhost:8000/api/auth/login

export const GROUP_CHAT_URL = API_URL + "/chat-group";  // http://localhost:8000/api/auth/login

export const GROUP_CHAT_FETCH = API_URL + "/user-groups";

export const GROUP_DELETE = API_URL + "/user-group-delete";

export const GROUP_UPDATE = API_URL + "/user-group-update";



console.log("LOGIN_URL:", LOGIN_URL);  // Check if it's correct

