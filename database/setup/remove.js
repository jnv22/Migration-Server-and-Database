const Model = require('../model');

const modelLength = Object.keys(Model).length;
let count = 0;

const dbValues = Object.values(Model);

dbValues.map((value) => {
  value.collection.remove((err) => {
    count++;
    if (err) console.log(err);
    else console.log('success');

    if (count === modelLength) return process.exit();
  });
});
