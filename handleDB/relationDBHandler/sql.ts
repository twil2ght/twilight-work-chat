export const RELATION_SQL = {
  CREATE: `INSERT INTO relations DEFAULT
           VALUES
           RETURNING *`,
  DELETE: `DELETE
           FROM relations
           WHERE id = $1 RETURNING *;`
}