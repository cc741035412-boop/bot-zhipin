CREATE TABLE IF NOT EXISTS click_dedupe (
  slug TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  last_at INTEGER NOT NULL,
  PRIMARY KEY (slug, ip_hash)
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS click_counts (
  slug TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('import','prompt')),
  n INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (slug, kind)
) WITHOUT ROWID;
