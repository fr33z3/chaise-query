import { queryDocument } from '../../document';
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

  describe('For query document without arguments', () => {
    const TestQuery = queryDocument('testQuery', {
      path: '/test',
      schema: dto('TestDTO', {
        id: string(),
        name: string(),
      })
    });
    const operation = buildOperation(TestQuery, {});

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
          method: 'GET',
        });
    });
  });

  describe('For query document with custom method', () => {
    const TestQuery = queryDocument('testQuery', {
      method: 'POST',
      path: '/test',
      schema: dto('TestDTO', {
        id: string(),
        name: string(),
      })
    });
    const operation = buildOperation(TestQuery, {});

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

  describe('For query document with string path', () => {
    const TestQuery = queryDocument('testQuery', {
      path: '/test',
      args: object({
        id: string(),
      }),
      schema: dto('TestDTO', {
        id: string(),
        name: string(),
      })
    });
    const operation = buildOperation(TestQuery, { id: '1' });

    beforeEach(() => {
      mockSuccessResult({ id: '1', name: 'test' });
    });

    it('requests data with proper url and options', async () => {
      await httpLink.execute(operation);
      expect(mockedFetch).toHaveBeenCalledWith(
        new URL('http://localhost:3000/api/test?id=1'),
        {
          body: undefined,
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET',
        });
    });
  });

  describe('For query document with defined path', () => {
    const TestQuery = queryDocument('testQuery', {
      path: ({ id }) => `/test/${id}`,
      args: object({
        id: string(),
      }),
      schema: dto('TestDTO', {
        id: string(),
        name: string(),
      })
    });
    const operation = buildOperation(TestQuery, { id: '1' });

    describe('when request was successful', () => {
      beforeEach(() => {
        mockSuccessResult({ id: '1', name: 'test' });
      });

      it('requests data with proper url and options', async () => {
        await httpLink.execute(operation);
        expect(mockedFetch).toHaveBeenCalledWith(
          new URL('http://localhost:3000/api/test/1'),
          {
            body: undefined,
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'GET',
          });
      });

      it('apply default headers to operation', async () => {
        const resultOperation = await httpLink.execute(operation);
        expect(resultOperation.headers).toEqual({
          'Content-Type': 'application/json',
        });
      });

      it('returns operation with data', async () => {
        const resultOperation = await httpLink.execute(operation);
        expect(resultOperation.data).toEqual({
          id: '1',
          name: 'test',
        });
      });

      it('returns operation with headers', async () => {
        const resultOperation = await httpLink.execute(operation);
        expect(resultOperation.responseHeaders).toEqual({
          'Content-Type': 'application/json',
          'CustomHeader': 'customValue',
        });
      });

      it('returns operation without error', async () => {
        const resultOperation = await httpLink.execute(operation);
        expect(resultOperation.error).toBeNull();
      });
    });
  });
});