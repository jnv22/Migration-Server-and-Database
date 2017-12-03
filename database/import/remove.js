const Model = require('../model');
const modelLength = Object.keys(Model).length;
let count = 0;

for (let key in Model) {
	Model[key].collection.remove(function(err, suc) {
		count ++;
		if (err) console.log(err);
		else console.log('success');

		if (count === modelLength) process.exit();
	});
}
