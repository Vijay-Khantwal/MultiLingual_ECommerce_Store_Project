import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import connect from "./config/db.js";

import { productRouter } from "./routes/ProductRoutes.js";
import { CategoryRouter } from "./routes/CategoryRoutes.js";
import { CartRouter } from "./routes/CartRoutes.js";
import { OrderRouter } from "./routes/OrderRoutes.js";
import { ReviewRouter } from "./routes/ReviewRoutes.js";
import { UserRouter } from "./routes/UserRoutes.js";

import { sellerOnly } from "./middleware/auth.js";
import { AuthRouter } from "./routes/AuthRoutes.js";
import { SellerRouter } from "./routes/SellerRoutes.js";
import { PaymentRouter } from "./routes/PaymentRoutes.js";

const ex = express();
ex.use(express.urlencoded({ extended: true }));
ex.use(express.json());
// ex.use(cors());
ex.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
const PORT = process.env.PORT || 5000;

await connect();

ex.use("/api/users", UserRouter);
ex.use("/api/seller", SellerRouter);
ex.use("/api/products", productRouter);
ex.use("/api/categories", CategoryRouter);
ex.use("/api/cart", CartRouter);
ex.use("/api/orders", OrderRouter);
ex.use("/api/reviews", ReviewRouter);
ex.use("/api/auth", AuthRouter);
ex.use("/api/payment", PaymentRouter);

ex.listen(PORT, () => console.log(`Listening on Port ${PORT}...`));
