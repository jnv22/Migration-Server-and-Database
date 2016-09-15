var Model = require('../model')
var count = 0
var modelLength = Object.keys(Model).length

for (var key in Model) {
  Model[key].collection.remove(function(err, suc) {
    count ++
    if (err) console.log(err)
    else console.log("success")

    if (count === modelLength) process.exit()
  })
}
