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


```
import { Transform } from 'jscodeshift/src/core';

const directions = ['', 't', 'r', 'b', 'l', 'x', 'y'];
const spaceAttributes = [
  ...directions.map(d => `m${d}`),
  ...directions.map(d => `p${d}`),
];

const transform: Transform = (fileInfo, { j }) => {
  return j(fileInfo.source)
    .find(j.JSXAttribute)
    .filter(
      path =>
        typeof path.node.name.name === 'string' &&
        spaceAttributes.includes(path.node.name.name)
    )
    .forEach(path => {
      const value = path.node.value;

      if (
        value?.type === 'JSXExpressionContainer' &&
        value.expression.type === 'ArrayExpression' &&
        value.expression.elements.length > 1
      ) {
        const [head, ...tail] = value.expression.elements;

        value.expression.elements = [head, j.identifier('null'), ...tail];
      }
    })
    .toSource();
};

export default transform;

```