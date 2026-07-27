import { Schema, type SchemaOptions } from "mongoose";

export const defaultSchemaOptions: SchemaOptions = {
  timestamps: true,
  versionKey: false,
};

export const objectIdRef = (modelName: string) => ({
  type: Schema.Types.ObjectId,
  ref: modelName,
  required: true,
});

export const objectIdRefArray = (modelName: string) => ({
  type: [{ type: Schema.Types.ObjectId, ref: modelName }],
  default: [],
});
