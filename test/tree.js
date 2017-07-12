const test = require('ava');
const tree = require('../src/tree.js').BinaryTree;
const generateTree = require('../src/tree.js').generateBinaryTreeRecursive;

test('Create a binary tree with value', t => {
	let myTree = new tree(5);
	t.is(myTree.value, 5);
});

test('Create a binary tree with two leaf nodes', t => {
	let myTree = new tree(6);
	let leftNode = new tree(1);
	let rightNode = new tree(2);

	// no left or right leafs at this time
	t.is(myTree.left, null);
	t.is(myTree.right, null);

	// add left and right leafs
	myTree.left = leftNode;
	myTree.right = rightNode;

	// check root again for left & right leafs
	t.is(myTree.left, leftNode);
	t.is(myTree.right, rightNode);
});

test('Recursively create binary tree from parser output', t => {
	let parserOutput = [5, [], [6, [2, [], []], []]];
	let expectedTree ='{"value":5,"left":null,"right":{"value":6,"left":{"value":2,"left":null,"right":null},"right":null}}';
	let generatedTree = generateTree(parserOutput);
	t.deepEqual(JSON.stringify(generatedTree), expectedTree);
});

test('Recursively create binary tree from parser output', t => {
	let parserOutput = [5, [], [6, [2, [], []], []]];
	let generatedTree = generateTree(parserOutput);
	t.is(generatedTree.rootToLeafPathSum(13), true);
});
