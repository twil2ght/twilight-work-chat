export const NODE_CRUD_SQL = {
  CREATE: `
  WITH ins AS (
    INSERT INTO nodes(content) 
    VALUES($1) 
    ON CONFLICT (content) DO NOTHING 
    RETURNING id, content, created_at
  )
  SELECT id, content, created_at FROM ins
  UNION ALL
  SELECT id, content, created_at FROM nodes WHERE content = $1
  LIMIT 1;
`,
  DELETE:`DELETE FROM nodes WHERE id = $1 RETURNING id, content, created_at;`,
  UPDATE: `
    WITH conflict_check AS (
      SELECT id,content,created_at 
      FROM nodes 
      WHERE content = $1  -- 目标content值
        AND id != $2      -- 排除当前要更新的节点ID
      LIMIT 1
    ),
    -- 步骤2：只有无冲突时，才执行更新
    upd AS (
      UPDATE nodes 
      SET content = $1 
      WHERE id = $2                -- 要更新的节点ID
        AND NOT EXISTS (SELECT 1 FROM conflict_check)  -- 无冲突才更新
      RETURNING id, content, created_at
    )
    -- 步骤3：优先返回冲突节点（若有），否则返回更新后的节点
    SELECT id,content,created_at FROM conflict_check
    UNION ALL
    SELECT id,content,created_at FROM upd
    LIMIT 1;  -- 确保仅返回1行
  `,
  FIND:`SELECT id,content,created_at FROM nodes WHERE id = $1;`
}