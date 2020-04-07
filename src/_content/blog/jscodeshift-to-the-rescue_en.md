---
slug: jscodeshift-to-the-rescue
lang: en
title: jscodeshift to the rescue
date: 2020-03-26T11:10:20.179Z
thumbnail:
  img: /images/uploads/lazy.jpg
  author: f
  src: f
tags:
  - f
preface: f
---
```typescript
import { Transform } from 'jscodeshift';

const directions = ['', 't', 'r', 'b', 'l', 'x', 'y'];
const spaceAttributes = [
  ...directions.map(d => `m${d}`),
  ...directions.map(d => `p${d}`),
];

const transform: Transform = (fileInfo, { j }) =>
  j(fileInfo.source)
    .find(j.JSXAttribute)
    .forEach(({ node }) => {
      const attributeName =
        typeof node.name.name === 'string' ? node.name.name : `¯\\_(ツ)_/¯`;
      const { value } = node;

      if (
        spaceAttributes.includes(attributeName) &&
        // we are interested only array expressions which has more then 1 value
        // like <Box m={[8, 16, 24]}>
        value?.type === 'JSXExpressionContainer' &&
        value.expression.type === 'ArrayExpression' &&
        value.expression.elements.length > 1
      ) {
        const [xs, ...otherMedias] = value.expression.elements;

        value.expression.elements = [xs, j.identifier('null'), ...otherMedias];
      }
    })
    .toSource();

export default transform;
```