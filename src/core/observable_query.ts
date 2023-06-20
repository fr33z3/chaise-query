import { QueryDocument } from "./document";
import { Observable } from 'zen-observable-ts';
import { QueryManager } from "./query_manager";
import { ObjectDataType } from "./schema/object";
import { InferSchema } from "./schema";

type CachePolicy = 'cache-first' | 'cache-and-network' | 'network-only' | 'no-cache' | 'cache-only'

export type QueryOptions<TArgs extends ObjectDataType<any>> = {
  args: InferSchema<TArgs>
  cachePolicy: CachePolicy
}

export type ObservableState<TData> = {
  data: TData | null
  error: Error | null
  loading: boolean
}

export class ObservableQuery<TData, TArgs extends ObjectDataType<any>> extends Observable<ObservableState<TData>> {
  readonly id: string;
  readonly document: QueryDocument<TData, TArgs>;
  readonly options: QueryOptions<TArgs>;
  private observer: ZenObservable.SubscriptionObserver<ObservableState<TData>> | undefined;
  private queryManager: QueryManager;
  private previousData: TData | null = null;
  private previousError: Error | null = null;

  constructor(id: string, queryDocument: QueryDocument<TData, TArgs>, options: QueryOptions<TArgs>, queryManager: QueryManager) {
    super((observer) => {
      this.observer = observer;
      
      return () => {
        observer.complete();
        queryManager.stopWatchQuery(this);
      };
    });
    this.queryManager = queryManager;
    this.id = id;
    this.document = queryDocument;
    this.options = options;
  }

  fetch() {
    if (this.observer) {
      this.observer.next({ data: null, error: null, loading: true });
      this.queryManager.fetchQuery(this, this.options);
    }
  }

  refetch() {
    if (this.observer) {
      this.observer.next({ data: this.previousData, error: null, loading: true });
      this.queryManager.fetchQuery(this, this.options);
    }
  }

  writeData(data: TData) {
    if (this.observer) {
      this.observer.next({ data, error: null, loading: false });
      this.previousData = data;
    }
  }

  writeError(error: Error) {
    if (this.observer) {
      this.observer.next({ data: null, error, loading: false });
      this.previousError = error;
    }
  }
}