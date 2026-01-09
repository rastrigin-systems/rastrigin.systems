import { visit } from 'unist-util-visit';

/**
 * Rehype plugin that wraps mermaid code blocks in a container and preserves the original code.
 * Must run BEFORE rehype-mermaid so the code block still exists.
 */
export default function rehypeMermaidWrapper() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // Find <pre><code class="language-mermaid"> blocks
      if (
        node.tagName === 'pre' &&
        node.children?.[0]?.tagName === 'code' &&
        node.children[0].properties?.className?.includes('language-mermaid')
      ) {
        const codeNode = node.children[0];

        // Extract the mermaid code from text nodes
        const code = extractText(codeNode);

        // Create wrapper div with data attribute storing the code
        const wrapper = {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['mermaid-wrapper'],
            'data-mermaid-code': code,
          },
          children: [node], // Keep the original pre>code for rehype-mermaid to process
        };

        // Replace the pre element with the wrapper
        parent.children[index] = wrapper;
      }
    });
  };
}

function extractText(node) {
  if (node.type === 'text') {
    return node.value;
  }
  if (node.children) {
    return node.children.map(extractText).join('');
  }
  return '';
}
