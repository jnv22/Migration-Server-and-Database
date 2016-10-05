# Migration-Server-and-Database

The server and database component to the Migration App.  The server is written in Express.js and the database is in MongoDB

## What is it?

Migration will be a full-stack app utilizing a Ember.js/Node.js server and Mongoose to provide Object Data Mapping(ODM) with MongoDB and React.js on the frontend. This application will track migration patterns of various species of birds as they begin their fall and spring migrations across the United States. This application will display beautiful data visualizations and maps of past and present populations and current trends. This data will be supplied by the user, with an input box asking for field data.


## Get Started

1. Clone project, then `npm install`.  

2. Change env.js to point at the server.

3. Create config.json file in the directory root containing the Facebook App Id and Facebook App Secret Key. 
  * ex: `{
  "FacebookAppId": "xxxxxxxxxxxxxx",
  "FacebookAppSecretKey": "xxxxxxxxxxx"
}`

4. To run, type `gulp watch` into the shell
