import { AnyDocument } from "../document"
import { ObjectDataType } from "../schema/object"
import { InferType } from "../schema/base"

export type RequestContext<TData, TArgs extends ObjectDataType<any>, TDocument extends AnyDocument<TData, TArgs>> = {
  document: TDocument,
  args: InferType<TArgs>
  headers: Record<string, string>
  context: Record<string, any>
  data: any | null
  error: Error | null
}

export function getInitialRequestContext<TData, TArgs extends ObjectDataType<any>, TDocument extends AnyDocument<TData, TArgs>>(document: TDocument, args: InferType<TArgs>): RequestContext<TData, TArgs, TDocument> {
  return {
    document,
    args,
    headers: {},
    context: document.context,
    data: null,
    error: null,
  }
}