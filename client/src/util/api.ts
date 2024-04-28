import axios from "axios";
import oauth from 'axios-oauth-client';

declare global {
  interface Window {
    configs: {
      apiUrl: string;
      consumerKey: string;
      consumerSecret: string;
      tokenUrl: string;
    };
  }
}

const api = axios.create({
  baseURL: window?.configs?.apiUrl || "http://localhost:3000/",
});

// consumerKey, consumerSecret and tokenUrl represent variables to which respective environment variables were read
const getClientCredentials = oauth.clientCredentials(
  api,
  window?.configs?.tokenUrl,
  window?.configs?.consumerKey,
  window?.configs?.consumerSecret
);

const auth = await getClientCredentials('');
const accessToken = auth.access_token;

export const fetchContests = async () => {
  
  
  const response = await api.get("/contests",{
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
});
  return response.data;
};
