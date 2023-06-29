import { mutationDocument, queryDocument } from '../../document';
import { dto, object, string } from '../../schema';
import { HTTPLink } from '../http-link';
import { buildOperation } from '../operator';

describe('HTTPLink', () => {
  const mockedFetch = jest.fn();
  const httpLink = new HTTPLink({ baseUrl: 'http://localhost:3000/api', fetch: mockedFetch });

  function mockSuccessResult(data: any) {
    mockedFetch.mockResolvedValueOnce({
      successful: true,
      headers: {
        'Content-Type': 'application/json',
        'CustomHeader': 'customValue',
      },
      data,
    });
  }

  beforeEach(() => {
    mockedFetch.mockClear();
  });

  describe('For mutation document without arguments', () => {
    const TestMutation = mutationDocument('testMutation', {
      path: '/test',
      schema: dto('TestDTO', {
        id: string(),
        name: string(),
      })
    });
    const operation = buildOperation(TestMutation, {});

    it('requests data with proper url and options', async () => {
      mockSuccessResult({ id: '1', name: 'test' });
      await httpLink.execute(operation);

      expect(mockedFetch).toHaveBeenCalledWith(
        new URL('http://localhost:3000/api/test'),
        {
          body: undefined,
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });
    });
  });

  describe('For mutation document with custom method', () => {
    const TestMutation = mutationDocument('testMutation', {
      method: 'PUT',
      path: '/test',
      schema: dto('TestDTO', {
        id: string(),
        name: string(),
      })
    });
    const operation = buildOperation(TestMutation, {});

    it('requests data with proper url and options', async () => {
      mockSuccessResult({ id: '1', name: 'test' });
      await httpLink.execute(operation);

      expect(mockedFetch).toHaveBeenCalledWith(
        new URL('http://localhost:3000/api/test'),
        {
          body: undefined,
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PUT',
        });
    });
  });

  describe('For mutation document with arguments', () => {
    const TestMutation = mutationDocument('testMutation', {
      path: '/test',
      schema: dto('TestDTO', {
        id: string(),
        name: string(),
      }),
      args: object({
        id: string(),
        name: string(),
      })
    });
    const operation = buildOperation(TestMutation, { id: '1', name: 'test' });

    it('requests data with proper url and options', async () => {
      mockSuccessResult({ id: '1', name: 'test' });
      await httpLink.execute(operation);

      expect(mockedFetch).toHaveBeenCalledWith(
        new URL('http://localhost:3000/api/test'),
        {
          body: {
            id: '1',
            name: 'test'
          },
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });
    });
  });

  describe('For mutation document with defined path and body', () => {
    const TestMutation = mutationDocument('testMutation', {
      path: ({ id }) => `/test/${id}`,
      schema: dto('TestDTO', {
        id: string(),
        name: string(),
      }),
      args: object({
        id: string(),
        name: string(),
      }),
      body: ({ name }) => ({ name }),
    });
    const operation = buildOperation(TestMutation, { id: '1', name: 'test' });

    it('requests data with proper url and options', async () => {
      mockSuccessResult({ id: '1', name: 'test' });
      await httpLink.execute(operation);

      expect(mockedFetch).toHaveBeenCalledWith(
        new URL('http://localhost:3000/api/test/1'),
        {
          body: {
            name: 'test'
          },
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });
    });
  });
});