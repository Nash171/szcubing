import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Page from "./Page";
import { fetchContests } from "../util/api";

export default function Contests() {
  const [contests, setContests] = useState([]);
  
  useEffect(() => {
    fetchContests().then((data) => setContests(data.contests));   
  }, []);


  return (
    <div>
      <Page>
        <TableContainer>
          <Table variant="simple">
            <TableCaption>Active Contests</TableCaption>
            <Thead>
              <Tr>
                <Th>Contest</Th>
                <Th>Type</Th>
                <Th>Started</Th>
                <Th>End</Th>
                <Th>Compete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {contests.map((contest: any) => (
                <Tr key={contest.id}>
                  <Td>{contest.name}</Td>
                  <Td>{contest.type}</Td>
                  <Td>{contest.started}</Td>
                  <Td>{contest.end}</Td>
                  <Td>{contest.compete ? "Yes" : "No"}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Page>
    </div>
  );
}
