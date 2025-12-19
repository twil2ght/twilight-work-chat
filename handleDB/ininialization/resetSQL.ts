export const RESET_TEST_DB_SQL = `
    TRUNCATE TABLE projection, relations, nodes CASCADE;
    ALTER SEQUENCE nodes_id_seq RESTART WITH 1;
    ALTER SEQUENCE relations_id_seq RESTART WITH 1;
    ALTER SEQUENCE projection_id_seq RESTART WITH 1;
`;