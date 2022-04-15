import { createApplication } from 'graphql-modules';
import CityModule from './modules/city-gql';
import JsonModule from './modules/json-gql';

export default createApplication({
  modules: [CityModule, JsonModule]
});
