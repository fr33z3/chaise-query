import { ChaiseCache } from './cache';
import { InferSchema, Schema } from './schema';
import { ObjectDataType } from './schema/object';
import { InferType } from './schema/base';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type Path<Input extends ObjectDataType<any>> = string | ((args: InferSchema<Input>) => string)

type QueryDocumentOptions<TData, Input extends ObjectDataType<any>> = {
  path: Path<Input>
  schema: Schema<TData>
  args?: Input
  context?: Record<string, any>
  method?: RequestMethod
}

export class QueryDocument<TData, Input extends ObjectDataType<any>> {
  readonly name: string;
  readonly path: Path<Input>;
  readonly schema: Schema<TData>;
  readonly args?: Input;
  readonly context: Record<string, any>;
  readonly method: RequestMethod;
  readonly keyArgs: string[];

  constructor(
    name: string,
    options: QueryDocumentOptions<TData, Input>
  ) {
    this.name = name;
    this.path = options.path;
    this.schema = options.schema;
    this.args = options.args;
    this.context = options.context ?? {};
    this.method = options.method ?? 'GET';
    this.keyArgs = Object.keys(options.args?.attributes ?? []);
  }

  getPath(args: InferSchema<Input>): string {
    if (typeof this.path === 'string') {
      // TODO: serialize args
      const urlSearch = new URLSearchParams(args as Record<string, any>).toString();
      if (!urlSearch) return this.path;

      return `${this.path}?${urlSearch}`;
    } else {
      return this.path(args);
    }
  }

  getKeyArgs(args: InferSchema<Input>): string {
    return this.keyArgs.map(key => args[key]).join(';');
  }
}

export function queryDocument<TData, Input extends ObjectDataType<any>>(name: string, options: QueryDocumentOptions<TData, Input>): QueryDocument<TData, Input> {
  return new QueryDocument(
    name,
    options
  );
}

type MutationDocumentOptions<TData, Input extends ObjectDataType<any>> = {
  path: Path<Input>
  schema: Schema<TData>
  args?: Input
  context?: Record<string, any>
  method?: RequestMethod
  body?: (args: InferSchema<Input>) => Record<string, any>
  update?: (cache: ChaiseCache, data: InferType<Schema<TData>>, args: InferType<Input>) => void
}

export class MutationDocument<TData, Input extends ObjectDataType<any>> {
  readonly name: string;
  readonly path: Path<Input>;
  readonly schema: Schema<TData>;
  readonly args?: Input;
  readonly context: Record<string, any>;
  readonly method: RequestMethod;
  readonly body?: (args: InferSchema<Input>) => Record<string, any>;
  readonly update: (cache: ChaiseCache, data: InferType<Schema<TData>>, args: InferType<Input>) => void;

  constructor(
    name: string,
    options: MutationDocumentOptions<TData, Input>
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

  getPath(args: InferSchema<Input>): string {
    if (typeof this.path === 'string') {
      return this.path;
    } else {
      return this.path(args);
    }
  }

  getBody(args: InferSchema<Input>): Record<string, any> {
    // TODO: serialize args

    if (this.body) return this.body(args);

    return args;
  }
}

export function mutationDocument<TData, Input extends ObjectDataType<any>>(name: string, options: MutationDocumentOptions<TData, Input>): MutationDocument<TData, Input> {
  return new MutationDocument(
    name,
    options
  );
}

export type AnyDocument<TData, TArgs extends ObjectDataType<any>> = QueryDocument<TData, TArgs> | MutationDocument<TData, TArgs>