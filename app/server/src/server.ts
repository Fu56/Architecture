import { app } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

(async () => {
  await connectDB();
  const server = app.listen(env.port, () =>
    console.log(`Server running on http://localhost:${env.port}`)
  );
  server.timeout = 3600000; // 1 hour
})();
