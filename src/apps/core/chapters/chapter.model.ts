import db from "@db/db";
import Joi from "joi";
import { getCrudQueries } from "@db/crudQueries";
import { checkResourceExists } from "@db/genericOperations";
import { CleanData, CrudModel } from "@db/types";

export type Chapter = {
  pk: number;
  name: string;
  faculty: string;
  departament: string;
  career: string;
};

const name = Joi.string().max(95);
const faculty = Joi.string().max(95);
const departament = Joi.string().max(95);
const career = Joi.string().max(95);

export class ChapterModel implements CrudModel<Chapter> {
  tableName = "chapter";
  crudQueries;

  createUpdateSchema = Joi.object<CleanData>({
    name: name.required(),
    faculty,
    departament,
    career,
  });
  partialUpdateSchema = Joi.object<CleanData>({
    name,
    faculty,
    departament,
    career,
  });

  constructor() {
    this.crudQueries = getCrudQueries(this.tableName, "pk");
  }

  async create(cleanData: CleanData): Promise<Chapter> {
    const query = this.crudQueries.createOneQuery(cleanData);
    const res = await db.query(query);
    return res.rows[0] as Chapter;
  }

  async detail(pk: number): Promise<Chapter> {
    await checkResourceExists(this.tableName, { field: "pk", value: pk });

    const query = this.crudQueries.getOneQuery(pk);
    const res = await db.one(query);
    return res as Chapter;
  }

  async update(cleanData: CleanData, pk: number): Promise<Chapter> {
    await checkResourceExists(this.tableName, { field: "pk", value: pk });

    const query = this.crudQueries.updateOneQuery(cleanData, pk);
    const res = await db.one(query);
    return res as Chapter;
  }

  async delete(pk: number): Promise<void> {
    await checkResourceExists(this.tableName, { field: "pk", value: pk });

    const query = this.crudQueries.deleteOneQuery(pk);
    await db.query(query);
  }
}
