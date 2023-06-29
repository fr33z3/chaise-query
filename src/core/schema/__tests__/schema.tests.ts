import { ChaiseSchemaError } from '../../errors/schema_error';
import { array } from '../array';
import { boolean } from '../boolean';
import { dto } from '../dto';
import { number } from '../number';
import { object } from '../object';
import { string } from '../string';

describe('Schema', () => {
  const schema = object({
    users: array(dto('User', {
      id: number(),
      name: string(),
      email: string(),
      emailConfirmed: boolean(),
      activeConnections: number().nullable(),
    }))
  });

  describe('when data is valid', () => {
    const data = {
      users: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@doe.com',
          emailConfirmed: true,
          activeConnections: 1,
        },
        {
          id: '2',
          name: 'John John',
          email: 'john@john.com',
          emailConfirmed: false,
          activeConnections: null,
        },
      ]
    };

    it('parses data and returns it', () => {
      expect(schema.parse(data)).toEqual({
        users: [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@doe.com',
            emailConfirmed: true,
            activeConnections: 1,
          },
          {
            id: 2,
            name: 'John John',
            email: 'john@john.com',
            emailConfirmed: false,
            activeConnections: null,
          },
        ]
      });
    });
  });


  describe('when data is not valid', () => {
    const data = {
      users: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@doe.com',
          emailConfirmed: true,
          activeConnections: 1,
        },
        {
          id: '2',
          name: 'John John',
          email: null,
          emailConfirmed: false,
          activeConnections: null,
        },
      ]
    };

    it('parses data and returns it', () => {
      expect(() => schema.parse(data)).toThrow(ChaiseSchemaError);
      expect(() => schema.parse(data)).toThrow('expected string but received null at users.1.email');
    });
  });
});