import type { TreeNode } from './types';

const DEFAULT_SCREEN_WIDTH = 1920;
const DEFAULT_SCREEN_HEIGHT = 1080;

let cachedWidth: number | null = null;
let cachedHeight: number | null = null;

function getScreenDimensions(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: DEFAULT_SCREEN_WIDTH, height: DEFAULT_SCREEN_HEIGHT };
  }
  cachedWidth = window.innerWidth;
  cachedHeight = window.innerHeight;
  return { width: cachedWidth, height: cachedHeight };
}

export function isLeaf(node: TreeNode): boolean {
  return !node.children[0] && !node.children[1];
}

export function getLeaves(node: TreeNode, list: string[] = []): string[] {
  if (isLeaf(node)) {
    list.push(node.id);
    return list;
  }
  const [left, right] = node.children;
  if (left) getLeaves(left, list);
  if (right) getLeaves(right, list);
  return list;
}

export function splitNode(root: TreeNode, targetIndex: number, newId: string): TreeNode {
  const treeLeaves = getLeaves(root);
  const targetId = treeLeaves[targetIndex];

  function replace(node: TreeNode): TreeNode {
    if (isLeaf(node)) {
      if (node.id === targetId) {
        return {
          id: `split_${newId}`,
          children: [
            { id: targetId, children: [null, null] },
            { id: newId, children: [null, null] },
          ],
        };
      }
      return node;
    }

    const [left, right] = node.children;
    const leftChild = left ? replace(left) : null;
    const rightChild = right ? replace(right) : null;

    if (leftChild !== left || rightChild !== right) {
      return { ...node, children: [leftChild, rightChild] };
    }
    return node;
  }

  return replace(root);
}

export function splitNodeAtWindow(root: TreeNode, windowId: string, newId: string): TreeNode {
  function replace(node: TreeNode): TreeNode {
    if (isLeaf(node)) {
      if (node.id === windowId) {
        return {
          id: `split_${newId}`,
          children: [
            { id: windowId, children: [null, null] },
            { id: newId, children: [null, null] },
          ],
        };
      }
      return node;
    }

    const [left, right] = node.children;
    const leftChild = left ? replace(left) : null;
    const rightChild = right ? replace(right) : null;

    if (leftChild !== left || rightChild !== right) {
      return { ...node, children: [leftChild, rightChild] };
    }
    return node;
  }

  return replace(root);
}

export function removeLeaf(root: TreeNode, targetId: string): TreeNode | null {
  if (root.id === targetId && !root.children[0] && !root.children[1]) {
    return null;
  }

  const [left, right] = root.children;

  if (left?.id === targetId) {
    if (!right) return null;
    return right;
  }
  if (right?.id === targetId) {
    if (!left) return null;
    return left;
  }

  if (left && right) {
    const leftChild = removeLeaf(left, targetId);
    const rightChild = removeLeaf(right, targetId);
    if (leftChild !== left || rightChild !== right) {
      if (!leftChild) return rightChild;
      if (!rightChild) return leftChild;
      return { ...root, children: [leftChild, rightChild] };
    }
  }

  return root;
}

export function applyLayout(
  node: TreeNode,
  x: number,
  y: number,
  w: number,
  h: number,
  result: Map<
    string,
    { position: { x: number; y: number }; size: { width: number; height: number } }
  >,
): void {
  if (isLeaf(node)) {
    result.set(node.id, { position: { x, y }, size: { width: w, height: h } });
    return;
  }

  const [left, right] = node.children;
  const ratio = node.splitRatio ?? 0.5;

  if (w > h) {
    const splitWidth = w * ratio;
    if (left) applyLayout(left, x, y, splitWidth, h, result);
    if (right) applyLayout(right, x + splitWidth, y, w - splitWidth, h, result);
  } else {
    const splitHeight = h * ratio;
    if (left) applyLayout(left, x, y, w, splitHeight, result);
    if (right) applyLayout(right, x, y + splitHeight, w, h - splitHeight, result);
  }
}

export function calculateLayout(
  root: TreeNode | null,
): Map<string, { position: { x: number; y: number }; size: { width: number; height: number } }> {
  const result = new Map();
  if (!root) return result;
  const { width: w, height: h } = getScreenDimensions();
  applyLayout(root, 0, 0, w, h, result);
  return result;
}

export function findParentNode(root: TreeNode, targetId: string): TreeNode | null {
  if (!root.children[0] && !root.children[1]) return null;

  const [left, right] = root.children;
  if (left?.id === targetId || right?.id === targetId) {
    return root;
  }

  if (left) {
    const found = findParentNode(left, targetId);
    if (found) return found;
  }
  if (right) {
    const found = findParentNode(right, targetId);
    if (found) return found;
  }

  return null;
}

export function updateNodeSplitRatio(root: TreeNode, windowId: string, ratio: number): TreeNode {
  function update(node: TreeNode): TreeNode {
    if (!node.children[0] && !node.children[1]) {
      return node;
    }

    const [left, right] = node.children;
    if (left?.id === windowId || right?.id === windowId) {
      return { ...node, splitRatio: ratio };
    }

    const leftChild = left ? update(left) : null;
    const rightChild = right ? update(right) : null;

    if (leftChild !== left || rightChild !== right) {
      return { ...node, children: [leftChild, rightChild] };
    }
    return node;
  }

  return update(root);
}

export function swapNodes(root: TreeNode, windowIdA: string, windowIdB: string): TreeNode {
  function swap(node: TreeNode): TreeNode {
    if (isLeaf(node)) {
      if (node.id === windowIdA) return { ...node, id: windowIdB };
      if (node.id === windowIdB) return { ...node, id: windowIdA };
      return node;
    }

    const [left, right] = node.children;
    const leftChild = left ? swap(left) : null;
    const rightChild = right ? swap(right) : null;

    if (leftChild !== left || rightChild !== right) {
      return { ...node, children: [leftChild, rightChild] };
    }
    return node;
  }

  return swap(root);
}
