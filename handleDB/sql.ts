export const SQL_N = {
  CREATE: `
      WITH ins AS (
          INSERT INTO nodes (content)
              VALUES ($1)
              ON CONFLICT (content) DO NOTHING
              RETURNING id, content, created_at)
      SELECT id, content, created_at
      FROM ins
      UNION ALL
      SELECT id, content, created_at
      FROM nodes
      WHERE content = $1
      LIMIT 1;
  `,
  DELETE: `DELETE
           FROM nodes
           WHERE id = $1
           RETURNING id, content, created_at;`,
  UPDATE: `
      WITH conflict_check AS (SELECT id, content, created_at
                              FROM nodes
                              WHERE content = $1 -- 目标content值
                                AND id != $2     -- 排除当前要更新的节点ID
                              LIMIT 1),
           -- 步骤2：只有无冲突时，才执行更新
           upd AS (
               UPDATE nodes
                   SET content = $1
                   WHERE id = $2 -- 要更新的节点ID
                       AND NOT EXISTS (SELECT 1 FROM conflict_check) -- 无冲突才更新
                   RETURNING id, content, created_at)
      -- 步骤3：优先返回冲突节点（若有），否则返回更新后的节点
      SELECT id, content, created_at
      FROM conflict_check
      UNION ALL
      SELECT id, content, created_at
      FROM upd
      LIMIT 1; -- 确保仅返回1行
  `,
  FIND: `SELECT id, content, created_at
         FROM nodes
         WHERE id = $1;`,
  FIND_BY_VAL:`SELECT id, content, created_at
               FROM nodes
               WHERE content = $1;`
}
export const SQL_P = {
  CREATE: `WITH ins AS (
      INSERT INTO projection (relation_id, node_id, nodeType)
          VALUES ($1, $2, $3)
          ON CONFLICT (relation_id, node_id, nodetype) DO NOTHING
          RETURNING *)
           -- 优先返回插入结果（有则是新数据），无则查现有数据
           SELECT *
           FROM ins
           UNION ALL
           SELECT *
           FROM projection
           WHERE relation_id = $1
             AND node_id = $2
           LIMIT 1;`,  // LIMIT 1 确保仅返回1行（插入/查询二选一）

  DELETE: `DELETE
           FROM projection
           WHERE id = $1
           RETURNING *;`,
  FIND: {
    BY_NODE: `
        SELECT *
        FROM projection
        WHERE node_id = $1;`,
    BY_RELATION: `
        SELECT *
        FROM projection
        WHERE relation_id = $1;`
  }
} as const;
export const SQL_R = {
  CREATE: `INSERT INTO relations DEFAULT
           VALUES
           RETURNING *`,
  DELETE: `DELETE
           FROM relations
           WHERE id = $1
           RETURNING *;`
}
export const SQL_I = {
  CREATE: `WITH ins AS (
      INSERT INTO identity (k, v)
          VALUES ($1, $2)
          ON CONFLICT (k, v) DO NOTHING
          RETURNING *)
           -- 优先返回插入结果（有则是新数据），无则查现有数据
           SELECT *
           FROM ins
           UNION ALL
           SELECT *
           FROM identity
           WHERE k = $1
             AND v = $2
           LIMIT 1;`,  // LIMIT 1 确保仅返回1行（插入/查询二选一）

  DELETE: `DELETE
           FROM identity
           WHERE id = $1
           RETURNING *;`,
  FIND: {
    BY_V: `
        SELECT *
        FROM identity
        WHERE v = $1;`,
    BY_K: `
        SELECT *
        FROM identity
        WHERE k = $1;`,
    BY_KV: `
        SELECT *
        FROM identity
        WHERE k = $1 AND v = $2;`
  }
}
export const SQL_IN = {
  CREATE: `WITH ins AS (
      INSERT INTO identityN (k, v)
          VALUES ($1, $2)
          ON CONFLICT (k, v) DO NOTHING
          RETURNING *)
           -- 优先返回插入结果（有则是新数据），无则查现有数据
           SELECT *
           FROM ins
           UNION ALL
           SELECT *
           FROM identityN
           WHERE k = $1
             AND v = $2
           LIMIT 1;`,  // LIMIT 1 确保仅返回1行（插入/查询二选一）

  DELETE: `DELETE
           FROM identityN
           WHERE id = $1
           RETURNING *;`,
  FIND: {
    BY_V: `
        SELECT *
        FROM identityN
        WHERE v = $1;`,
    BY_K: `
        SELECT *
        FROM identityN
        WHERE k = $1;`,
    BY_KV: `
        SELECT *
        FROM identityN
        WHERE k = $1 AND v = $2;`
  }
}
export const SQL_INIT = `
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
    DO
    $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'node_type_enum') THEN
                CREATE TYPE node_type_enum AS ENUM ('trigger', 'result');
            END IF;
        END
    $$;
    CREATE TABLE IF NOT EXISTS projection
    (
        id          SERIAL PRIMARY KEY,
        relation_id INTEGER        NOT NULL,
        node_id     INTEGER        NOT NULL,
        nodeType    node_type_enum NOT NULL,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (relation_id, node_id,nodeType),
        FOREIGN KEY (relation_id) REFERENCES relations (id) ON DELETE CASCADE,
        FOREIGN KEY (node_id) REFERENCES nodes (id) ON DELETE CASCADE

    );
    CREATE TABLE IF NOT EXISTS identity
    (
        id         SERIAL PRIMARY KEY,
        k          TEXT NOT NULL,
        v          TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS identityN
    (
        id         SERIAL PRIMARY KEY,
        k          TEXT NOT NULL,
        v          TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_node_content ON nodes (content);
    CREATE INDEX IF NOT EXISTS idx_map_relation ON projection (relation_id);
    CREATE INDEX IF NOT EXISTS idx_map_node ON projection (node_id);
    CREATE INDEX IF NOT EXISTS idx_map_k ON identity (k);
    CREATE INDEX IF NOT EXISTS idx_map_v ON identity (v);
    CREATE INDEX IF NOT EXISTS idx_map_k_N ON identityN (k);
    CREATE INDEX IF NOT EXISTS idx_map_v_N ON identityN (v);
`
export const SQL_RESET = `
    TRUNCATE TABLE projection, relations, nodes CASCADE;
    ALTER SEQUENCE nodes_id_seq RESTART WITH 1;
    ALTER SEQUENCE relations_id_seq RESTART WITH 1;
    ALTER SEQUENCE projection_id_seq RESTART WITH 1;
`;