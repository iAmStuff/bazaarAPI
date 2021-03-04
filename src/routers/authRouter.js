import { Router } from "express";
import argon2 from "argon2";
import userModel from "../models/userModel.js";

const router = Router();

router.post("/register", async (req, res, next) => {
  const { body } = req;
  const { username, password, email } = body;
  try {
    if (!username || !password || !email) {
      return res.status(401).send("send me the auth data dingaling");
    }

    //check if uID or email is already taken
    if (
      await userModel.findOne({
        userid: username.toLowerCase(),
      })
    ) {
      // is it wise to avoid distinction between duplicate email and username responses here? less work for me anyway hah
      return res.status(400).send("Account with username/email already exists");
    }
    // TODO check if valid email/password

    //hash password
    const hash = await argon2.hash(password);

    //save to db
    const userData = {
      userid: username.toLowerCase(),
      username,
      email,
      password: hash,
    };

    const toSave = new userModel(userData);
    toSave.toSave();
    return res.status(201).send("Registration successful");
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.post("/login", async (req, res, next) => {
  const { body } = req;
  const { username, password } = body;
  try {
    if (!username || !password) {
      return res.status(401).send("send me the auth data dingaling");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

export default router;
