import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = join(__dirname, "..");
const repoRoot = join(webRoot, "..");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(join(repoRoot, ".env"));
loadEnvFile(join(webRoot, ".env"));
loadEnvFile(join(webRoot, ".env.local"));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(url, key);
const paths = [
  "site/category-kurta.jpg",
  "site/category-lehenga.jpg",
  "site/category-festive.jpg",
];

const expectedNew = {
  "site/category-kurta.jpg": "1762708549049",
  "site/category-lehenga.jpg": "1762201698238",
  "site/category-festive.jpg": "1769773650757",
};

const expectedOld = {
  "site/category-kurta.jpg": "1596755094514",
  "site/category-lehenga.jpg": "1566174053879",
  "site/category-festive.jpg": "1490481651871",
};

const { data: assets, error: assetsErr } = await supabase
  .from("site_assets")
  .select("key, storage_path, updated_at")
  .in("key", [
    "category_men",
    "category_women",
    "category_kids",
    "category_kurta",
    "category_lehenga",
    "category_festive",
  ]);

console.log("site_assets:", JSON.stringify(assets, null, 2));
if (assetsErr) console.log("site_assets error:", assetsErr.message);

for (const storagePath of paths) {
  const publicUrl = `${url}/storage/v1/object/public/clothes-images/${storagePath}`;
  const res = await fetch(publicUrl, { cache: "no-store" });
  const buf = Buffer.from(await res.arrayBuffer());

  console.log(`\n${storagePath}`);
  console.log("  public URL:", publicUrl);
  console.log("  status:", res.status, "bytes:", buf.length);
  console.log("  cache-control:", res.headers.get("cache-control"));
  console.log("  etag:", res.headers.get("etag"));
  console.log("  last-modified:", res.headers.get("last-modified"));

  const { data, error } = await supabase.storage
    .from("clothes-images")
    .download(storagePath);

  if (error) {
    console.log("  storage download error:", error.message);
  } else {
    const storageBuf = Buffer.from(await data.arrayBuffer());
    console.log("  storage download bytes:", storageBuf.length);
    console.log(
      "  storage matches public fetch:",
      storageBuf.length === buf.length,
    );
  }

  console.log("  expected NEW unsplash id present:", expectedNew[storagePath]);
  console.log("  expected OLD unsplash id present:", expectedOld[storagePath]);
}
