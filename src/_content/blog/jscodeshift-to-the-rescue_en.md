---
slug: jscodeshift-to-the-rescue
lang: en
title: refactor as no one is watching or jscodeshift to the rescue
date: 2020-04-14T10:10:20.179Z
thumbnail:
  img: /images/uploads/lazy.jpg
  author: f
  src: f
tags:
  - jscodeshift
  - recast
  - ast
  - babel
  - styled-system
  - styled-components
  - responsive
  - responsive-design
preface: f
---
It is hard to underestimate an importance  of ast transformation tools in the frontend now:

* we use babel to babel

  * to transform the most recent ECMAScript versions to work with older versions of browsers
  * to optimize our code
  * to improve engineering experience
  * to get new features
* we use eslint to 
* we use prettier
* we use...

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