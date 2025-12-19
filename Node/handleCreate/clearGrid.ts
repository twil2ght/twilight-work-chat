import {projectionDBHandler} from "../../handleDB";

export async function clearGrid(relationIdx:number){
    const projections=await projectionDBHandler.queryProjectionByRelationId(relationIdx);
    await Promise.all(
        projections.map(async (projection) => {
          await projectionDBHandler.deleteProjectionById(projection.id);
        })
    )
}