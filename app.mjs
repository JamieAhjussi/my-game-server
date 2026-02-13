import e from "express";
import cors from "cors";
import connectionPool from "./utils/db.mjs";
import { ValidatePost, ValidatePut } from "./middleware/postValidation.mjs";

const app = e();

// Redundant app.use(c()) removed as it is configured below with origin restrictions.
app.use(e.json());

app.use(
  cors({
    origin: [
      "https://my-game-zeta-gules.vercel.app", // Frontend ที่ Deploy แล้ว
      "http://localhost:5173", // Vite dev server (default port)
      "http://localhost:3000", // Alternative dev port
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.get("/health", (req, res) => {
  console.log("Health endpoint hit!");
  console.log("Request headers:", req.headers);
  res.status(200).json({ message: "OK" });
});

app.get("/", (req, res) => {
    res.send("Hello World! Beautiful World!");
});



app.get("/posts", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const offset = (page - 1) * limit;

  try {
    const result = await connectionPool.query(
      "SELECT * FROM posts ORDER BY id ASC LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    return res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    console.error("DEBUG: Database error full details:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

app.get("/posts/:postId", async (req, res) => {
  const postIdFromClient = req.params.postId;

  try {
    const result = await connectionPool.query(
      "SELECT * FROM posts WHERE id = $1",
      [postIdFromClient]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      data: result.rows[0],
    });
  } catch (error) {
    console.error("DEBUG: Database error full details:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
});


app.post("/posts", [ValidatePost], async (req, res) => {

    const newPost = req.body;

    try {
        const query= `INSERT INTO posts (title, image, category_id, description, content, status_id)
        VALUES ($1, $2, $3, $4, $5, $6)`;

        const values = [
            newPost.title,
            newPost.image,
            newPost.category_id,
            newPost.description,
            newPost.content,
            newPost.status_id
        ];
    await connectionPool.query(query, values);
    } catch {
        return res.status(500).json({
            message : "Database connection error, failed to create new post."
        })
    }
    return res.status(201).json({
        message : "Post created succesfully"
    });
});

app.put("/posts/:postId", [ValidatePut], async (req, res) => {
  const postIdFromClient = req.params.postId;
  const updatedPost = req.body;

  try {
    const query = `
      UPDATE posts 
      SET title = $1, image = $2, category_id = $3, description = $4, content = $5, status_id = $6, date = NOW()
      WHERE id = $7
    `;
    const values = [
      updatedPost.title,
      updatedPost.image,
      updatedPost.category_id,
      updatedPost.description,
      updatedPost.content,
      updatedPost.status_id,
      postIdFromClient,
    ];

    const result = await connectionPool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      message: "Post updated successfully",
    });
  } catch (error) {
    console.error("DEBUG: Database error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

app.delete("/posts/:postId", async (req, res) => {
  const postIdFromClient = req.params.postId;

  try {
    const result = await connectionPool.query(
      "DELETE FROM posts WHERE id = $1",
      [postIdFromClient]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("DEBUG: Database error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

app.use((req, res) => {
  console.log("Unknown route hit:", req.originalUrl);
  res.status(404).json({ message: "Route not found" });
});



if (process.env.NODE_ENV !== "production") {
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;

