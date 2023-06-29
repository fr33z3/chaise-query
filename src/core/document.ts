import { ChaiseCache } from './cache';
import { InferSchema, Schema } from './schema';
import { ObjectDataType } from './schema/object';
import { InferType } from './schema/data_type';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type Path<TArgs extends ObjectDataType<any>> = string | ((args: InferSchema<TArgs>) => string)

type QueryDocumentOptions<TData, TArgs extends ObjectDataType<any>> = {
  path: Path<TArgs>
  schema: Schema<TData>
  args?: TArgs
  context?: Record<string, any>
  method?: RequestMethod
}

export class QueryDocument<TData, TArgs extends ObjectDataType<any>> {
  readonly name: string;
  readonly path: Path<TArgs>;
  readonly schema: Schema<TData>;
  readonly args?: TArgs;
  readonly context: Record<string, any>;
  readonly method: RequestMethod;
  readonly keyArgs: string[];

  constructor(
    name: string,
    options: QueryDocumentOptions<TData, TArgs>
  ) {
    this.name = name;
    this.path = options.path;
    this.schema = options.schema;
    this.args = options.args;
    this.context = options.context ?? {};
    this.method = options.method ?? 'GET';
    this.keyArgs = Object.keys(options.args?.attributes ?? []);
  }

  getPath(args: InferSchema<TArgs>): string {
    if (typeof this.path === 'string') {
      // TODO: serialize args
      const urlSearch = new URLSearchParams(args as Record<string, any>).toString();
      if (!urlSearch) return this.path;

      return `${this.path}?${urlSearch}`;
    } else {
      return this.path(args);
    }
  }

  getKeyArgs(args: InferSchema<TArgs>): string {
    return this.keyArgs.map(key => args[key]).join(',');
  }
}

export function queryDocument<TData, TArgs extends ObjectDataType<any>>(name: string, options: QueryDocumentOptions<TData, TArgs>): QueryDocument<TData, TArgs> {
  return new QueryDocument(
    name,
    options
  );
}

type MutationDocumentOptions<TData, TArgs extends ObjectDataType<any>> = {
  path: Path<TArgs>
  schema: Schema<TData>
  args?: TArgs
  context?: Record<string, any>
  method?: RequestMethod
  body?: (args: InferSchema<TArgs>) => Record<string, any>
  update?: (cache: ChaiseCache, data: InferType<Schema<TData>>, args: InferType<TArgs>) => void
}

export class MutationDocument<TData, TArgs extends ObjectDataType<any>> {
  readonly name: string;
  readonly path: Path<TArgs>;
  readonly schema: Schema<TData>;
  readonly args?: TArgs;
  readonly context: Record<string, any>;
  readonly method: RequestMethod;
  private body?: (args: InferSchema<TArgs>) => Record<string, any>;
  readonly update: (cache: ChaiseCache, data: InferType<Schema<TData>>, args: InferType<TArgs>) => void;

  constructor(
    name: string,
    options: MutationDocumentOptions<TData, TArgs>
  ) {
    this.name = name;
    this.path = options.path;
    this.schema = options.schema;
    this.args = options.args;
    this.context = options.context ?? {};
    this.method = options.method ?? 'POST';
    this.body = options.body;
    this.update = options.update ?? ((cache, data) => { cache.updateByMutation(this, data); });
  }

  getPath(args: InferSchema<TArgs>): string {
    if (typeof this.path === 'string') {
      return this.path;
    } else {
      return this.path(args);
    }
  }

  getBody(args: InferSchema<TArgs>): Record<string, any> | undefined {
    // TODO: serialize args
    if (this.body) return this.body(args);
    if (!this.args) return undefined;

    return args;
  }
}

export function mutationDocument<TData, TArgs extends ObjectDataType<any>>(name: string, options: MutationDocumentOptions<TData, TArgs>): MutationDocument<TData, TArgs> {
  return new MutationDocument(
    name,
    options
  );
}

export type AnyDocument<TData, TArgs extends ObjectDataType<any>> = QueryDocument<TData, TArgs> | MutationDocument<TData, TArgs>