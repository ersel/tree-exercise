class BinaryTree {
	constructor(value) {
		this.value = value;
		this.left = null;
		this.right = null;
	}

	isLeafNode() {
		if (this.left === null && this.right === null) {
			return true;
		}
		return false;
	}

	rootToLeafPathSum(sumToReach) {
		// checks if there is
		// a root to leaf path sum
		// which is equal to sumToReach
		// recursively go down the tree
		// subtract node value from sumToReach
		let currentSum = sumToReach - this.value;
		if (this.isLeafNode()) {
			return currentSum === 0;
		}
		else {
			let leftSum = this.left ? this.left.rootToLeafPathSum(currentSum) : false;
			let rightSum = this.right ? this.right.rootToLeafPathSum(currentSum) : false;
			return leftSum || rightSum;
		}
	}
}

const generateBinaryTreeRecursive = (data) => {
	// this function takes the parsed S-expression
	// from parser module, and builds a BinaryTree
	// recursively
	// e.g: [5, [], []]
	if(Array.isArray(data) && data.length === 3) {
		let generatedTree = new BinaryTree(data[0]);
		generatedTree.left = generateBinaryTreeRecursive(data[1]);
		generatedTree.right = generateBinaryTreeRecursive(data[2]);
		return generatedTree;
	}
	else {
		return null;
	}
};

module.exports = {
	BinaryTree,
	generateBinaryTreeRecursive
};
