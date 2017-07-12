'use strict';
const fs = require('fs');

const OPENING_BRACE_REGEX = /\(/g;
const CLOSING_BRACE_REGEX = /\)/g;
const INTEGER_BLOCK_REGEX = /\d+/g;
const SPACE_REGEX = /\s+/g;

const countBracePairs = (expression) => {
	// number of opening braces and closing braces should be equal
	const noOfOpeningBraces = expression.match(OPENING_BRACE_REGEX).length;
	const noOfClosingBraces = expression.match(CLOSING_BRACE_REGEX).length;
	return noOfOpeningBraces === noOfClosingBraces;
};

const countBracePairsPerIntegerBlock = (expression) => {
	// for each integer block, there should be exactly 2 brace pairs
	const BRACE_PAIRS_PER_INTEGER = 2;
	const integerBlocks = expression.match(INTEGER_BLOCK_REGEX);
	const noOfIntegerBlocks = integerBlocks ? integerBlocks.length : 0;
	const noOfBracePairs = expression.match(OPENING_BRACE_REGEX).length;
	if (noOfIntegerBlocks === 0) {
		// edge case () empty tree
		return noOfBracePairs === 1;
	}
	return noOfIntegerBlocks * BRACE_PAIRS_PER_INTEGER  === noOfBracePairs;
};

const checkLISPGrammar = (expression) => {
	// every opening brace must be followed with a closing brace or an integer
	const openingBraces = expression.match(OPENING_BRACE_REGEX);
	for (let i = 0; i < openingBraces.length; i++) {
		const matchStartPos = expression.indexOf(openingBraces[i]);
		const matchEndPos = matchStartPos + openingBraces[i].length;
		if (expression[matchEndPos] !== ')' && isNaN(parseInt(expression[matchEndPos], 10))) {
			return false;
		}
	}

	return true;
};

const removeWhiteSpace = (expression) => {
	// remove white-space, tabs and new lines
	return expression.replace(SPACE_REGEX, '');
};

const replaceWhiteSpace = (expression) => {
	// replace tabs, new lines and multiple lines
	// with a single space
	return expression.replace(SPACE_REGEX, ' ');
};

const validateSyntax = (expression) => {
	// takes in a string of LISP S-expression
	// and returns a boolean depending if valid or not
	let expTrimmed = removeWhiteSpace(expression);
	return countBracePairs(expTrimmed)
		&& countBracePairsPerIntegerBlock(expTrimmed)
		&& checkLISPGrammar(expTrimmed);
};

const parseExpressionString = (expression) => {
	// JS adaptation from
	// https://en.wikipedia.org/wiki/S-expression#Parsing
	if (validateSyntax(expression)) {
		expression = replaceWhiteSpace(expression);
		let sexp = [[]];
		let integer = '';
		for(let i = 0; i < expression.length; i++){
			let character = expression[i];
			if (character === '(') {
				if (integer.length > 0){
					sexp[sexp.length - 1].push(parseInt(integer, 10));
					integer = '';
				}
				sexp.push([]);
			}
			else if (character === ')') {
				if (integer.length > 0){
					sexp[sexp.length - 1].push(parseInt(integer, 10));
					integer = '';
				}
				let temp = sexp.pop();
				sexp[sexp.length - 1].push(temp);
			}
			else if (character === ' ') {
				if (integer.length > 0) {
					sexp[sexp.length - 1].push(parseInt(integer, 10));
					integer = '';
				}
			}
			else {
				integer += character;
			}
		}
		return sexp[0];
	}
	else {
		throw new Error('Invalid LISP Integer Binary Tree Syntax');
	}
};

const parseExerciseFile = (fileSrc) => {
	let exerciseFile = fs.readFileSync(fileSrc, 'utf-8');
	let exerciseFileLines = exerciseFile.split('\n');
	for(let i = 0; i < exerciseFileLines.length; i++){
		if(exerciseFileLines[i][0] === ' ') {
			// this is a multi-line expression
			// append it to the previous element
			// and remove it from array
			exerciseFileLines[i-1] += exerciseFileLines[i];
			exerciseFileLines.splice(i, 1);
			// readjust i, as we just changed array length
			i = i - 1;
		}
	}
	return exerciseFileLines
		.filter(e => e.length > 0)
		.map(e => {
			let sum = parseInt(e.match(/\d+/)[0], 10);
			let expression = e.split(sum)[1];
			// let's remove surrounding brace pair
			// if not empty set edge case
			if (expression.match(OPENING_BRACE_REGEX).length > 1) {
				expression = expression.substr(expression.indexOf('(') + 1, expression.length);
				expression = expression.substr(0, expression.lastIndexOf(')'));
			}
			return {
				sum: sum,
				expression: expression
			};
		});
};

module.exports = {
	validateSyntax,
	parseExpressionString,
	parseExerciseFile
};
