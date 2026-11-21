CREATE TABLE click_counts_new (
  slug TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('import','prompt','starter','kickoff')),
  n INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (slug, kind)
) WITHOUT ROWID;

INSERT INTO click_counts_new (slug, kind, n)
SELECT slug, kind, n FROM click_counts;

DROP TABLE click_counts;
ALTER TABLE click_counts_new RENAME TO click_counts;
