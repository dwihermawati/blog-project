import {
  $applyNodeReplacement,
  DecoratorNode,
  SerializedLexicalNode,
} from 'lexical';
import type { JSX } from 'react';

export type SerializedImageNode = {
  altText: string;
  src: string;
  type: 'image';
  version: 1;
} & SerializedLexicalNode;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__key);
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, altText } = serializedNode;
    return $createImageNode({ src, altText });
  }

  exportJSON(): SerializedImageNode {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      altText: this.__altText,
    };
  }

  constructor(src: string, altText: string, key?: string) {
    super(key);
    this.__src = src;
    this.__altText = altText;
  }

  createDOM(): HTMLElement {
    const img = document.createElement('img');
    img.src = this.__src;
    img.alt = this.__altText;
    img.className = 'my-4 max-w-full max-h-75 rounded mx-auto';
    return img;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <img
        src={this.__src}
        alt={this.__altText}
        className='my-4 max-w-50 rounded'
      />
    );
  }
}

export function $createImageNode({
  src,
  altText,
}: {
  src: string;
  altText: string;
}): ImageNode {
  return $applyNodeReplacement(new ImageNode(src, altText));
}
