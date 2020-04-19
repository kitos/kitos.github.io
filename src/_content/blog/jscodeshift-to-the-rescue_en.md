---
slug: refactor-as-no-one-is-watching
lang: en
title: Refactor as no one is watching
date: 2020-04-14T10:10:20.179Z
thumbnail:
  img: /images/uploads/dance-as-no-one-watching.jpg
  author: Juan Camilo Navia
  src: https://unsplash.com/@juantures12?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
tags:
  - jscodeshift
  - recast
  - ast
  - codemodes
  - babel
  - styled-system
preface: some
---
It is hard to underestimate an importance  of [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) transformation tools in the frontend now:

* we use `babel`

  * to transform the most recent *ECMAScript* versions to work with older versions of browsers
  * to [optimize our code](https://github.com/jamiebuilds/babel-react-optimize)
  * to get [new features](https://emotion.sh/docs/css-prop)
* we use `eslint` to enforce best practices or avoid mistakes/bugs
* we use `prettier` to format the code

But today I wanna tell a short story about using *AST* transformation to refactor the code. Like some codemodes you might used.

## Backstory

At [tourlane](https://www.tourlane.de/) we use [styled-components](https://styled-components.com/) (probably, the most popular *CSS-IN-JS* solutions in react) along with [styled-system](https://styled-system.com/) (awesome utility belt for easily writing responsive styles based on scales from global theme), so we can write something like this:

```jsx

```

While some of you might find this style of writing components pretty controversial, this is not the point of this article. But I still can recommend these articles to [](https://jxnblk.com/blog/two-steps-forward/)get more reasoning behind it:

* [Two steps forward, one step back](https://jxnblk.com/blog/two-steps-forward/)
* [Styles and Naming](<* [https://www.christopherbiscardi.com/post/styles-and-naming](https://www.christopherbiscardi.com/post/styles-and-naming/)/>)
* [Old and new ideas in React UI](https://react-ui.dev/core-concepts/ideas)

So the point of the code block from above is the usage of responsive CSS values: `something` (pretty handy isn't it?). Under the hood it will use media breakpoints provided in [theme](https://styled-system.com/theme-specification) to compile responsive styles like:

```

```

## The problem

When we started one of our projects we didn't have any styles specific to tablets, let's say we had something similar to this:

```jsx
let breakpoints = [
  // again no need to define lower breakpoint
  // since we use mobile-first
  // (styles applied without media are concidered to be mobile)
  
  '64em', // desktop
  '80em', // wide
]

let Layout = ({ children }) => (
  <ThemeProvider theme={{ breakpoints }}>
    <Header />
    {children}
    <Footer />
  </ThemeProvider>
)
```

But lately we got new page where mobile and table designs are quite different. But our scale system doesn't support it 😧: we cannot use responsive attributes we get used to 😨. If we just add one more breakpoint, it'll break all existing components 😰.

I bet you've been in a situation like this. E.g. you might used some library api which was deprecated. Luckily in cases like this, library authors usually prepare codemods which will update your codebase for you. So you don't even have to understand what it does under the hood.

But in our case there was no one to rely on, nobody to blame... but... me? 🥺

## jscodeshift to the rescue

Even though we could write tablet specific styles *"by hand"* - using *normal* `styled-component`s syntax. It wasn't the way we wanted to proceed - we really like the api provided by `styled-system`, moreover we didn't want to introduce  ambiguity in writing responsive styles. And obviously we wasn't keen to go through the whole codebase to change all usages of responsive props.

Sounds like a perfect task for codemode!

I have never worked with them, but I've heard that [jscodeshift](https://github.com/facebook/jscodeshift) is a cool tool to build them, e.g. react team [uses it.](https://github.com/reactjs/react-codemod) All you have to do is create `js/ts` file and export *transform* function which will take care of required AST transformations.

Another important part is, of course, general understanding of AST: what it is, what it consists of and how we can alter it. I found this [babel handbook](https://github.com/jamiebuilds/babel-handbook) super useful intro. Another must-have tool is [AST explorer](https://astexplorer.net/): with help of it you can write some code to see its AST representation and write transform functions with immediate results!

Also I can hardly imagine writhing AST transformation without `typescript`, so I installed its typings (`@types/jscodeshift`) along with a library itself.

And after about an hour of playing with it I built this:

```typescript
import { Transform } from 'jscodeshift';

// these are responsive properties provided by styled-system
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

As you can see the transform is not that big and yet very descriptive. Obviously it doesn't cover all possible cases, e.g. we could use ternary expressions in jsx attributes or use variables referring to arrays and etc. But it does explain the idea, at least I hope so.



<https://www.toptal.com/javascript/write-code-to-rewrite-your-code>