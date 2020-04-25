---
slug: refactor-as-no-one-is-watching
lang: ru
title: Рефактори как будто никто не видит
date: 2020-04-25T09:03:57.280Z
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
  - reactjs
preface: Небольшая история о разработке codemode'ов - скриптов которые упрощают
  большие рефакторинги, эдакие поиск/замена на стероидах.
---
Сложно недооценить важность инструментов использующих [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) трансформации в современном фронтенде:

* мы используем `babel`

  * чтобы *транспилировать* современные версии *ECMAScript* в те, что совместимы с более старыми версиями браузеров
  * чтобы [оптимизировать наш код](https://github.com/jamiebuilds/babel-react-optimize)
  * чтобы [получить новые возможности](https://emotion.sh/docs/css-prop)
* закрепляем общие подходы и избегаем багов с помощью `eslint`
* форматируем код `prettier`'ом

Но сегодня мы поговорим о AST трансформациях для рефакторинга кода. Вы возможно уже использовали так называемые *codemodes*.

##  Предыстория

Мы в [tourlane](https://www.tourlane.de/) используем [styled-components](https://styled-components.com/) (вероятно, одно из самых популярных *CSS-IN-JS* решений в react сообществе) и [styled-system](https://styled-system.com/) (очень крутой набор утилит для написания адаптивных стилей), благодаря которым мы можем писать что-то вроде этого:

```jsx
let User = ({ avatar, name }) => (
  <Flex flexDirection={['column', 'row']}>
    <Box as="img" mb={[1, 0]} mr={[0, 1]} src={avatar} />
    <Box p={1}>{name}</Box>
  </Flex>
)
```

И хотя кому-то синтаксис может показаться неоднозназначным, да и не сильно относится к сути статьи (но важен для предыстории), я всё-таки воспользуюсь моментом и поделюсь списком статей, которые раскрывают идеи за ним скрывающиеся (к сожалению все на английском):

* [Two steps forward, one step back](https://jxnblk.com/blog/two-steps-forward/)
* [Styles and Naming](<* [https://www.christopherbiscardi.com/post/styles-and-naming](https://www.christopherbiscardi.com/post/styles-and-naming/)/>)
* [Old and new ideas in React UI](https://react-ui.dev/core-concepts/ideas)

Нас конкретно интересуют адаптивные атрибуты, как этот `jsx±flexDirection={['column', 'row']}`. Под капотом он, используя заданные нами контрольные точки (breakpoints), превратит вот в такой css с медиа-выражениями:

```css
.some-generated-class {
  flex-direction: column;
}

@media screen and (min-width: 64em) {
  .some-generated-class {
    flex-direction: row;
  }
}
```

> Для первого значения медиа-выражение не требуется, т.е. используется mobile-first подход - стили в первую очередь пишутся для мобильных устройств.

## Проблема

Когда мы только начинали разрабатывать один из наших проектов, у нас не было специфичных стилей  для планшетов:

```jsx
let breakpoints = [
   // всё что меньше - мобильное утройство
  '64em', // десктоп
  '80em', // широкие экраны
]

let Layout = ({ children }) => (
  <ThemeProvider theme={{ breakpoints }}>
    <Header />
    {children}
    <Footer />
  </ThemeProvider>
)
```

Но спустя некоторое время, нам понадобилось разработать страницу, у которой раскладка для смартфонов и планшетов существенно различалась. И как вы уже догадались, наша конфигурация это не поддерживала 😧: мы более не могли использовать адаптивные атрибуты к которым так привыкли 😨. Добавление новой контрольной точки сломало бы все существующие компоненты 😰.

Я уверен каждый рано или поздно оказывается в подобной ситуации: может вы что-то не предусмотрели, может изменили взгляды относительно каких-то общих подходов или синтаксиса, а может вышла новая версия библиотеки с ломающими изменениями (несовместимыми с тем как вы используете её сейчас). И если в последнем случае часто сами разработчики библиотек предоставляют те самые *codemodes*, вместе с релизом (команды *angular* и *react*, во всяком случае так делают). То во всех остальных ситуациях спасение утопающих будет сами знаете что.

## jscodeshift  спешит на помощь

Хотя наша ситуация не была безвыходной: мы всё-ещё могли писать стили для планшетов используя обычные медиа-выражения. Мириться мы с этим не собирались: очень уж нам полюбился этот лаконичный способ описания интерфейсов. Да и множить количество подходов к написанию адаптивных стилей на проекте нам не хотелось. Но в тоже время перспектива изменения сотен мест руками нас пугала.

И тут я подумал, а ведь это отличный повод для того чтобы разобраться с тем, как самому писать *codemodes*!

От твиторских я слышал, что [jscodeshift](https://github.com/facebook/jscodeshift) хороший инструмент для их создания, команда реакта [использует именно его](https://github.com/reactjs/react-codemod). Благодаря ему вам нужно лишь написать `js/ts` файл который будет экспортировать функцию *transform,* ответственную за модификацию вашего *AST*.

Другая важная вещь это собственно понимание самого *AST*: что это, из чего состоит и как вообще его менять. [Руководство babel](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/ru/README.md) может послужить отличной вводной.

Another important part is, of course, a general understanding of AST: what it is, what it consists of and how we can alter it. I found this [babel handbook](https://github.com/jamiebuilds/babel-handbook) to be super useful intro. Another must-have tool is [AST explorer](https://astexplorer.net/). With help of this tool you can write some code to see its AST representation and write transform functions with immediate results!

Also I can hardly imagine writhing AST transformation without `typescript` (you can get info about nodes and their properties, right during typing intead of switching between editor and bable docs all the time), so I installed its typings (`@types/jscodeshift`) along with a library itself.

And after about an hour of playing with it I built this:

```typescript
import { Transform } from 'jscodeshift';

let directions = ['', 't', 'r', 'b', 'l', 'x', 'y'];
// these are responsive attrs provided by styled-system
let spaceAttributes = [
  ...directions.map(d => `m${d}`),
  ...directions.map(d => `p${d}`),
  'flexDirection', 'justifyContent', // ...
];

let transform: Transform = (fileInfo, { j }) =>
  j(fileInfo.source)
    .find(j.JSXAttribute)
    .forEach(({ node }) => {
      let attributeName =
        typeof node.name.name === 'string' ? node.name.name : `¯\\_(ツ)_/¯`;
      let { value } = node;

      if (
        spaceAttributes.includes(attributeName) &&
        // we are interested only array expressions which has more then 1 value
        // like <Box m={[8, 16, 24]}>
        value?.type === 'JSXExpressionContainer' &&
        value.expression.type === 'ArrayExpression' &&
        value.expression.elements.length > 1
      ) {
        let [xs, ...otherMedias] = value.expression.elements;

        // null in styled-system means - do not introduce new media query,
        // so thanks to mobile first approach we'll have values defined in xs.
        // I could also write [xs, xs, ...otherMedias],
        // it will just result in bigger css output
        value.expression.elements = [xs, j.identifier('null'), ...otherMedias];
      }
    })
    .toSource();

export default transform;
```

You can also play with live example in [AST explorer](https://astexplorer.net/#/gist/d76e9a0c6e5f0cea12c039bc1b3f0d4c/4a5c9afcfda6967a4d0205ba8093e2b0c363ac4c).

As you can see the transform is not that big and yet very descriptive. Obviously it doesn't cover all possible cases, e.g. we could use ternary expressions in jsx attributes or use variables referring to arrays and etc. But it does explain the idea, at least I hope so.

The cool thing is you can run your codemode ➡️rollback using git ➡️improve 🔁1000 times, until you are happy with the result.

## Make codemodes part of your toolbelt

That is all I wanted to share today. I hope after reading this article you will consider codemodes to be not just powerful tool, but also a thing that is easy to learn, as I did. If you have any questions or suggestion feel free to use comments section or rich me directly in [twitter](https://twitter.com/kitos_kirsanov). Thanks!