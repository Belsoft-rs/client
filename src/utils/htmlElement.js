const childNodesRemove = function (parent) {
	let children = parent.childNodes;
	while (children.length) {
		if (children[0] && children[0].parentNode) {
			children[0].parentNode.removeChild(children[0]);
		} else {
			break;
		}
	}
};

export { childNodesRemove };

