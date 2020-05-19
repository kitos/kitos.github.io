---
slug: l11n-with-babel-macros
lang: en
tweet_id: t2
title: I18n with babel macros
date: 2020-05-19T11:26:08.598Z
thumbnail:
  img: /images/uploads/matrix.jpg
  author: " "
  src: " "
tags:
  - babel
preface: some
---
```js
/* eslint-disable */
// const { readFileSync }  = require('fs')
const cha = require('./translations/de-DE/translations.json');
const get = require('lodash.get');
const { createMacro, MacroError } = require('babel-plugin-macros');

module.exports = createMacro(
  ({
    references: { default: defaultRefs = [], t: tRefs = [] },
    state,
    babel: { types: t, template },
  }) => {
    let buildReplace = template(
      `%%str%%.replace(/\\$(\\d)/g, (_, i) => %%placeholderValues%%[i-1])`
    );

    [...tRefs, ...defaultRefs].forEach(tPath => {
      let { parentPath } = tPath;
      let pathToTranslation;
      let placeholderValues;

      if (parentPath.type === 'TaggedTemplateExpression') {
        let quasi = parentPath.get('quasi');
        pathToTranslation = quasi.node.quasis[0].value.raw;
      } else if (parentPath.type === 'CallExpression') {
        if (tPath === parentPath.get('callee')) {
          let [pathArg, placeholderValuesPath] = parentPath.get('arguments');

          pathToTranslation = pathArg.node.value;
          placeholderValues = placeholderValuesPath?.node;
        } else if (parentPath.get('arguments').includes(tPath)) {
          throw new MacroError(
            `Invalid usage of 't': do not try to pass it as and arg`
          );
        }
      } else {
        throw new MacroError(`Invalid usage of 't': what are you doing?`);
      }

      if (pathToTranslation) {
        let value = get(cha, pathToTranslation);
        let valueNode;

        switch (typeof value) {
          case 'string': {
            valueNode = t.stringLiteral(value);
            break;
          }
          case 'object': {
            if (value !== null) {
              valueNode = template(`(${JSON.stringify(value)})`)();
              break;
            }
          }
          case 'undefined':
            valueNode = t.identifier('null');
        }

        if (
          typeof value === 'string' &&
          placeholderValues &&
          placeholderValues.elements.every(
            ([nonLiterals, literals], placeholder) =>
              /(Boolean|String|Numeric)Literal/.test(placeholder.type)
          )
        ) {
          let placeholders = placeholderValues.elements.map(v => v.value);

          value = value.replace(/\$(\d+)/g, (_, i) => placeholders[i - 1]);

          valueNode = t.stringLiteral(value);
        }

        parentPath.replaceWith(valueNode);
      } else {
        console.warn('something bad happened :-(');
      }
    });
  }
);

```