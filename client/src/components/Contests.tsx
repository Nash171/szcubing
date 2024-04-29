import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Badge,
  Button,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Page from "./Page";
import { fetchContests } from "../util/api";
import { Link } from "@tanstack/react-router";

export default function Contests() {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    fetchContests().then((data) => setContests(data));
  }, []);

  return (
    <div>
      <Page>
        <TableContainer>
          <Table variant="simple">
            <TableCaption>Contests</TableCaption>
            <Thead>
              <Tr>
                <Th>Contest</Th>
                <Th>Type</Th>
                <Th>Status</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {contests.map((contest: any) => (
                <Tr key={contest.id} py={"5"}>
                  <Td>{contest.name}</Td>
                  <Td>
                    <Badge>{contest.type}</Badge>
                  </Td>
                  <Td>
                    {contest.status === "RUNNING" ? (
                      <Badge colorScheme="green">Running</Badge>
                    ) : (
                      <Badge colorScheme="red">Ended</Badge>
                    )}
                  </Td>
                  <Td>
                    <Stack direction="row" spacing={2}>
                      <Link to={`/contests/${contest.id}`}>
                        <Button
                          colorScheme="blue"
                          size={"sm"}
                          isDisabled={contest.status !== "RUNNING"}
                        >
                          Compete
                        </Button>
                      </Link>
                      <Link to={`/contests/${contest.id}/leaderboard`}>
                        <Button colorScheme="green" size={"sm"}>
                          Leaderboard
                        </Button>
                      </Link>
                    </Stack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Page>
    </div>
  );
}
