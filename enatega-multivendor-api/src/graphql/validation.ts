import { GraphQLError, Kind, type ASTVisitor, type ValidationContext, type FragmentDefinitionNode, type SelectionSetNode } from 'graphql';

/** Rejects operations nested deeper than `maxDepth` (fragments are followed). */
export function depthLimit(maxDepth: number) {
  return (context: ValidationContext): ASTVisitor => {
    const fragments = new Map<string, FragmentDefinitionNode>();
    for (const def of context.getDocument().definitions) if (def.kind === Kind.FRAGMENT_DEFINITION) fragments.set(def.name.value, def);
    const measure = (set: SelectionSetNode | undefined, depth: number, seen: Set<string>): number => {
      if (!set) return depth;
      let max = depth;
      for (const sel of set.selections) {
        if (sel.kind === Kind.FIELD) {
          if (sel.name.value.startsWith('__')) continue;
          max = Math.max(max, measure(sel.selectionSet, depth + 1, seen));
        } else if (sel.kind === Kind.INLINE_FRAGMENT) {
          max = Math.max(max, measure(sel.selectionSet, depth, seen));
        } else if (sel.kind === Kind.FRAGMENT_SPREAD) {
          const name = sel.name.value;
          if (seen.has(name)) continue;
          const frag = fragments.get(name);
          if (frag) max = Math.max(max, measure(frag.selectionSet, depth, new Set([...seen, name])));
        }
        if (max > maxDepth) return max;
      }
      return max;
    };
    return {
      OperationDefinition(node) {
        const depth = measure(node.selectionSet, 0, new Set());
        if (depth > maxDepth) {
          context.reportError(new GraphQLError(`Query depth ${depth} exceeds the maximum of ${maxDepth}.`, { nodes: [node] }));
        }
      },
    };
  };
}

/** Limits the number of aliased fields per operation (prevents alias-based amplification). */
export function aliasLimit(maxAliases: number) {
  return (context: ValidationContext): ASTVisitor => {
    let count = 0;
    return {
      Field(node) {
        if (node.alias) {
          count++;
          if (count === maxAliases + 1) context.reportError(new GraphQLError(`Too many aliases (max ${maxAliases}).`, { nodes: [node] }));
        }
      },
    };
  };
}
