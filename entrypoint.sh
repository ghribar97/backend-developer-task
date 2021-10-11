#!/bin/sh

npm install
npx sequelize db:migrate
npx sequelize-cli db:seed:all
node src/app.js