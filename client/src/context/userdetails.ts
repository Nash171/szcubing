import { createContext } from "react";

export const UserContext = createContext<{
  loggedIn: boolean;
  userDetails: { name: string };
}>({ loggedIn: false, userDetails: { name: "" } });