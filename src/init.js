import "dotenv/config"
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const port = process.env.PORT;

const handleListening = () =>
console.log(`✅ Server listening on port http://localhost:${port}`);

app.listen(port, handleListening);
