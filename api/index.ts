import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { registerRoutes } from "../server/routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// API routes
await registerRoutes(app);

// Catch-all handler for client-side routing
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    res.status(404).json({ message: "API endpoint not found" });
  } else {
    res.sendFile(join(__dirname, "../client/dist/index.html"));
  }
});

// For Vercel serverless functions
export default app;