import { ChaiseCache } from '../cache';
import { queryDocument } from '../document';
import { InferSchema, array, dto, object, string } from '../schema';
import { InferType } from '../schema/data_type';

describe('Chaise cache', () => {
  let cache: ChaiseCache;

  beforeEach(() => {
    cache = new ChaiseCache();
  });

  describe('for query with simple schema', () => {
    const simpleQueryDocument = queryDocument('sampleQuery', {
      path: '/test',
      args: object({
        argument: string(),
      }),
      schema: object({
        test: string()
      })
    });

    const args: InferType<typeof simpleQueryDocument.args> = (simpleQueryDocument.args, {
      argument: 'test'
    });

    const data: InferSchema<typeof simpleQueryDocument.schema> = {
      test: 'test'
    };

    beforeEach(() => {
      cache.writeQuery(simpleQueryDocument, args, data);
    });

    it('stores query without dto', () => {
      const cachedQueries = cache.queries;
      const cachedDTOs = cache.dtos;

      expect(cachedQueries.size).toBe(1);
      expect(cachedDTOs.size).toBe(0);

      expect(cachedQueries.has('sampleQuery(test)')).toBeTruthy();
      expect(cachedQueries.get('sampleQuery(test)')).toEqual(data);
    });
  });

  describe('for query with schema containing dto', () => {
    const SampleDTO = dto('sampleDTO', {
      id: string(),
      name: string(),
    });

    const simpleQueryDocument = queryDocument('sampleQuery', {
      path: '/test',
      args: object({
        argument: string(),
      }),
      schema: array(SampleDTO)
    });

    const args: InferType<typeof simpleQueryDocument.args> = (simpleQueryDocument.args, {
      argument: 'test'
    });

    const data: InferSchema<typeof simpleQueryDocument.schema> = [
      {
        id: '1',
        name: 'test1',
      },
      {
        id: '2',
        name: 'test2',
      }
    ];

    beforeEach(() => {
      cache.writeQuery(simpleQueryDocument, args, data);
    });

    it('stores query without dto', () => {
      const cachedQueries = cache.queries;
      const cachedDTOs = cache.dtos;

      expect(cachedQueries.size).toBe(1);

      expect(cachedQueries.has('sampleQuery(test)')).toBeTruthy();
      expect(cachedQueries.get('sampleQuery(test)')).toEqual([
        {
          __ref: 'sampleDTO(1)',
        },
        {
          __ref: 'sampleDTO(2)',
        }
      ]);

      expect(cachedDTOs.size).toBe(2);
      expect(cachedDTOs.get('sampleDTO(1)')).toEqual(data[0]);
    });
  });
});