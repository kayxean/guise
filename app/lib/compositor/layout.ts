import type { TreeNode, WindowState, Workspace, SplitDirection } from './types';

/**
 * Generates a unique short ID for windows and nodes.
 */
export const generateId = (): string => Math.random().toString(36).substring(2, 9);

/**
 * Determines the split direction based on the current window's aspect ratio.
 */
export function calculateSmartDirection(rect: WindowState['rect']): SplitDirection {
  // We strongly prioritize 'rows' (horizontal stacking) unless the window is extremely wide (ultrawide).
  // This fulfills the user's preference for row-based layouts by default in standard regions.
  return rect.width > rect.height * 1.6 ? 'columns' : 'rows';
}

/**
 * Recursively calculates the exact coordinates and dimensions for all windows in a tree.
 */
export function calculateTreeLayout(
  node: TreeNode,
  boundary: WindowState['rect'],
): Map<string, WindowState['rect']> {
  const layoutMap = new Map<string, WindowState['rect']>();

  const recurse = (n: TreeNode, rect: WindowState['rect']) => {
    if (n.type === 'leaf') {
      layoutMap.set(n.windowId, rect);
      return;
    }

    const { direction, splitRatio, children } = n;
    const [left, right] = children;

    if (direction === 'columns') {
      const splitWidth = Math.floor(rect.width * splitRatio);
      recurse(left, { ...rect, width: splitWidth });
      recurse(right, { ...rect, x: rect.x + splitWidth, width: rect.width - splitWidth });
    } else {
      const splitHeight = Math.floor(rect.height * splitRatio);
      recurse(left, { ...rect, height: splitHeight });
      recurse(right, { ...rect, y: rect.y + splitHeight, height: rect.height - splitHeight });
    }
  };

  recurse(node, boundary);
  return layoutMap;
}

/**
 * Inserts a new window into the tree, splitting the currently active window node.
 */
export function addLeaf(
  root: TreeNode | null,
  newWindowId: string,
  targetId: string | null, // Window ID or Parent Node ID
  boundary: WindowState['rect'], // The boundary of the entire root
  forcedDirection?: SplitDirection | null,
  isFirstChild?: boolean | null,
): TreeNode {
  if (!root) return { type: 'leaf', windowId: newWindowId };

  const nodeContainsTarget = (n: TreeNode): boolean => {
    if (!targetId) return false;
    if (n.type === 'leaf') return n.windowId === targetId;
    if (n.id === targetId) return true;
    return (
      (n.type === 'parent' && nodeContainsTarget(n.children[0])) ||
      (n.type === 'parent' && nodeContainsTarget(n.children[1]))
    );
  };

  let targetFound = false;
  const splitRecursive = (node: TreeNode, rect: WindowState['rect']): TreeNode => {
    const isTarget =
      !targetId ||
      (node.type === 'leaf' && node.windowId === targetId) ||
      (node.type === 'parent' && node.id === targetId);

    if (isTarget) {
      targetFound = true;
      const splitDir = forcedDirection || calculateSmartDirection(rect);
      const newNode: TreeNode = { type: 'leaf', windowId: newWindowId };
      return {
        type: 'parent',
        id: generateId(),
        direction: splitDir,
        splitRatio: 0.5,
        children: isFirstChild ? [newNode, node] : ([node, newNode] as const),
      };
    }

    if (node.type === 'parent') {
      const { direction, splitRatio, children } = node;
      const inLeft = nodeContainsTarget(children[0]);

      if (direction === 'columns') {
        const splitWidth = Math.floor(rect.width * splitRatio);
        const leftRect = { ...rect, width: splitWidth };
        const rightRect = { ...rect, x: rect.x + splitWidth, width: rect.width - splitWidth };

        if (inLeft) {
          return {
            ...node,
            children: [splitRecursive(children[0], leftRect), children[1]] as const,
          };
        }
        return {
          ...node,
          children: [children[0], splitRecursive(children[1], rightRect)] as const,
        };
      } else {
        const splitHeight = Math.floor(rect.height * splitRatio);
        const topRect = { ...rect, height: splitHeight };
        const bottomRect = { ...rect, y: rect.y + splitHeight, height: rect.height - splitHeight };

        if (inLeft) {
          return {
            ...node,
            children: [splitRecursive(children[0], topRect), children[1]] as const,
          };
        }
        return {
          ...node,
          children: [children[0], splitRecursive(children[1], bottomRect)] as const,
        };
      }
    }

    return node;
  };

  const newRoot = splitRecursive(root, boundary);

  // Fallback: If we had a target but didn't find it in this tree (e.g. moved from another workspace),
  // split the root of the workspace.
  if (targetId && !targetFound) {
    const splitDir = forcedDirection || calculateSmartDirection(boundary);
    const newNode: TreeNode = { type: 'leaf', windowId: newWindowId };
    return {
      type: 'parent',
      id: generateId(),
      direction: splitDir,
      splitRatio: 0.5,
      children: isFirstChild ? [newNode, root] : ([root, newNode] as const),
    };
  }

  return newRoot;
}

/**
 * Checks if a window is located within the first (left/top) child of its parent node.
 */
export function isWindowFirstChild(node: TreeNode, targetId: string): boolean | null {
  if (node.type === 'leaf') return null;

  const [left, right] = node.children;

  // Check direct children
  if (left.type === 'leaf' && left.windowId === targetId) return true;
  if (right.type === 'leaf' && right.windowId === targetId) return false;

  // Recurse deeper
  return (
    (left.type === 'parent' ? isWindowFirstChild(left, targetId) : null) ||
    (right.type === 'parent' ? isWindowFirstChild(right, targetId) : null)
  );
}

/**
 * Determines if a specific Node ID or Window ID exists anywhere within a tiling sub-tree.
 */
export function nodeExistsInTree(node: TreeNode, targetId: string): boolean {
  if (node.type === 'leaf') return node.windowId === targetId;
  if (node.id === targetId) return true;

  // Only recurse if we are a parent node to avoid accessing undefined children.
  if (node.type === 'parent') {
    return (
      nodeExistsInTree(node.children[0], targetId) || nodeExistsInTree(node.children[1], targetId)
    );
  }

  return false;
}

/**
 * Removes a window from the tree and collapses the corresponding parent nodes.
 */
export function removeLeaf(root: TreeNode, targetId: string): TreeNode | null {
  if (root.type === 'leaf') {
    return root.windowId === targetId ? null : root;
  }

  const [left, right] = root.children;
  const newLeft = removeLeaf(left, targetId);
  const newRight = removeLeaf(right, targetId);

  if (!newLeft) return newRight;
  if (!newRight) return newLeft;

  return { ...root, children: [newLeft, newRight] as const };
}

/**
 * Updates the split ratio of a parent node containing the specified window.
 */
export function updateNodeSplit(node: TreeNode, targetId: string, ratio: number): TreeNode {
  if (node.type === 'leaf') return node;

  const [left, right] = node.children;
  const isLeftChild = left.type === 'leaf' && left.windowId === targetId;
  const isRightChild = right.type === 'leaf' && right.windowId === targetId;

  if (isLeftChild || isRightChild) {
    return { ...node, splitRatio: Math.max(0.05, Math.min(0.95, ratio)) };
  }

  return {
    ...node,
    children: [
      updateNodeSplit(left, targetId, ratio),
      updateNodeSplit(right, targetId, ratio),
    ] as const,
  };
}

/**
 * Retrieves a flat list of all window IDs present in a layout tree.
 */
export function getTreeLeafIds(node: TreeNode | null): string[] {
  if (!node) return [];
  if (node.type === 'leaf') return [node.windowId];
  return [...getTreeLeafIds(node.children[0]), ...getTreeLeafIds(node.children[1])];
}

/**
 * Finds the first leaf window ID in a given tree branch.
 */
function getFirstLeafId(node: TreeNode): string {
  return node.type === 'leaf' ? node.windowId : getFirstLeafId(node.children[0]);
}

/**
 * Finds the nearest neighboring window ID for focus navigation.
 */
export function findNearestSiblingId(node: TreeNode, targetId: string): string | null {
  if (node.type === 'leaf') return null;
  const [left, right] = node.children;

  if (left.type === 'leaf' && left.windowId === targetId) {
    return right.type === 'leaf' ? right.windowId : getFirstLeafId(right);
  }
  if (right.type === 'leaf' && right.windowId === targetId) {
    return left.type === 'leaf' ? left.windowId : getFirstLeafId(left);
  }

  return findNearestSiblingId(left, targetId) || findNearestSiblingId(right, targetId);
}

export function findSiblingId(node: TreeNode, targetId: string): string | null {
  if (node.type === 'leaf') return null;

  const [left, right] = node.children;

  // Recurse first to find the deep-most sibling relationship
  const deepSibling =
    (left.type === 'parent' ? findSiblingId(left, targetId) : null) ||
    (right.type === 'parent' ? findSiblingId(right, targetId) : null);

  if (deepSibling) return deepSibling;

  // If no deeper sibling found, check if the target is one of our direct children
  if (left.type === 'leaf' && left.windowId === targetId) {
    return right.type === 'leaf' ? right.windowId : right.id;
  }
  if (right.type === 'leaf' && right.windowId === targetId) {
    return left.type === 'leaf' ? left.windowId : left.id;
  }

  return null;
}

/**
 * Finds the split direction of the parent node containing the target window.
 */
export function getParentDirection(node: TreeNode, targetId: string): SplitDirection | null {
  if (node.type === 'leaf') return null;

  const [left, right] = node.children;

  // First, check if either of our direct children is the target window leaf
  if (left.type === 'leaf' && left.windowId === targetId) return node.direction;
  if (right.type === 'leaf' && right.windowId === targetId) return node.direction;

  // Otherwise, recurse deeper into the tree
  return getParentDirection(left, targetId) || getParentDirection(right, targetId);
}

/**
 * Swaps two window IDs within their respective leaf node positions.
 */
export function swapWindowIds(node: TreeNode, idA: string, idB: string): TreeNode {
  if (node.type === 'leaf') {
    if (node.windowId === idA) return { ...node, windowId: idB };
    if (node.windowId === idB) return { ...node, windowId: idA };
    return node;
  }
  return {
    ...node,
    children: [
      swapWindowIds(node.children[0], idA, idB),
      swapWindowIds(node.children[1], idA, idB),
    ] as const,
  };
}

/**
 * Main entry point for synchronizing a workspace's window states with its tree structure.
 */
export function syncWorkspaceLayout(
  workspace: Workspace,
  allWindows: Record<string, WindowState>,
  boundary: WindowState['rect'],
): Record<string, WindowState> {
  if (!workspace.root) return allWindows;

  const newRects = calculateTreeLayout(workspace.root, boundary);
  const updatedWindows = { ...allWindows };

  newRects.forEach((rect, windowId) => {
    if (updatedWindows[windowId]) {
      updatedWindows[windowId] = { ...updatedWindows[windowId], rect };
    }
  });

  return updatedWindows;
}
