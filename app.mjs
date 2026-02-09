import e from "express";
import cors from "cors";
import connectionPool from "./utils/db.mjs";

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
    try {
        const result = await connectionPool.query("SELECT * FROM posts");
        return res.status(200).json({
            data: result.rows
        });
    } catch (error) {
        console.error("DEBUG: Database error full details:", error);
        return res.status(500).json({
            message: "Server error"
        });
    }
});


app.post("/posts", async (req, res) => {

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

