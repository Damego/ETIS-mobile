export const getStyles = (textColor: string, selectionColor: string) => `
* {
  margin: 0;
  padding: 0;
  list-style: none;
  color: ${textColor}
}

a {
  text-decoration: none;
  color: #427ADE;
  overflow-wrap: break-word;
}

::selection {
  background: ${selectionColor}
}
`;
