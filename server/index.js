import dotenv from "dotenv";
dotenv.config();

const { default: app } = await import("./src/server.js");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
