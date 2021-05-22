# Contributing

## Getting started

1. Fork the repo and checkout your fork
2. Create a branch for your change 
1. `nvm use` to pick up node version from `.nvmrc`
3. `npm i --ci` to install all required packages 
4. `docker-compose up` to spin up the test database. Make sure port `5432` is available.
1. `npm run watch` - tests should now run and pass.

## Testing

Tests are located in `./test` and can be ran in watch mode via `npm run watch`.

All changes code must have accompanying tests. If you are adding a new feature to the library, add an integration test that uses the library as a user might use it in their own tests. Be sure to include unit tests for the individual components too.

## Adding database migrations

All migration files are located in `./db`. These files are executed in alphabetical order, so name your files `<next_migration_number>_<what_is_added>.sql`.

For example `002_user_login_count.sql` if I were adding a new table that counts user logins.

## Committing with Commitizen

This project uses [Commitizen](https://github.com/commitizen/cz-cli) to enforce linted commits that can be used to automatically generate a change log.

Instead of using `git commit` to commit, use `npm run commit` or `npx cz` and follow the prompts.
