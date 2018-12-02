## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# incremental rebuild (webpack)
$ npm run webpack
$ npm run start:hmr

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

- - - -
## Installation

* run: `psql postgres`
* Create role: `CREATE ROLE ideauser WITH LOGIN PASSWORD 'ideapass';`
* Create DB: `create database ideadb;`
* Grant: `GRANT ALL PRIVILEGES ON DATABASE ideaDB TO ideauser;`

## :exclamation: Caveats
* Postgres need `uuid_generate_v4()` function. So, if you get `QueryFailedError: function uuid_generate_v4() does not exist` error, run `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";` on pqsl.