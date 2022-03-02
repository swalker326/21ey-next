// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Goal } = initSchema(schema);

export {
  Goal
};