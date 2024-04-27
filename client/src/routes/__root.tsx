import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Avatar, Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const [isLoggedIn] = useState(false);

  return (
    <>
      <Box width={"100vw"}>
        <Flex direction="column" minHeight="100vh">
          <Box as="header" bg="gray.800" color="white" padding="4">
            <Flex>
              <Box>
                <Heading size='md'>Sub-0 Cubing <Text fontWeight={'normal'} as='sub'>beta</Text></Heading>
              </Box>
              <Box display='flex' flexGrow='1' justifyContent={'center'}>
                
              </Box>
              <Box>
                {isLoggedIn ? <Avatar name='Nadeesh Peiris' size={'sm'} /> : <Button  size="sm">Log In</Button>}
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
      <TanStackRouterDevtools />
    </>
  );
}
