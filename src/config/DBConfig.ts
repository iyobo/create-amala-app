import * as dotenv from 'dotenv';
import {Options} from '@mikro-orm/core';

dotenv.config({path: `./.env`});

export default {
  entities: [`${__dirname}/../data/models/**/*`],
  ...process.env.DATABASE_URL ?
    {clientUrl: process.env.DATABASE_URL} :
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
    },
  dbName: process.env.DB_NAME,
  type: process.env.DB_TYPE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  driverOptions:{
    connection: { ssl: !!process.env.DB_SSL && { rejectUnauthorized: false } },
  },

  migrations: {
    tableName: 'mikro_orm_migrations', // name of database table with log of executed transactions
    path: `${__dirname}/../data/migrations`, // path to the folder with migrations
    pattern: /^.*.[ts|js]$/, // regex pattern for the migration files
    transactional: true, // wrap each migration in a transaction
    disableForeignKeys: false, // wrap statements with `set foreign_key_checks = 0` or equivalent
    allOrNothing: true, // wrap all migrations in master transaction
    dropTables: true, // allow to disable table dropping
    safe: false, // allow to disable table and column dropping
    emit: process.env.NODE_ENV === 'production' ? 'js' : 'ts', // migration generation mode
  },
} as Options;

