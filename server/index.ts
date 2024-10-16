import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes/routes";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", router);
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
