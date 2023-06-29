import { AnyDocument } from '../document';
import { ChaiseLink } from './base';

export type Operation<TDocument extends AnyDocument<any, any>> = {
  document: TDocument
  args: Record<string, any>
  headers: Record<string, string>
  context: Record<string, any>
  data: any | null
  error: Error | null
  responseHeaders: Record<string, any> | null
}

export function buildOperation<TDocument extends AnyDocument<any, any>>(document: TDocument, args: Record<string, any>): Operation<TDocument> {
  return {
    document,
    args,
    headers: {},
    context: document.context,
    data: null,
    error: null,
    responseHeaders: null,
  };
}

export async function operateLinks<TDocument extends AnyDocument<any, any>>(links: ChaiseLink[], operation: Operation<TDocument>) {
  const context = await links.reduce(async (prevCtx, link) => {
    const ctx = await prevCtx;
    return link.execute(ctx);
  }, Promise.resolve(operation));

  return context;
}