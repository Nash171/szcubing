import axios from "axios";

declare global {
  interface Window {
    configs: {
      apiUrl: string;
    };
  }
}

// create axios instance
const api = axios.create({
  baseURL: window?.configs?.apiUrl || "http://localhost:3000/",
});

export const fetchContests = async () => {
  const response = await api.get("/contests");
  return response.data;
};
