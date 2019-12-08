import axios from "axios";
import { set, get, remove } from "js-cookie";

export interface Idea {
  id: string;
  content: string;
  impact: number;
  ease: number;
  confidence: number;
  average_score: number;
  created_at: number;
}

export interface User {
  email: string;
  name: string;
  avatar_url: string;
}
const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(config => {
  config.headers["X-Access-Token"] = get("jwt");
  return config;
});

api.interceptors.response.use(
  response => {
    return response;
  },
  function(error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return api
        .post("/access-tokens/refresh", {
          refresh_token: get("refresh_token")
        })
        .then(res => {
          if (res.status === 200) {
            set("jwt", res.data.jwt);
            // 3) return originalRequest object with Axios.
            return api.request(originalRequest);
          }
          return Promise.reject(res);
        });
    } else {
      return Promise.reject(error);
    }
  }
);

export function login(loginData: Record<string, string>) {
  return api.post("/access-tokens", loginData).then(res => {
    const { jwt, refresh_token } = res.data;
    set("jwt", jwt, {
      sameSite: "strict"
    });
    set("refresh_token", refresh_token);
    return true;
  });
}

export function logout() {
  return api
    .delete("/access-tokens", {
      data: {
        refresh_token: get("refresh_token")
      }
    })
    .then(() => {
      remove("jwt");
      remove("refresh_token");
      return true;
    });
}

export function signUp(loginData: Record<string, string>) {
  return api.post("/users", loginData).then(({ data }) => {
    const { jwt, refresh_token } = data;
    set("jwt", jwt, {
      sameSite: "strict"
    });
    set("refresh_token", refresh_token);
    return true;
  });
}

export function getIdeas(page = 1) {
  return api
    .get<Idea[]>("/ideas", {
      params: { page }
    })
    .then(res => res.data);
}

export function saveIdea(idea: Record<string, string>) {
  return api.post<Idea>("/ideas", idea).then(res => res.data);
}

export function removeIdea(id: string) {
  return api.delete<Idea>("/ideas/" + id).then(res => id);
}

export function getUserData() {
  return api.get<User>("/me").then(res => res.data);
}

export function checkAuthorized() {
  return api.get<User>("/me").then(res => true);
}

export function updateIdea({
  id,
  data
}: {
  id: string;
  data: Record<string, string>;
}) {
  return api.put<Idea>("/ideas/" + id, data).then(res => id);
}
