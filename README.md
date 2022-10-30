# Northcoders News API

## To view this project please see the link below.

https://project-northcoders-nc-news.herokuapp.com/api/

## NC-News Project

    This projects goal build an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture. It was also to develop and improve my skills with SQL and create an API for a news article website with functionality to not just view and read articles but to view users, topics, comments, specified articles( based on their id's), as well as be able to sort by a number of queries such as the date the article/comments were created on or by the number of votes an article has, a full list of available queries and endpoints are available on the first page when you click the link above. With Additional functionality including posting comments, giving kudos to other users comments and deleting posts made by the user.

## Setup Instructions/requirements

If you are reading this from my github repository page and you want to save this repo locally please click the green "Code" button towards the upper right, this will provide a link for you to copy, next open your terminal and cd into the folder you wish you clone this repo into. Type "git clone " then paste the link and hit enter.

This should look something like - git clone https://github.com/ZalwayJH/Backend-Project-NC-news.git
Now we can cd into the newly clone repo and view it by typing

- cd be-nc-news
- code .

In order for you to run these files please make sure you have the necessary minimum requirements of Postgresql and Node.

- PSQL Version 12.12
- Node.js v18.7.0

You will also need create you own .env. files since they are excluded from the repo via .gitignore, they are essential environment variables that connect the two databases locally.

First create 2 files called ".env.test" and ".env.development" in the outer most folder of this repository.

Within the '.env.test' file write "PGDATABASE=nc_news_test" and in the '.env.development' file write "PGDATABASE=nc_news" (without the quotation marks or semi-colons)

## Required installation dependencies

Please make sure you cd into "be-nc-news" before typing in the following commands.

- "dotenv": npm install dotenv --save,
- "express": npm install express,
- "jest-sorted": npm install --save-dev jest-sorted,
- "pg": npm install pg,
- "pg-format": npm install pg-format
- "jest": npm install --save-dev jest
- "husky": npm install husky --save-dev,
- "jest-extended": npm install --save-dev jest-extended,
- "supertest": npm install supertest --save-dev

## Running tests

The next step in order for you to run the test on this api is seeding the database by typing :

- npm r setup-dbs
- npm r seed

Now we can run tests!
Cd into the tests folder and run

- "npm t seed.test.js"

Thank you for taking the time to look through this repository!
