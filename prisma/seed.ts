import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface CSVCities {
  city: string;
  city_ascii: string;
  state_id: string;
  state_name: string;
  county_fips: string;
  county_name: string;
  lat: string;
  lng: string;
  population: string;
  density: string;
  source: string;
  military: string;
  incorporated: string;
  timezone: string;
  zips: string;
  id: string;
}

const rows: { state: string, county: string, city: string }[] = [];

fs.createReadStream(path.resolve(__dirname, '..', 'assets', 'uscities.csv'))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', (row: CSVCities) => {
    rows.push({
      state: row.state_name,
      county: row.county_name,
      city: row.city
    });
  })
  .on('end', async (rowCount: number) => {
    console.log(`Parsed ${rowCount} rows`);
    await prisma.city.createMany({data: rows})
    console.log('Database successfully seeded.')
    await prisma.$disconnect();
  });


