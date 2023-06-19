import { AnyDocument } from "../document";
import { ObjectDataType } from "../schema/object";
import { RequestContext } from "./request-context";

export interface ChaiseLink {
  execute: <TData, TArgs extends ObjectDataType<any>, TDocument extends AnyDocument<TData, TArgs>>(query: RequestContext<TData, TArgs, TDocument>) => Promise<RequestContext<TData, TArgs, TDocument>>
}