import {IdentityDBHandler, NodeDBHandler, ProjectionDBHandler, RelationDBHandler} from './handler'
import {SQL_I, SQL_IN} from "@/src/handleDB/sql";

export const [handlerN, handlerR, handlerP,handlerI,handlerIN] =
    [new NodeDBHandler(),new RelationDBHandler(),new ProjectionDBHandler(),new IdentityDBHandler(SQL_I),new IdentityDBHandler(SQL_IN)];

