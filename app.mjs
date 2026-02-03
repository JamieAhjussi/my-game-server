import e from "express";
import c from "cors";

const app = e();

app.use(c());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/profiles", (req, res) => {
    return res.json({
        name: "John Doe",
        age: 30,
        email: "[EMAIL_ADDRESS]"
    });
});

export default app;

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

