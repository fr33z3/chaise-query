import { ChaiseLink } from "./links";
import { AnyDocument, MutationDocument, QueryDocument } from "./document";
import { QueryManager } from "./query_manager";
import { ObjectDataType } from "./schema/object";
import { ChaiseCache } from "./cache";
import { getInitialRequestContext } from "./links/request-context";
import { InferType } from "./schema/base";

type ChaiseClientOptions = {
  links: ChaiseLink[],
  cache?: ChaiseCache
}

export type MutationOptions<TData, TArgs extends ObjectDataType<any>> = {
  args: InferType<TArgs>
  cachePolicy: 'cache' | 'no-cache'
  onCompleted?: (data: TData) => void
}

export type MutationResponse<TData> = {
  data: TData | null
  error: Error | null
}

export type QueryOptions<TArgs extends ObjectDataType<any>> = {
  args: InferType<TArgs>
  cachePolicy: 'cache-first' | 'cache-and-network' | 'network-only' | 'no-cache' | 'cache-only'
}

export class ChaiseClient {
  private queryManager: QueryManager;
  private links: ChaiseLink[];
  readonly cache: ChaiseCache;  

  constructor(options: ChaiseClientOptions) {
    const cache = options.cache ?? new ChaiseCache();
    this.links = options.links;
    this.cache = cache;
    this.queryManager = new QueryManager({ links: options.links, cache });
  }

  getObservableQuery<TData, TArgs extends ObjectDataType<any>>(document: QueryDocument<TData, TArgs>, options: QueryOptions<TArgs>) {
    return this.queryManager.watchQuery(document, options);
  }

  async mutate<TData, TArgs extends ObjectDataType<any>>(document: MutationDocument<TData, TArgs>, options: MutationOptions<TData, TArgs>): Promise<MutationResponse<TData>> {
    const { args, cachePolicy, onCompleted } = options;

    const { data, error } = await this.executeLinks<TData, TArgs, MutationDocument<TData, TArgs>>(document, args);
    let parsedData: TData | null = null;

    if (data) {
      parsedData = document.schema.parse(data);
      if (cachePolicy === 'cache') document.update(this.cache, parsedData, args);
      if (onCompleted) onCompleted(parsedData);
    }

    this.queryManager.recalculateQueries(this.cache);

    return {
      data: parsedData,
      error,
    };
  }

  private async executeLinks<TData, TArgs extends ObjectDataType<any>, TDocument extends AnyDocument<TData, TArgs>>(document: TDocument, args: InferType<TArgs>) {
    const initialCtx = getInitialRequestContext<TData, TArgs, TDocument>(document, args);

    const context = await this.links.reduce(async (prevCtx, link) => {
      const ctx = await prevCtx;
      return link.execute(ctx);
    }, Promise.resolve(initialCtx));
    
    return context;
  }
}