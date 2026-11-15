CREATE TABLE IF NOT EXISTS rate_limits (
  bucket TEXT NOT NULL, key TEXT NOT NULL, window INTEGER NOT NULL,
  n INTEGER NOT NULL DEFAULT 0, bytes INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (bucket, key, window)
);
CREATE TABLE IF NOT EXISTS web_submissions (
  user_id INTEGER NOT NULL, slug TEXT NOT NULL, pr_number INTEGER NOT NULL,
  branch TEXT NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, slug)
);
