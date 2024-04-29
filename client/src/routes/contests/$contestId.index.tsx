import { Link, Navigate, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { fetchContest, postResult } from "../../util/api";
import {
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Heading,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  Tabs,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import Page from "../../components/Page";
import { UserContext } from "../../context/userdetails";

export const Route = createFileRoute("/contests/$contestId/")({
  component: Contest,
  loader: ({ params: { contestId } }) => {
    return fetchContest(contestId);
  },
});

const toMilliseconds = (time: string) => {
  const [remainingStr = "0.000", minutesStr] = time.split(":").reverse();
  const [secondsStr, millisecondsStr = "00"] = remainingStr.split(".");
  console.log(remainingStr, minutesStr, secondsStr, millisecondsStr);
  const minutes = parseInt(minutesStr) || 0;
  const seconds = parseInt(secondsStr);
  const milliseconds = parseInt(String(millisecondsStr).padEnd(3, "0"));

  const ms = minutes * 60 * 1000 + seconds * 1000 + milliseconds;
  console.log(ms);
  return isNaN(ms) || ms === 0 ? "DNF" : ms;
};

const toTime = (timeMs: number) => {
  const minutes = Math.floor(timeMs / 1000 / 60);
  const seconds = Math.floor((timeMs / 1000) % 60);
  const milliseconds = Math.round((timeMs % 1000) / 10);
  console.log(minutes, seconds, milliseconds);
  return `${minutes ? `${minutes}:` : ""}${String(seconds).padStart(minutes ? 2 : 1, "0")}.${String(milliseconds).padEnd(2, "0")}`;
};

function Contest() {
  const contest = Route.useLoaderData();
  const [tabIndex, setTabIndex] = useState(0);
  const [solves, setSolves] = useState(
    Array.from({ length: 5 }, (_, i) => ({
      no: i + 1,
      time: "",
      timeMs: "DNS" as number | "DNF" | "DNS",
      penalty: 0,
    }))
  );
  const [result, setResult] = useState({
    best: -1,
    worst: -1,
    ao5: "",
    ao5Ms: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate({ from: '/contests/:contestId' });

  const { loggedIn, userDetails } = useContext(UserContext);

  useEffect(() => {
    if (tabIndex === 5) {
      // take a copy of the solves
      let times = [...solves];
      times.sort((a, b) => {
        if (a.timeMs === "DNF" || a.timeMs === "DNS") {
          return 1;
        } else if (b.timeMs === "DNF" || b.timeMs === "DNS") {
          return -1;
        } else {
          return a.timeMs - b.timeMs;
        }
      });

      const ao5 = Math.floor(
        times
          .slice(1, 4)
          .reduce((acc, cur) => acc + (cur.timeMs as number), 0) / 3
      );
      console.log(times, times.slice(1, 4), ao5);
      setResult({
        ao5: isNaN(ao5) ? "DNF" : toTime(ao5),
        ao5Ms: ao5,
        best: times[0].no,
        worst: times[4].no,
      });
    }
  }, [tabIndex]);

  function handleTabsChange(index: number) {
    setTabIndex(index);
  }

  function setSolveTime(no: number, time: string) {
    setSolves((prevSolves) => {
      const newSolves = [...prevSolves];
      const index = newSolves.findIndex((s) => s.no === no);
      if (index !== -1) {
        newSolves[index].time = time;
        newSolves[index].timeMs = toMilliseconds(time);
      }
      return newSolves;
    });
  }

  function nextSolve() {
    setTabIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;

      return nextIndex <= 5 ? nextIndex : prevIndex;
    });
  }


  async function handlePostResults() {
    try {
      setIsSubmitting(true);
      await postResult(contest.id, {
        player: {
          id: `TEST${Math.floor(Math.random() * 10000)}`,
          name: userDetails.name,
        },
        solves,
        result,
      });
      navigate({ to: "/contests/$contestId/leaderboard" });
    } catch (error) {
      setIsSubmitting(false);
      console.error(error);
    }
  }

  if (!loggedIn) {
    window.location.href = "/auth/login";
  }

  return loggedIn && <Page>
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
        <Heading size="md">{contest.name}</Heading>
        <Badge>{contest.type}</Badge>
        <Box width={"100%"} maxWidth={"800px"}>
          <Tabs index={tabIndex} onChange={handleTabsChange}>
            <TabList>
              <Tab>1</Tab>
              <Tab>2</Tab>
              <Tab>3</Tab>
              <Tab>4</Tab>
              <Tab>5</Tab>
              <Tab>Result</Tab>
            </TabList>
            <TabPanels>
              {solves.map((solve, i) => (
                <TabPanel key={solve.no}>
                  <Text fontSize="3xl">{contest.scrambles[i]}</Text>
                  <Input
                    value={solve.time}
                    onChange={(e) => setSolveTime(solve.no, e.target.value)}
                    placeholder="0:00.00"
                    width={"200px"}
                    size={"lg"}
                    margin={"10px"}
                  ></Input>
                  <br></br>
                  <Button
                    colorScheme="blue"
                    onClick={nextSolve}
                    marginTop={"10px"}
                  >
                    {tabIndex === 4 ? "Result" : "Next Solve"}
                  </Button>
                </TabPanel>
              ))}
              <TabPanel
                key="result"
                display={"flex"}
                alignItems={"center"}
                flexDirection={"column"}
              >
                <Table maxWidth={"400px"}>
                  <Tbody>
                    {solves.map((solve) => (
                      <Tr key={solve.no}>
                        <Td>Solve #{solve.no}</Td>
                        <Td>
                          {solve.time
                            ? <Text color={solve.no == result.best ? "green.500" : solve.no == result.worst ? "red.500" : ""}>{toTime(solve.timeMs as number)}</Text>
                            : "-"}
                        </Td>
                      </Tr>
                    ))}
                    <Tr>
                      <Td fontWeight={"bold"}>Ao5</Td>
                      <Td fontWeight={"bold"}>{result.ao5}</Td>
                    </Tr>
                  </Tbody>
                </Table>
                <Button
                  colorScheme="blue"
                  onClick={handlePostResults}
                  width={"100px"}
                  marginTop={"20px"}
                  isDisabled={isSubmitting}
                >
                  Submit
                </Button>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Stack>
    </Page>
  ;
}
