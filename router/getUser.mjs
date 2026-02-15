import connectionPool from "../utils/db.mjs";

const authRouter = Router();

authRouter.get("/get-user", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      return res.status(401).json({ error: "Unauthorized or token expired" });
    }
    const supabaseUserId = data.user.id;
    const query = `
      SELECT * FROM users
      WHERE id = $1
    `;
    const values = [supabaseUserId];
    const { rows } = await connectionPool.query(query, values);
    res.status(200).json({
      id: data.user.id,
      email: data.user.email,
      username: rows[0].username,
      name: rows[0].name,
      role: rows[0].role,
      profilePic: rows[0].profile_pic,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});