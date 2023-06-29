import { AnyDocument } from '../document';
import { Operation } from './operator';

export interface ChaiseLink {
  execute: <TDocument extends AnyDocument<any, any>>(operation: Operation<TDocument>) => Promise<Operation<TDocument>>
}