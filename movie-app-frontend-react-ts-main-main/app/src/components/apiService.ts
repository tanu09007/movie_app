import axios from "axios";
import { Items, Movie1 } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5678";

export const AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

AxiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("token");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

interface SignupPayload {
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  user_password: string;
  phone_no: string;
}

interface LoginPayload {
  user_name: string;
  user_password: string;
}

export const getApiErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const message = error.response?.data?.message ?? error.response?.data?.error;
    if (Array.isArray(message)) {
      return message.join(" ");
    }
    if (message) {
      return message;
    }
  }

  return error instanceof Error ? error.message : fallback;
};

export const signupUser = async (payload: SignupPayload): Promise<void> => {
  await AxiosInstance.post("/signup", payload);
};

export const loginUser = async (
  payload: LoginPayload
): Promise<{ token: string }> => {
  const response = await AxiosInstance.post<{ token: string }>(
    "/login",
    payload
  );
  return response.data;
};

export const getMovies = async (): Promise<Items[]> => {
  const response = await AxiosInstance.get<{ movies: Items[] }>("/movies");
  return response.data.movies;
};

const toApiMovie = (movie: Movie1) => ({
  movie_name: movie.title,
  year: movie.year,
});

export const createMovie = async (movie: Movie1): Promise<Items> => {
  const response = await AxiosInstance.post<Items>("/movies", toApiMovie(movie));
  return response.data;
};

export const updateMovie = async (
  id: string,
  movieData: Movie1
): Promise<Items> => {
  const response = await AxiosInstance.put<Items>(
    `/movies/${encodeURIComponent(id)}`,
    toApiMovie(movieData)
  );
  return response.data;
};

export const deleteMovie = async (id: string): Promise<void> => {
  await AxiosInstance.delete(`/movies/${encodeURIComponent(id)}`);
};

export const getMovieById = async (id: string): Promise<Movie1> => {
  const response = await AxiosInstance.get<Items>(
    `/movies/${encodeURIComponent(id)}`
  );
  return {
    title: response.data.movie_name,
    year: response.data.year ?? new Date().getFullYear(),
  };
};
