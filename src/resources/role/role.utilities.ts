import { getDetailQuery, getInsertQuery } from "@db/crudQueries";
import db from "@db/db";

export type Role = {
  pk: number;
  rolename: string;
};

export const createRole = async (rolename: string) => {
  const query = getInsertQuery({ rolename }, "role");
  const res = await db.one(query);
  return res as Role;
};

export const getRole = async (rolename: string) => {
  const query = getDetailQuery("role", {
    field: "rolename",
    value: rolename,
  });
  const res = await db.one(query);
  return res as Role;
};
