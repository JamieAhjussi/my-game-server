import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import connectionPool from "../utils/db.mjs";
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
const authRouter = Router();
// จะเพิ่ม routes ต่างๆ ที่นี่
authRouter.post("/register", async (req, res) => {
  const { email, password, username, name } = req.body;
  try {
    const usernameCheckQuery = `
      SELECT * FROM users
      WHERE username = $1
    `;
    const usernameCheckValues = [username];
    const { rows: existingUser } = await connectionPool.query(
      usernameCheckQuery,
      usernameCheckValues
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "This username is already taken" });
    }

    const { data, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (supabaseError) {
      if (supabaseError.code === "user_already_exists") {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }
      return res
        .status(400)
        .json({ error: "Failed to create user. Please try again." });
    }

    const supabaseUserId = data.user.id;
    const query = `
      INSERT INTO users (id, username, name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [supabaseUserId, username, name, "user"];
    const { rows } = await connectionPool.query(query, values);
    res.status(201).json({
      message: "User created successfully",
      user: rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during registration" });
  }
});


export default authRouter;