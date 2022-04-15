import { GraphQLResolveInfo } from 'graphql';
import { PrismaSelect } from '@paljs/plugins';
import Prisma from '../lib/prisma';

import { CityUpdate, CityCreate } from '../interface/ICity';

class CityDb {
  async create(data: CityCreate, info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info).value;
    return Prisma.city.create({ data, ...select });
  }

  async update(id: number, data: CityUpdate, info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info).value;
    return Prisma.city.update({ data, ...select, where: { id } });
  }

  async get(id: string, info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info).value;
    return Prisma.city.findFirst({
      where: { id },
      ...select
    });
  }

  async list(skip: number, take: number, info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info).value;
    return Prisma.city.findMany({
      skip,
      take,
      ...select
    });
  }

  async filter(states?: string[], counties?: string[], cities?: string[]) {
    return Prisma.city.findMany({
      where: {
        state: { in: states },
        county: { in: counties },
        city: { in: cities }
      }
    });
  }

  async delete(id: number) {
    return Prisma.city.delete({
      where: { id }
    });
  }
}

export default new CityDb();
