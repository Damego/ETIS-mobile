import React from 'react';

export default function ComposeChildren({ children }: { children: React.ReactNode }) {
  const array = React.Children.toArray(children);
  const content = array.pop();

  return array.reduceRight(
    (child, element) =>
      React.isValidElement(element)
        ? React.createElement(element.type, element.props, child)
        : child,
    content
  );
}
