import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signToken = (account) =>
  jwt.sign(
    { id: account._id, role: account.role },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );
