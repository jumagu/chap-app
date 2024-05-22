import { Router } from "express";
import { check } from "express-validator";

import {
  login,
  renewToken,
  googleSignIn,
} from "../controllers/auth.controller.js";
import { fieldsValidator, JWTValidator } from "../middlewares/index.js";

const router = Router();

router.post(
  "/login",
  [
    check("email", "Email is required").not().isEmpty(),
    check("email", "Ivalid email pattern").isEmail(),
    check("password", "Password is required").not().isEmpty(),
    fieldsValidator,
  ],
  login
);

router.post(
  "/google",
  [check("id_token", "id_token is required").not().isEmpty(), fieldsValidator],
  googleSignIn
);

router.get("/", JWTValidator, renewToken);

export default router;
