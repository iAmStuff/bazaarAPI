import { Router } from "express";
import argon2 from "argon2";
import userModel from "../models/userModel.js";
import { v4 as uuidv4 } from "uuid";

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
        $or: [{ userid: username.toLowerCase() }, { email }],
      })
    ) {
      // is it wise to avoid distinction between duplicate email and username responses here? less work for me anyway hah
      return res.status(400).send("Account with username/email already exists");
    }
    // TODO check if valid email/password

    const hash = await argon2.hash(password);

    const userData = {
      userid: username.toLowerCase(),
      username,
      email,
      password: hash,
    };

    const toSave = new userModel(userData);
    toSave.save();
    return res.status(201).send("Registration successful");
  } catch (e) {
    console.error(e);
    return res.status(500).send(e);
  }
});

router.post("/login", async (req, res, next) => {
  const { body } = req;
  const { username, password, email } = body;
  try {
    if ((!username && !email) || !password) {
      return res.status(401).send("send me the auth data dingaling");
    }

    //lookup user
    const userData = await userModel.findOne({
      $or: [{ userid: username?.toLowerCase() }, { email }],
    });
    if (!userData) {
      return res.status(400).send("Invalid username/password");
    }

    //verify password
    const validPass = await argon2.verify(userData.password, password);
    if (!validPass) {
      return res.status(400).send("Invalid username/password");
    }

    const token = uuidv4();
    userData.token = token;
    await userData.save();
    return res.json({ success: true, message: "Login successful!", token });
  } catch (e) {
    console.error(e);
    return res.status(500).send(e);
  }
});

export default router;
