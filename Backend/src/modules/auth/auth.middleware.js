import jwt from "jsonwebtoken";
import { Account } from "./auth.model.js";
import { env } from "../../config/env.js";

export const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  const decoded = jwt.verify(token, env.JWT_SECRET);
  req.user = await Account.findById(decoded.id);
  next();
};
