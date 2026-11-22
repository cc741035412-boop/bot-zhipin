-- 埋点事件表（docs/dev/TRACKING.md 第 6 节，决策 72）。只新建表和索引，不碰现有任何表。
-- name 不加 CHECK：事件表在 functions/_lib/events.ts 里，加事件不用迁移（决策 60 的教训）。
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY,
  at INTEGER NOT NULL,
  day TEXT NOT NULL,
  name TEXT NOT NULL,
  page TEXT NOT NULL,
  path TEXT NOT NULL,
  slug TEXT,
  sid TEXT NOT NULL,
  vid TEXT NOT NULL,
  device TEXT NOT NULL,
  country TEXT,
  props TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS events_day_name ON events (day, name);
CREATE INDEX IF NOT EXISTS events_at ON events (at);
