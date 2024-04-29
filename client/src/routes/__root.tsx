import { Suspense, lazy, useEffect, useState } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Avatar, Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { UserContext } from "../context/userdetails";

const TanStackRouterDevtools =
  import.meta.env.PROD
    ? () => null // Render nothing in production
    : lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      );

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: "" });

  useEffect(() => {
    let isUserInfoSet = false;

    if (import.meta.env.DEV) {
      // Mock the authentication flow
      const mockUserInfo = { username: 'testuser', name: 'Test User' };
      localStorage.setItem('userDetails', JSON.stringify(mockUserInfo));
      isUserInfoSet = true;
    }

    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setUserDetails(userDetails);
      setLoggedIn(true);
      isUserInfoSet = true;
    }

    if (!isUserInfoSet) {
      const encodedUserInfo = Cookies.get("userinfo");
      if (encodedUserInfo) {
        const userInfo = JSON.parse(atob(encodedUserInfo));
        setUserDetails(userInfo);
        setLoggedIn(true);
        localStorage.setItem("userDetails", JSON.stringify(userInfo));
      }
    }

    setLoading(false); // Set loading to false after authentication check is complete
  }, []);

  function handleLoginClick() {
    window.location.href = "/auth/login";
  }
  function handleLogoutClick() {
    localStorage.removeItem("userDetails");
    window.location.href = "/auth/logout";
  }


  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
  }

  return (
    <UserContext.Provider value={{ loggedIn, userDetails }}>
      <Box width={"100vw"}>
        <Flex direction="column" minHeight="100vh">
          <Box as="header" bg="gray.800" color="white" padding="4">
            <Flex>
              <Box>
                <Heading size="md">
                  Sub-0 Cubing{" "}
                  <Text fontWeight={"normal"} as="sub">
                    beta
                  </Text>
                </Heading>
              </Box>
              <Box display="flex" flexGrow="1" justifyContent={"center"}></Box>
              <Box>
                {loggedIn ? (
                  <>
                    <Avatar name={userDetails.name} size={"sm"} />
                    <Button size="sm" marginLeft={"10px"} onClick={handleLogoutClick}>Log Out</Button>
                  </>
                ) : (
                  <Button size="sm" marginLeft={"10px"} onClick={handleLoginClick}>Log In</Button>
                )}
              </Box>
            </Flex>
          </Box>

          <Box flex="1" padding="4">
            <Outlet />
          </Box>
          <Box
            as="footer"
            bg="gray.800"
            color="white"
            padding="2"
            fontSize={10}
          >
            &copy; 2024 szcubing
          </Box>
        </Flex>
      </Box>
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </UserContext.Provider>
  );
}
