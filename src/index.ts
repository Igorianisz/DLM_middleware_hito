import express, { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("middleware global");
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "hola" });
});

// Router User

const routerUser = Router();

routerUser.use((req: Request, res: Response, next: NextFunction) => {
  console.log("middleware of routerUser");
  next();
});

routerUser.get("/", (req: Request, res: Response) => {
  res.json({ message: "user" });
});

app.use("/user", routerUser);

//messages

const messages: string[] = [];

app.post("/message", (req: Request, res: Response) => {
  const { message } = req.body;
  messages.push(message);
  // res.json({ message: "message saved" });
  res.send("message send");
});

app.get("/message", (req: Request, res: Response) => {
  const message = messages.shift();
  if (!message) {
    return void res.status(204).end();
  }
  return void res.send({ message });
});

// Error handler

app.get("/breaksomething", (req: Request, res: Response) => {
  throw new Error("Something broke");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.message);
  res.status(500).json({ message: "Error", error: err.message });
});

// Server

app.listen(3000, () => {
  console.log("server on 3000");
});
