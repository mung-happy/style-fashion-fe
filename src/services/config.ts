import axios, { AxiosInstance } from "axios";
import { localUserService } from "./localService";

// const API_URL = "http://localhost:8000"
const API_URL = "https://style-fashion-api.vercel.app/v1/docs/"
export const BASE_URL = API_URL;
const accessToken = localUserService.get()?.accessToken
const configHeadres  = {
  "Authorization": "Bearer " + (accessToken ? accessToken : ''),
}
export const https:AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: configHeadres
})