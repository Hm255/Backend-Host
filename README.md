# board games review REST API

## hosted version : https://nc-game.cyclic.app/

this contains everything you need to know to run this program

The packages below are pasted in directly from my own package.json used to build this work.

the .env files have their content included below their names and all belong at the root folder

## Summary:

This is a rest API made using expressjs for people reviewing board games, it allows users to read reviews which can be filtered by genre, date made or both. It can also get each genre included. The sql used comes from Postgresql

It can view all the users 

It can also view every comment in the database in descending order of their id's 

It also allows users to post, edit and delete comments.

## Testing done with Jest:

npm test app.test.js/npm t app - runs the jest tests

"jest-sorted": "^1.0.14",
"jest": "^27.5.1",
"jest-extended": "^2.0.0"

"jest": {
    "setupFilesAfterEnv": [
      "jest-extended/all",
      "jest-sorted"
    ]
  }

This was tested with jest tests for each function, some tests measure whether the direct content is similar and other test if the returned content is at least of the correct type (object/string/number).

## cloning from github:

go to: https://github.com/Hm255/Backend-Host

in the code drop down near the middle, copy the link.

in a terminal, navigate to the folder you want and do this:

git clone [pasted-clone-link-from-github]

the project should be there without its dependencies or .env files as these have been and will still need to be .gitignored once remade from the info under dependencies/.gitignore.


npm run functions:

npm run seed - seed's the database, do this when first running the tests on a client API 

npm run dev - listens on port localhost:9090 for rest API testing using postman/insomnia

npm run setup-dbs - drops and re-creates the database tables


## Dependencies (used and working during production - 14-12-22):

use npm install on its own to install the dependencies shown below into your package.json which should be at root level


"dependencies": {
    "axios": "^1.2.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "jest-sorted": "^1.0.14",
    "nodemon": "^2.0.20",
    "pg": "^8.8.0",
    "pg-format": "^1.0.4",
    "supertest": "^6.3.0"
  },
  "devDependencies": {
    "husky": "^7.0.0",
    "jest": "^27.5.1",
    "jest-extended": "^2.0.0"
  },

node: V18.1.2

## .gitignore - ignore node_modules and .env.* (anything starting with .env)

  .env files:
  
  .env.test
  PGDATABASE=nc_games_test

  .env.development
  PGDATABASE=nc_games

  .env.production
  DATABASE_URL="postgres://vqsvtpzs:ovkKpeiD6a_1eXPw-MRflpq8dKVxBNqi@lucky.db.elephantsql.com/vqsvtpzs"