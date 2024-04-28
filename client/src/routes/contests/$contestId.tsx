import { Link, createFileRoute } from "@tanstack/react-router";
import { fetchContest } from "../../util/api";
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
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Page from "../../components/Page";

export const Route = createFileRoute("/contests/$contestId")({
  component: Contest,
  loader: ({ params: { contestId } }) => {
    return fetchContest(contestId);
  },
});

const toMilliseconds = (time: string) => {
  const [minutesStr, remainingStr = "00.000"] = time.split(":");
  const [secondsStr, millisecondsStr = "000"] = remainingStr.split(".");

  const minutes = parseInt(minutesStr) || 0;
  const seconds = parseInt(secondsStr);
  const milliseconds = parseInt(millisecondsStr);

  return minutes * 60 * 1000 + seconds * 1000 + milliseconds;
};

const toTime = (timeMs: number) => {
  const minutes = Math.floor(timeMs / 1000 / 60);
  const seconds = Math.floor((timeMs / 1000) % 60);
  const milliseconds = Math.floor(timeMs % 1000);
  return `${minutes}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(2, "0")}`;
};

function Contest() {
  const contest = Route.useLoaderData();
  const [tabIndex, setTabIndex] = useState(0);
  const [solves, setSolves] = useState(
    Array.from({ length: 5 }, (_, i) => ({
      no: i + 1,
      scramble: "",
      time: "",
      timeMs: 0,
      penalty: 0,
    }))
  );
  const [result, setResult] = useState({
    best: "",
    ao5: "",
  });

  useEffect(() => {
    if (tabIndex === 5) {
      // take a copy of the solves
      const times = [...solves];
      times.sort((a, b) => a.timeMs - b.timeMs);

      const ao5 =
        times.slice(1, 4).reduce((acc, cur) => acc + cur.timeMs, 0) / 3;

      setResult({
        ao5: toTime(ao5),
        best: times[0].time,
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
      <Stack direction="column" spacing={4} alignItems={"center"}>
        <Heading size="md">{contest.name}</Heading>
        <Badge>{contest.type}</Badge>
        <Box>
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
              {solves.map((solve) => (
                <TabPanel key={solve.no}>
                  <Text>{solve.scramble}</Text>
                  <Input
                    value={solve.time}
                    onChange={(e) => setSolveTime(solve.no, e.target.value)}
                    placeholder="0:00.00"
                  ></Input>
                  <Button onClick={nextSolve}>Next Solve</Button>
                </TabPanel>
              ))}
              <TabPanel key="result">
                <Text>Best {result.best}</Text>
                <Text>Ao5 {result.ao5}</Text>
                <Button onClick={nextSolve}>Submit</Button>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Stack>
    </Page>
  );
}
