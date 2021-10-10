#!/bin/sh

npm install
npx sequelize db:migrate
node src/app.js