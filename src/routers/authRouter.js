import { Router } from "express";
import argon2 from "argon2";
import userModel from "../models/userModel.js";

const router = Router();

router.post("/register", async (req, res, next) => {
  const { body } = req;
  const { username, password } = body;
  try {
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.post("/login", async (req, res, next) => {
  const { body } = req;
  const { username, password } = body;
  try {
  } catch (e) {
    return res.status(500).send(e);
  }
});
