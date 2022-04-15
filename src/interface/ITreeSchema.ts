export interface TreeSchemaInput {
  states: string[];
  counties: string[];
  cities: string[];
}

export interface TreeSchemaOutput {
  [key: string]: {
    counties: {
      [key: string]: {
        cities: {
          [key: string]: {
            id: number;
          }
        }
      }
    }
  }
}