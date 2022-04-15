import { createModule, gql } from 'graphql-modules';
import { City } from '@prisma/client';
import { GraphQLResolveInfo } from 'graphql';
import CityDb from '../../database/city-db';

import { CityUpdate, CityCreate } from '../../interface/ICity';
import { TreeSchemaOutput, TreeSchemaInput } from '../../interface/ITreeSchema';


export default createModule({
  id: 'city-module',
  dirname: __dirname,
  typeDefs: [
    gql`
      type Query {
        city(id: Int!): CityDenormalized
        cities(pageIndex: Int!, pageSize: Int!): [CityDenormalized]
        states(states: [String], counties: [String], cities: [String]): JSON
      }

      input createCityType {
        state: String!
        county: String!
        city: String!
      }

      input updateCityType {
        state: String
        county: String
        city: String
      }

      type Mutation {
        createCity(city: createCityType!): CityDenormalized
        updateCity(id: Int!, city: updateCityType!): CityDenormalized
        deleteCity(id: Int!): CityDenormalized
      }

      type CityDenormalized {
        id: Int!
        state: String!
        county: String!
        city: String!
      }
    `
  ],
  resolvers: {
    Query: {
      city: async (_: unknown, { id }: { id: string }, ctx: any, info: GraphQLResolveInfo): Promise<City | null> => {
        return CityDb.get(id, info);
      },
      cities: async (
        _: unknown,
        { pageIndex, pageSize }: { pageIndex: number; pageSize: number },
        ctx: any,
        info: GraphQLResolveInfo
      ): Promise<City[] | null> => {
        const skip = pageIndex * pageSize;
        return CityDb.list(skip, pageSize, info);
      },
      states: async (
        _: unknown,
        { states, counties, cities }: TreeSchemaInput,
        ctx: any,
        info: GraphQLResolveInfo
      ): Promise<TreeSchemaOutput | null> => {
        const denormalized = await CityDb.filter(states, counties, cities);

        const treeSchema: TreeSchemaOutput = {};
        denormalized.forEach(d => {
          if (treeSchema[d.state]) {
            if (treeSchema[d.state].counties[d.county]) {
              treeSchema[d.state].counties[d.county].cities[d.city] = { id: d.id }
            } else {
              treeSchema[d.state].counties[d.county] = {
                cities: {
                  [d.city]: {
                    id: d.id
                  }
                }
              }
            }
          } else {
            treeSchema[d.state] = {
              counties: {
                [d.county]: {
                  cities: {
                    [d.city]: {
                      id: d.id
                    }
                  }
                }
              }
            }
          }
        });

        return treeSchema;
      }
    },
    Mutation: {
      createCity: async (_: unknown, { city }: { city: CityCreate }, ctx: any, info: GraphQLResolveInfo): Promise<City> => {
        return CityDb.create(city, info);
      },
      updateCity: async (
        _: unknown,
        { id, city }: { id: number; city: CityUpdate },
        ctx: any,
        info: GraphQLResolveInfo
      ): Promise<City> => {
        return CityDb.update(id, city, info);
      },
      deleteCity: async (_: unknown, { id }: { id: number }): Promise<City> => {
        return await CityDb.delete(id);
      }
    }
  }
});
