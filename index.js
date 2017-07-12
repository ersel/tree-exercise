'use strict';

const parser = require('./src/parser.js');
const generateTree = require('./src/tree.js').generateBinaryTreeRecursive;

let exerciseFileSrc = `${__dirname}/data/exercise.txt`;
let exerciseData = parser.parseExerciseFile(exerciseFileSrc);

exerciseData.map(e => {
	let parsedExpression = parser.parseExpressionString(e.expression);
	let generatedTree = generateTree(parsedExpression);
	let friendlyOutput = 'no';
	if (generatedTree) {
		let pathSumCheck = generatedTree.rootToLeafPathSum(e.sum);
		friendlyOutput = pathSumCheck ? 'yes' : 'no';
	}
	console.log(friendlyOutput);
});
