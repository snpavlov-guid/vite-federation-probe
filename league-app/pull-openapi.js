import { writeFile } from "node:fs/promises";

const OPENAPI_URL = process.env.VITE_APP_FOOTBALL_OPENAPI;
const OUTPUT_FILE = "JeuxWebAPI-openapi-v1.yaml";

if (!OPENAPI_URL) {
  console.error("VITE_APP_FOOTBALL_OPENAPI is not set in .env");
  process.exit(1);
}

try {
  const response = await fetch(OPENAPI_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to download OpenAPI: ${response.status} ${response.statusText}`,
    );
  }

  const content = await response.text();
  await writeFile(OUTPUT_FILE, content, "utf8");

  console.log(`OpenAPI saved to ${OUTPUT_FILE}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
