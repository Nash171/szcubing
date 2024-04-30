// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { randomScrambleForEvent } from "cubing/scramble";
import pg from 'pg';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME, 
  password: process.env.DB_PASSWORD,
  port: 23434,
});

console.log("pool", pool);

app.get("/contests", async (req: Request, res: Response) => {
  try {
    const contests = await pool.query(`SELECT * FROM contests`);
    res.status(200).json(contests);
  } catch (error: any) {
    console.error("Error fetching contests:", error);
    res.status(500).send(error);
  }
});

app.get("/contests/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const contest = await pool.query("SELECT * FROM contests WHERE id = $1", [id]);

    if (!contest) {
      return res.status(404).send({ message: "Contest not found" });
    }

    res.status(200).json(contest);
  } catch (error: any) {
    console.error("Error fetching contest:", error);
    res.status(500).send(error);
  }
});

app.post("/contests", async (req: Request, res: Response) => {
  try {
    const { name, type, started, status } = req.body;
    const scrambles: object[] = [];
    for (let i = 0; i < 5; i++) {
      const scramble = await randomScrambleForEvent(type).toString();
      scrambles.push({
        no: i + 1,
        scramble: scramble,
      });
    }

    const result = await pool.query(
      "INSERT INTO contests (name, type, started, status, scrambles) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, type, started, status, scrambles]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error creating contest:", error);
    res.status(500).send(error);
  }
});

app.put("/contests/:id", async (req: Request, res: Response) => {
  
  const { id } = req.params;
  const { name, type, started, status } = req.body;
  const result = await pool.query(
    "UPDATE contests SET name = $1, type = $2, started = $3, status = $4 WHERE id = $5 RETURNING *",
    [name, type, started, status, id]
  )
})

app.delete("/contests/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM contests WHERE id = $1", [id]);
    res.status(200).send({ message: "Contest deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting contest:", error);
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
