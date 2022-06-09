import { sql } from "slonik";
import { getSimpleLookupQuery, SimpleLookup } from "./genericQueries";

type CleanData = {
  [key: string]: any;
};

export const getInsertQuery = (cleanData: CleanData, modelName: string) => {
  const dataEntries = Object.entries(cleanData);
  const columnNames = dataEntries.map((entry) => entry[0]);
  const identifiers = columnNames.map((key) => {
    return sql.identifier([key]);
  });
  const values = dataEntries.map((entry) => entry[1]);

  const q = sql`INSERT INTO ${sql.identifier([modelName])}(${sql.join(
    identifiers,
    sql`, `
  )}) VALUES (${sql.join(values, sql`, `)}) RETURNING *`;

  return q;
};

export const getDetailQuery = (modelName: string, lookUpData: SimpleLookup) => {
  const lookupQuery = getSimpleLookupQuery(lookUpData);
  return sql`SELECT * FROM ${sql.identifier([modelName])} ${lookupQuery}`;
};

const getUpdatePair = (columnName: string, value: any) => {
  return sql.join([sql.identifier([columnName]), value], sql` = `);
};

export const getUpdateQuery = (
  cleanData: CleanData,
  modelName: string,
  lookUpData: SimpleLookup
) => {
  const dataEntries = Object.entries(cleanData);
  const columnValuesPairs = dataEntries.map((entry) =>
    getUpdatePair(entry[0], entry[1])
  );
  const setIdentifiers = sql.join(columnValuesPairs, sql`,`);
  const lookupQuery = getSimpleLookupQuery(lookUpData);

  const updateQuery = sql`UPDATE ${sql.identifier([
    modelName,
  ])} SET ${setIdentifiers}`;

  return sql`${updateQuery} ${lookupQuery} RETURNING *`;
};

export const getDeleteQuery = (modelName: string, lookUpData: SimpleLookup) => {
  const lookupQuery = getSimpleLookupQuery(lookUpData);
  return sql`DELETE FROM ${sql.identifier([modelName])} ${lookupQuery}`;
};

export const getCrudQueries = (modelName: string, lookupField: string) => ({
  createOneQuery: (cleanData: CleanData) =>
    getInsertQuery(cleanData, modelName),
  updateOneQuery: (cleanData: CleanData, lookupValue: number) =>
    getUpdateQuery(cleanData, modelName, {
      field: lookupField,
      value: lookupValue,
    }),
  getOneQuery: (lookupValue: number) =>
    getDetailQuery(modelName, { field: lookupField, value: lookupValue }),
  deleteOneQuery: (lookupValue: number) =>
    getDeleteQuery(modelName, { field: lookupField, value: lookupValue }),
});
