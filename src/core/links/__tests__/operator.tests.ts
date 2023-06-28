import { buildOperation, operateLinks } from '../operator';
import { ChaiseLink } from '../base';
import { queryDocument } from '../../document';
import { object } from '../../schema';

describe('Operator', () => {
  const firstLink = {
    execute: jest.fn().mockImplementation((ctx) => ctx),
  } as ChaiseLink;

  const secondLink = {
    execute: jest.fn().mockImplementation((ctx) => ctx),
  } as ChaiseLink;

  const document = queryDocument('testQuery', {
    path: '/some/path',
    args: object({}),
    schema: object({}),
  });

  it('executes links in order', async () => {
    const initialCtx = buildOperation(document, {});
    const resultCtx = await operateLinks([firstLink, secondLink], initialCtx);

    expect(resultCtx).toBe(initialCtx);
    expect(firstLink.execute).toHaveBeenCalledWith(initialCtx);
    expect(secondLink.execute).toHaveBeenCalledWith(initialCtx);
  });
});