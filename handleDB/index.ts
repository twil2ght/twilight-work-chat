import {IdentityDBHandler, NodeDBHandler, ProjectionDBHandler, RelationDBHandler} from './handler'

export const [handlerN, handlerR, handlerP,handlerI] =
    [new NodeDBHandler(),new RelationDBHandler(),new ProjectionDBHandler(),new IdentityDBHandler()];

