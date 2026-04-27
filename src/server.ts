import { app } from "./app";
import { env } from "./config/env";

app.listen(env.port, "0.0.0.0", () => {
  console.log(`🚀 LMS API running on http://localhost:${env.port}`);
});
