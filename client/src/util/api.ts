import axios from "axios";
import oauth from "axios-oauth-client";

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
  baseURL: window?.configs?.apiUrl || "http://localhost:8080/",
});

let accessToken = "";

try {
  const getClientCredentials = oauth.clientCredentials(
    api,
    window?.configs?.tokenUrl || "http://localhost:8080/",
    window?.configs?.consumerKey,
    window?.configs?.consumerSecret
  );

  const auth = await getClientCredentials("");
  accessToken = auth.access_token;
} catch (error) {
  console.error(error);
}

export const fetchContests = async () => {
  try {
    const response = await api.get("/contests", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchContest = async (contestId: string) => {
  try {
    const response = await api.get(`/contests/${contestId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}


export const postResult = async (contestId: string, results: any) => {
  try {
    const response = await api.post(`/contests/${contestId}/result`, results, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

