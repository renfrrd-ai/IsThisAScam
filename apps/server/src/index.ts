import "dotenv/config";
import { DEFAULT_PORT } from "@scamradar/shared";
import { createApp } from "./app";

const port = Number(process.env.PORT ?? DEFAULT_PORT);
const app = createApp();

app.listen(port, () => {
  console.log(`ScamRadar API listening on port ${port}`);
});

