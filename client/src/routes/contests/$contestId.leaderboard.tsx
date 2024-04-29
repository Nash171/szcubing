import { Link, createFileRoute } from "@tanstack/react-router";
import { fetchContest } from "../../util/api";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Page from "../../components/Page";

export const Route = createFileRoute("/contests/$contestId/leaderboard")({
  component: Leaderboard,
  loader: ({ params: { contestId } }) => {
    return fetchContest(contestId);
  },
});

function Leaderboard() {
  const contest = Route.useLoaderData();

  const rankings = contest.results.sort((a: any, b: any) => a.result.ao5Ms - b.result.ao5Ms);

  return (
    <Page>
      <Breadcrumb separator="/" alignSelf={"flex-start"}>
        <BreadcrumbItem>
          <BreadcrumbLink to="/" as={Link}>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink>Contest#{contest.id}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Stack
        direction="column"
        spacing={4}
        alignItems={"center"}
        width={"100%"}
        marginTop={"20px"}
      >
        <Heading size="md">{contest.name} - Leaderboard</Heading>
        <Badge>{contest.type}</Badge>
      </Stack>

      <Table maxWidth={"600px"}>
        <Thead>
          <Tr>
            <Th>Rank</Th>
            <Th>Name</Th>
            <Th>Result</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rankings.map((r: any, i: number) => (
            <Tr key={r.player.id} py={"5"}>
              <Td>{i + 1}</Td>
              <Td>{r.player.name}</Td>
              <Td>{r.result.ao5}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Page>
  );
}
