const test = require('ava');
const parser = require('../src/parser.js');

test('Validate LISP S-Expression, so they contain same amount of opening and closing braces', t => {
	const validExpression = '5 () ()';
	const invalidExpression = '5 () ())';

	t.is(parser.validateSyntax(validExpression), true);
	t.is(parser.validateSyntax(invalidExpression), false);
});

test('Count pair of braces per number block', t => {
	const validExpression = '5 () ()';
	const invalidExpression = '5 () () ()';

	t.is(parser.validateSyntax(validExpression), true);
	t.is(parser.validateSyntax(invalidExpression), false);
});

test('Opening braces can only by followed by a closing brace or an integer', t => {
	const validExpression = '5 (4 () ()) ()';
	const validEmptyExpression = '()';
	const invalidExpression = '5 (())';

	t.is(parser.validateSyntax(validExpression), true);
	t.is(parser.validateSyntax(validEmptyExpression), true);
	t.is(parser.validateSyntax(invalidExpression), false);
});

test('Parser should throw error when encountered with invalid syntax', t => {
	const invalidExpression = '5 (())';
	t.throws(() => parser.parseExpressionString(invalidExpression));
});

test('Parser should parse and return a tree', t => {
	const expressions = [
		{
			'expression': '5 () ()',
			'expected': [5, [], []]
		},
		{
			'expression': '5 (4 () ()) ()',
			'expected': [5, [4, [], []], []]
		},
		{
			'expression': '5 () (6 (2 () ()) ())',
			'expected': [5, [], [6, [2, [], []], []]]
		},
		{
			'expression': '5()()',
			'expected': [5, [], []]
		},
		{
			'expression': '5()(6(2()())())',
			'expected': [5, [], [6, [2, [], []], []]]
		}
	];

	expressions.forEach(e => {
		t.deepEqual(parser.parseExpressionString(e.expression), e.expected);
	});
});

test('Parser should be able to parse an exercise file', t => {
	let fileSrc = `${__dirname}/../data/exercise.txt`;
	let parsedExercise = parser.parseExerciseFile(fileSrc);
	t.is(parsedExercise.length, 4);
	t.is(parsedExercise[3].sum, 5);
	t.is(parsedExercise[3].expression, ' ()');
});
