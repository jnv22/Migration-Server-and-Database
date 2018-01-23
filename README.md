# Migration-Server-and-Database

The server and database component to the Migration App.  The server is written in Express.js and the database is in MongoDB

## What is it?

Migration is a full-stack app utilizing a Node.js server and Mongoose to provide Object Data Mapping(ODM) with MongoDB. React.js will be featured on the frontend. This application will track migration patterns of various species of birds as they begin their fall and spring migrations across the United States. This application will eventually display data visualizations and maps of past and present populations and current trends. This data will be supplied by the user, with an input box asking for field data.


## Get Started

1. Clone project, then `npm install`.  

2. `cp .env.example .env` and fill out all information

3. Install MongoDB, if not already installed, and run.

4. Build database by running `npm run db-build`
  -see package.json for removing and rebuilding the database instance

3. To run, `npm run watch`

4. To build, `num run build` && `npm run serve`
