import { IdentifiableEntitySchema } from './identifiable-entity.schema';
import { BaseEntity } from './base-entity';

export interface EntitySchemaFactory<
  TSchema extends IdentifiableEntitySchema,
  TEntity extends BaseEntity,
> {
  create(entity: TEntity): TSchema | Promise<TSchema>;
  createFromSchema(entitySchema: TSchema, ...agrs: any): TEntity;
}
