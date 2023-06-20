import { ObservableQuery, QueryOptions } from "./observable_query";
import { QueryDocument } from "./document";
import { v4 as uuid } from 'uuid';
import { ObjectDataType } from "./schema/object";
import { ChaiseLink } from "./links/base";
import { getInitialRequestContext } from "./links/request-context";
import { ChaiseCache } from "./cache";
import { InferType } from "./schema/base";

export type QueryManagerOptions = {
  links: ChaiseLink[]
  cache: ChaiseCache
}

export class QueryManager {
  private observableQueries = new Map<string, ObservableQuery<any, any>>();
  private links: ChaiseLink[];
  private cache: ChaiseCache;

  constructor(options: QueryManagerOptions) {
    this.links = options.links;
    this.cache = options.cache;
  }

  watchQuery<TData, TArgs extends ObjectDataType<any>>(document: QueryDocument<TData, TArgs>, options: QueryOptions<TArgs>) {
    const observableQuery = new ObservableQuery(this.generateQueryId(), document, options, this);
    this.observableQueries.set(observableQuery.id, observableQuery);

    return observableQuery;
  }

  async fetchQuery<TData, TArgs extends ObjectDataType<any>>(observableQuery: ObservableQuery<TData, TArgs>, options: QueryOptions<TArgs>) {
    const { args, cachePolicy } = options;

    if (['cache-first', 'cache-and-network', 'cache-only'].includes(cachePolicy)) {
      const cacheData = this.cache.readQuery(observableQuery.document, args);
      if (cacheData) {
        observableQuery.writeData(cacheData);
      }
      if (cacheData && cachePolicy === 'cache-first') return;
    }
    if (cachePolicy === 'cache-only') return;

    const { document, error, data } = await this.executeLinks(observableQuery.document, args);

    if (error) {
      observableQuery.writeError(error);
    }

    if (data && cachePolicy !== 'no-cache') {
      this.cache.writeQuery(document, args, data);

      this.observableQueries.forEach((activeQuery) => {
        const cacheData = this.cache.readQuery(activeQuery.document, observableQuery.options.args);
        if (cacheData) activeQuery.writeData(cacheData);
      });
    } else if (data) {
      const parsedData = observableQuery.document.schema.parse(data);
      observableQuery.writeData(parsedData);
    }
  }

  recalculateQueries(cache: ChaiseCache) {
    this.observableQueries.forEach((observableQuery) => {
      const cacheData = cache.readQuery(observableQuery.document, observableQuery.options.args);
      if (cacheData) observableQuery.writeData(cacheData);
    });
  }

  private async executeLinks<TData, TArgs extends ObjectDataType<any>>(document: QueryDocument<TData, TArgs>, args: InferType<TArgs>) {
    const initialCtx = getInitialRequestContext(document, args);

    const context = await this.links.reduce(async (prevCtx, link) => {
      const ctx = await prevCtx;
      return link.execute(ctx);
    }, Promise.resolve(initialCtx));

    return context;
  }

  stopWatchQuery(query: ObservableQuery<any, any>) {
    this.observableQueries.delete(query.id);
  }

  private generateQueryId() {
    return uuid();
  }
}