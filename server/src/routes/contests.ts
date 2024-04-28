import { Router, Request, Response } from "express";

const router = Router();
let contests: any = [];

enum ContestStatus {
  RUNNING = "RUNNING",
  ENDED = "ENDED",
}

enum ContestType {
  "2x2x2" = "222",
  "3x3x3" = "333",
  "4x4x4" = "333",
}

router.get("/", (req: Request, res: Response) => {
  res.json(contests);
});

router.post("/", async (req: Request, res: Response) => {
  contests.push({
    id: new Date().getTime().toString(),
    name: req.body.name,
    type: req.body.type,
    started: new Date(),
    status: "RUNNING",
    scrambles: req.body.scrambles,
    results: [],
  });

  return res.status(201).send();
});

router.get("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const contest = contests.find((c: any) => c.id === id);
  return res.json(contest);
});

router.put("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const contest = contests.find((c: any) => c.id === id);
  contest.name = req.body.name;
  contest.type = req.body.type;
  contest.status = req.body.status;
  return res.json(contest);
});

router.delete("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const index = contests.findIndex((c: any) => c.id === id);
  contests.splice(index, 1);
  return res.send();
});

router.post("/:id/result", (req: Request, res: Response) => {
  const id = req.params.id;
  const contest = contests.find((c: any) => c.id === id);
  contest.results.push(req.body);
  return res.send();
})

export default router;
