import "dotenv/config";
import app from "./app";
import { ENV } from "./config/env";

console.log("hi")
const PORT = Number(ENV.PORT) || 3000;


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// src/server.ts
