import { updateBrand } from './controllers/brandCtrl';
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import { dbConnect } from "./config/dbConnect";
import { errorHandler, notFound } from "./middlewares/errorHandler";
import User from "./routes/user";
import Product from "./routes/product";
import Blog from "./routes/blog";
import Category from "./routes/productCategory";
import BlogCategory from "./routes/blogCategory";
import Brand from "./routes/brand";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

dbConnect();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", User);
app.use("/api/product", Product);
app.use("/api/blog", Blog);
app.use("/api/category", Category);
app.use("/api/blogcategory", BlogCategory);
app.use("/api/brand", Brand);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
