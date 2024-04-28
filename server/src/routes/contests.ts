import { Router, Request, Response } from "express";

const router = Router();
let contests: any = [
  {
    id: "TEST001",
    name: "Test Contest #1",
    type: "3x3x3",
    started: new Date(),
    status: "RUNNING",
  },
  {
    id: "TEST002",
    name: "Test Contest #2",
    type: "2x2x2",
    started: new Date(),
    status: "RUNNING",
  },
  {
    id: "TEST003",
    name: "Test Contest #3",
    type: "4x4x4",
    started: new Date(),
    status: "RUNNING",
  },
];

router.get("/", (req: Request, res: Response) => {
  res.json(contests);
});

router.post("/", (req: Request, res: Response) => {
  contests.push({
    id: req.body.id,
    name: req.body.name,
    type: req.body.type,
    started: new Date(),
    status: "RUNNING",
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
  contest.id = req.body.id;
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
})

export default router;
