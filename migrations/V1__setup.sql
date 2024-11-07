CREATE TABLE IF NOT EXISTS dependencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    who TEXT NOT NULL,
    what TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(who, what, value)
);

CREATE TABLE IF NOT EXISTS sources (
    source TEXT PRIMARY KEY,
    repository_name VARCHAR(255) NOT NULL,
    repository_owner VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dependency_sources (
    dependency_id INTEGER NOT NULL,
    source TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (dependency_id, source),
    FOREIGN KEY (dependency_id) REFERENCES dependencies(id) ON DELETE CASCADE,
    FOREIGN KEY (source) REFERENCES sources(source) ON DELETE CASCADE
);