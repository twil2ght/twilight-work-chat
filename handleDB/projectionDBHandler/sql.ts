export const PROJECTION_CRUD_SQL = {
  CREATE: `WITH ins AS (
      INSERT INTO projection (relation_id, node_id, nodeType)
          VALUES ($1, $2, $3)
          ON CONFLICT (relation_id, node_id) DO NOTHING
          RETURNING *
  )
           -- 优先返回插入结果（有则是新数据），无则查现有数据
           SELECT * FROM ins
           UNION ALL
           SELECT * FROM projection WHERE relation_id = $1 AND node_id = $2
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