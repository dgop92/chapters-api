import { QueryResultRow, sql, TaggedTemplateLiteralInvocation } from "slonik";

export type SimpleLookup = {
  field: string;
  value: number | string | boolean;
};

export const getSimpleLookupQuery = (lookUpData: SimpleLookup) => {
  return sql`WHERE ${sql.identifier([lookUpData.field])}=${lookUpData.value}`;
};

export function getExitsQuery(
  modelName: string,
  lookupQuery: TaggedTemplateLiteralInvocation<QueryResultRow>
) {
  return sql`SELECT 1 from ${sql.identifier([modelName])} ${lookupQuery}`;
}
