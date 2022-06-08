import { QueryResultRow, sql, TaggedTemplateLiteralInvocation } from "slonik";

export type SimplePkLookup = {
  field: string;
  value: number;
};

export const getSimplePkLookupQuery = (lookUpData: SimplePkLookup) => {
  return sql`WHERE ${sql.identifier([lookUpData.field])}=${lookUpData.value}`;
};

export async function getExitsQuery(
  modelName: string,
  lookupQuery: TaggedTemplateLiteralInvocation<QueryResultRow>
) {
  return sql`SELECT 1 from ${sql.identifier([modelName])} ${lookupQuery}`;
}
