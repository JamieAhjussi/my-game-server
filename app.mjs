import e from "express";
import c from "cors";
import connectionPool from "./utils/db.mjs";

const app = e();

app.use(c());
app.use(e.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
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

app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Frontend local (Vite)
      "http://localhost:3000", // Frontend local (React แบบอื่น)
      "https://vercel.com/james-pongwats-projects/my-game/G5B7P1aWyxqnHnS2RSfGhNCSKdtP", // Frontend ที่ Deploy แล้ว
      // ✅ ให้เปลี่ยน https://your-frontend.vercel.app เป็น URL จริงของ Frontend ที่ deploy แล้ว
    ],
  })
);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;

