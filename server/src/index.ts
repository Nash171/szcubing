import cors from 'cors';
import express, { Request, Response } from "express";
import contestRoutes from './routes/contests';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json()); // Add this line to enable JSON parsing in the request body
app.use('/contests', contestRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("SZCubing Server");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
