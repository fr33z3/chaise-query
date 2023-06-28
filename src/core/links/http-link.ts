import { AnyDocument, MutationDocument, RequestMethod } from "../document";
import { ObjectDataType } from "../schema/object";
import { ChaiseLink } from "./base";
import { Operation } from "./operator";

export type HTTPLinkFetcher = (url: URL, options: {
  method: RequestMethod,
  headers: Record<string, string>,
  body?: Record<string, any>
}) => Promise<{
  data: any | null,
  successful: boolean,
  headers: Headers,
}>;

export type HTTPLinkConfiguration = {
  baseUrl: string
  defaultHeaders?: Record<string, string>
  fetch?: HTTPLinkFetcher
}

const defaultFetcher: HTTPLinkFetcher = async (url, { method, headers, body }) => {
  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body && JSON.stringify(body),
  });

  let data: any | null;
  try {
    data = await response.json();
  } catch (error) {
    // Do nothing
  }

  return {
    data,
    successful: response.ok,
    headers: response.headers,
  };
};

export class HTTPLink implements ChaiseLink {
  readonly baseUrl: string;
  readonly defaultHeaders?: Record<string, string>;
  readonly fetch: HTTPLinkFetcher;

  constructor(configuration: HTTPLinkConfiguration) {
    this.baseUrl = configuration.baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...configuration.defaultHeaders
    };
    this.fetch = configuration.fetch ?? defaultFetcher;
  }

  async execute<TDocument extends AnyDocument<any, any>>(operation: Operation<TDocument>): Promise<Operation<TDocument>> {
    const op = this.applyHeaders(operation);
    const { document, headers, args } = op;
    const url = this.buildRequestUrl(document, args);

    const body = document instanceof MutationDocument ? document.getBody(args) : undefined;

    const response = await this.fetch(url, {
      method: document.method,
      headers,
      body,
    });

    if (response.successful) {
      return {
        ...op,
        data: response.data,
        responseHeaders: response.headers,
      };
    } else {
      return {
        ...op,
        error: new Error(response.data),
        responseHeaders: response.headers,
      };
    }
  }

  private buildRequestUrl(document: AnyDocument<any, any>, args: Record<string, any>) {
    const baseUrl = new URL(this.baseUrl);
    return new URL(baseUrl.pathname + document.getPath(args), this.baseUrl);
  }

  private applyHeaders<TDocument extends AnyDocument<any, any>>(operation: Operation<TDocument>): Operation<TDocument> {
    return {
      ...operation,
      headers: {
        ...this.defaultHeaders,
        ...operation.headers,
      }
    };
  }
}