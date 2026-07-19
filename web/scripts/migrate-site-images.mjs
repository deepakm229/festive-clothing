import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = join(__dirname, "..");
const repoRoot = join(webRoot, "..");

const SITE_IMAGES = [
  {
    key: "hero",
    storagePath: "site/hero.jpg",
    sourceUrl:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80",
  },
  {
    key: "promo",
    storagePath: "site/promo.jpg",
    sourceUrl:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1600&q=80",
  },
  {
    key: "category_kurta",
    storagePath: "site/category-kurta.jpg",
    sourceUrl:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
  },
  {
    key: "category_lehenga",
    storagePath: "site/category-lehenga.jpg",
    sourceUrl:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80",
  },
  {
    key: "category_festive",
    storagePath: "site/category-festive.jpg",
    sourceUrl:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
  },
  {
    key: "placeholder",
    storagePath: "site/placeholder.jpg",
    sourceUrl:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
  },
];

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;

  const content = readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
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
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function loadEnv() {
  loadEnvFile(join(repoRoot, ".env"));
  loadEnvFile(join(webRoot, ".env"));
  loadEnvFile(join(webRoot, ".env.local"));
}

function getEnv() {
  loadEnv();

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    "";

  if (!url) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) in web/.env.local",
    );
  }
  if (!anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_ANON_KEY) in web/.env.local",
    );
  }

  return { url, anonKey };
}

async function downloadImage(sourceUrl) {
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to download ${sourceUrl}: ${response.status}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  return { buffer, contentType };
}

async function verifyUpload(supabase, storagePath) {
  const { data, error } = await supabase.storage
    .from("clothes-images")
    .download(storagePath);

  if (error || !data?.size) {
    throw new Error(
      `Upload verification failed for ${storagePath}: ${error?.message ?? "empty file"}`,
    );
  }
}

async function warnIfPublicUrlBroken() {
  console.warn(
    "\nWarning: public image URLs are not reachable. Run this in Supabase SQL Editor:",
  );
  console.warn(
    "  UPDATE storage.buckets SET public = true WHERE id = 'clothes-images';",
  );
}

async function main() {
  const { url, anonKey } = getEnv();
  const supabase = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("Uploading site images to clothes-images bucket...\n");

  let publicUrlBroken = false;

  for (const image of SITE_IMAGES) {
    process.stdout.write(`  ${image.key} → ${image.storagePath} ... `);

    const { buffer, contentType } = await downloadImage(image.sourceUrl);
    const { error } = await supabase.storage
      .from("clothes-images")
      .upload(image.storagePath, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Upload failed for ${image.key}: ${error.message}`);
    }

    await verifyUpload(supabase, image.storagePath);

    const {
      data: { publicUrl },
    } = supabase.storage.from("clothes-images").getPublicUrl(image.storagePath);

    try {
      const response = await fetch(publicUrl);
      if (!response.ok) publicUrlBroken = true;
    } catch {
      publicUrlBroken = true;
    }

    console.log("ok");
  }

  if (publicUrlBroken) {
    warnIfPublicUrlBroken();
  }

  console.log("\nDone. Run sql/site_assets.sql if you have not already seeded site_assets.");
}

main().catch((error) => {
  console.error("\nMigration failed:", error.message);
  process.exit(1);
});
