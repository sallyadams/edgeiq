import { Pool } from "pg";
import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigrations() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");

  const pool = new Pool({ connectionString: url });

  try {
    const migrationsFolder = path.join(__dirname, "../migrations");
    console.log("[migrate] Running migrations from", migrationsFolder);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "_edgeiq_migrations" (
        tag text PRIMARY KEY,
        applied_at timestamptz DEFAULT now()
      )
    `);

    const journalRaw = await readFile(
      path.join(migrationsFolder, "meta/_journal.json"),
      "utf-8"
    );
    const journal = JSON.parse(journalRaw) as {
      entries: { idx: number; tag: string }[];
    };

    for (const entry of journal.entries) {
      const { rows } = await pool.query(
        "SELECT tag FROM _edgeiq_migrations WHERE tag = $1",
        [entry.tag]
      );

      if (rows.length > 0) {
        console.log(`[migrate] Already applied: ${entry.tag}`);
        continue;
      }

      const sqlFile = path.join(migrationsFolder, `${entry.tag}.sql`);
      const sql = await readFile(sqlFile, "utf-8");

      const tablesExist = await checkAnyTableExists(pool, sql);

      if (tablesExist) {
        console.log(`[migrate] Baseline (tables already exist): ${entry.tag}`);
        await pool.query(
          "INSERT INTO _edgeiq_migrations (tag) VALUES ($1)",
          [entry.tag]
        );
      } else {
        console.log(`[migrate] Applying: ${entry.tag}`);
        const statements = sql
          .split("--> statement-breakpoint")
          .map((s) => s.trim())
          .filter(Boolean);

        for (const stmt of statements) {
          await pool.query(stmt);
        }

        await pool.query(
          "INSERT INTO _edgeiq_migrations (tag) VALUES ($1)",
          [entry.tag]
        );
        console.log(`[migrate] Applied: ${entry.tag}`);
      }
    }

    console.log("[migrate] All migrations complete");
  } finally {
    await pool.end();
  }
}

async function checkAnyTableExists(pool: Pool, sql: string): Promise<boolean> {
  const tableNames = [...sql.matchAll(/CREATE TABLE "(\w+)"/g)].map(
    (m) => m[1]
  );
  if (tableNames.length === 0) return false;

  const { rows } = await pool.query(
    `SELECT COUNT(*) AS count FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = ANY($1)`,
    [tableNames]
  );

  return Number(rows[0].count) > 0;
}

runMigrations().catch((err) => {
  console.error("[migrate] Failed:", err);
  process.exit(1);
});
