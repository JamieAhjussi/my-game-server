import e from "express";
import cors from "cors";
import postRouter from "./router/postRouter.mjs";

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

app.use("/posts", postRouter);

app.get("/health", (req, res) => {
  console.log("Health endpoint hit!");
  console.log("Request headers:", req.headers);
  res.status(200).json({ message: "OK" });
});

app.get("/", (req, res) => {
    res.send("Hello World! Beautiful World!");
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

