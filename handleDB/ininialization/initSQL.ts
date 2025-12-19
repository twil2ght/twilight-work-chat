export const INIT_DB_SQL = `
    CREATE TABLE IF NOT EXISTS nodes
    (
        id         SERIAL PRIMARY KEY,
        content    TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS relations
    (
        id         SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'node_type_enum') THEN
                CREATE TYPE node_type_enum AS ENUM ('trigger', 'result');
            END IF;
        END $$;
    CREATE TABLE IF NOT EXISTS projection
    (
        id          SERIAL PRIMARY KEY,
        relation_id INTEGER NOT NULL,
        node_id     INTEGER NOT NULL,
        nodeType    node_type_enum NOT NULL,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(relation_id, node_id),
        FOREIGN KEY (relation_id) REFERENCES relations(id) ON DELETE CASCADE,
        FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE CASCADE
 
    );
    CREATE INDEX IF NOT EXISTS idx_node_content ON nodes (content);
    CREATE INDEX IF NOT EXISTS idx_map_relation ON projection (relation_id);
    CREATE INDEX IF NOT EXISTS idx_map_node ON projection (node_id);
`
