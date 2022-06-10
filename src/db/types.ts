import { ObjectSchema } from "joi";

export type CleanData = {
  [key: string]: any;
};

export type SimpleLookup = {
  field: string;
  value: number | string | boolean;
};

export interface CrudModel<ModelResponse> {
  create(cleanData: CleanData): Promise<ModelResponse>;
  detail(pk: number): Promise<ModelResponse>;
  update(cleanData: CleanData, pk: number): Promise<ModelResponse>;
  delete(pk: number): Promise<void>;

  createUpdateSchema: ObjectSchema<CleanData>;
  partialUpdateSchema: ObjectSchema<CleanData>;
}
