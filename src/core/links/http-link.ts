import { AnyDocument, QueryDocument } from "../document";
import { ObjectDataType } from "../schema/object";
import { ChaiseLink } from "./base";
import { RequestContext } from "./request-context";

export type HTTPLinkConfiguration = {
  baseUrl: string
  defaultHeaders?: Record<string, string>
}

export class HTTPLink implements ChaiseLink {
  readonly baseUrl: string;
  readonly defaultHeaders?: Record<string, string>;

  constructor(configuration: HTTPLinkConfiguration) {
    this.baseUrl = configuration.baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...configuration.defaultHeaders
    };
  }

  async execute<TData, TArgs extends ObjectDataType<any>, TDocument extends AnyDocument<TData, TArgs>>(context: RequestContext<TData, TArgs, TDocument>): Promise<RequestContext<TData, TArgs, TDocument>> {
    const ctx = this.applyHeaders(context);
    const { document, headers, args } = ctx;
    const url = this.buildRequestUrl(document, args);

    const body = document instanceof QueryDocument ? undefined : JSON.stringify(document.getBody(args));

    const response = await fetch(url, {
      method: document.method,
      headers,
      body,
    });
    let jsonData: any;
    try {
      jsonData = await response.json();
    } catch (error) {
      // Do nothing
    }

    if (response.status === 200 || response.status === 201) {
      return {
        ...ctx,
        data: jsonData,
      };
    } else {
      return {
        ...ctx,
        error: new Error(jsonData),
      };
    }
  }

  private buildRequestUrl<TData, TArgs extends ObjectDataType<any>, TDocument extends AnyDocument<TData, TArgs>>(document: AnyDocument<any, any>, args?: RequestContext<TData, TArgs, TDocument>['args']) {
    const baseUrl = new URL(this.baseUrl);
    return new URL(baseUrl.pathname + document.getPath(args), this.baseUrl);
  }

  private applyHeaders<TData, TArgs extends ObjectDataType<any>, TDocument extends AnyDocument<TData, TArgs>>(context: RequestContext<TData, TArgs, TDocument>): RequestContext<TData, TArgs, TDocument> {
    return {
      ...context,
      headers: {
        ...this.defaultHeaders,
        ...context.headers,
      }
    };
  }
}