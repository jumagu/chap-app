import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const validateJWT = async (token) => {
  if (token.length === 0) return null;

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_JWT_KEY);

    const user = await User.findById(uid);

    if (!user) return null;

    if (!user.isActive) return null;

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};
