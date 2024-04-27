import { createFileRoute } from "@tanstack/react-router";
import Contests from "../components/Contests";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Contests />
    </>
  );
}
