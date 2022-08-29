---
slug: first-hands-on-experience-with-reasonml
lang: en
title: First hands on experience with ReasonML
date: 2020-04-25T19:09:05.782Z
thumbnail:
  author: Robert Bye
  img: /images/uploads/surf-robert-bye-unsplash.jpg
  src: https://unsplash.com/@robertbye
tags:
  - reasonml
  - functional_programming
  - fp
  - bucklescript
  - ocaml
preface: Некоторое время назад я начал знакомиться с новым для себя языком
  программирования - ocaml, с его синтаксисом ReasonML если быть точным. А чтобы
  разобраться в нём получше я решил ещё и писать статьи. Эта будет первой (и
  надеюсь не последней).
---
## Where did it came from?

First of all, as offitiall docs stands [reason](https://en.wikipedia.org/wiki/Reason_(programming_language)) is not a new programming language, it's a new syntax and toolchain powered by the battle-tested language, [OCaml](https://ocaml.org/).

Currently *reason* is mostly mentioned in *javascript* and *react* communities for a reason 😏: along with new syntax, a new *backend* (compiler to *js*) is being developed - [bucklescript](https://bucklescript.github.io), and it is led by [Jordan Walke](https://twitter.com/jordwalke), who previously created *react*.

## What can we expect? Where can we use it?

Like I sad, *reason* is not a new language, it is a syntax. And OCaml is a general purpose language, so it is applied in various areas:

* automatic theorem provers 🤷‍♂️
* compilers and interpreters 🙆🏾
* program analyzers 🙆🏾
* used for teaching programming 👩🏽‍🎓
* ...

[Here](https://ocaml.org/learn/success.html) you can find a list of success stories.

*Reason* is also already actively used and there are some pretty interesting projects:

* [revery](https://github.com/revery-ui/revery) - framework for development of cross-platform desktop apps 💻
* [onivim](https://v2.onivim.io/) - IDE build with *revery* 👆
* [rely](https://reason-native.com/docs/rely/) - jest-like blazing fast native test framework ⚡️
* ...

And I think it will be especially interesting for *react* developers to hear that *reason* is [gonna be a better platform for *react*](https://youtu.be/5fG_lyNuEAw):

* its syntax should be familiar to *js* developers
* it is functional hence it is more idiomatic for react.\
  *js* can also be considered functional language, but unlike *js* in *reason* there are:

  * [carring](https://en.wikipedia.org/wiki/Currying)
  * [pattern matching](https://en.wikipedia.org/wiki/Pattern_matching)
  * build in *Option* monad (which it wipes out \`can't read property of underfined\` problem an more)
  * ...
* statically typed, with strong inference mechanism\
   Even though it might not sound like a new think to you: both *typescript* and *flow* proved themselves, and I personally can not imagine starting a new project without them. But *reason* is at completely another level: e.g. you don't have to declare types even for function arguments (which is also true for *flow*). And what even more important, *reason* was built with inference in mind. While *typescript* and *flow* have to struggle with dynamic nature of *js*. \
  Obviously these benefits don't come for free: some things, which people are used to have in *js*, are not available in _reason. And here are some thoughts from Jordan about it:

<blockquote class="twitter-tweet" data-conversation="none" data-lang="ru" data-theme="light" data-link-color="#2B7BB9"><p lang="en" dir="ltr">The hardest part is telling JS developers “no you can’t do that anymore”. I think the easiest path is a fresh, but familiar start, in order to reset expectations.</p>&mdash; Jordan ⚛️ (@jordwalke) <a href="https://twitter.com/jordwalke/status/1143368198558892032?ref_src=twsrc%5Etfw">25 июня 2019 г.</a></blockquote>

* it has awesome interprop with *js* - you can use *js* in _reason 😲 and visa-versa 🙃\
  Result of compilation is minimalistic, optimised for perf and last, but not least human readable 📖!
* it can be compiled to native code, hence you can get insane performance if you need it

## All right, down to business

I hope, at this point you are impressed and interested in learning this language. So we can try to build something using it. I didn't have to think a lot about the app I want to build here. Since uni I am familiar with a [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). I think I implemented it first in *Pascal*, then in *Delphi*, *c*, *java*, *js* and, apparently, it is time to write it in *reason*. I believe it is really good way to start learning a language: you have to write some algorithm, work with collections, build some UI...

You can already checkout complete game and it's source [here](https://kitos.github.io/game-of-life/).

Место действия этой игры - вселенная, предлагаю и начать с её сотворения.

## Variant!

Согласно википедии, вселенная у нас - плоскость, каждая клетка которой может иметь одно из двух состояний: живая (заполненная) 💃 и мёртвая (пустая) 🙅‍♂️.

В *js*, да и во многих других языках, я бы прибегнул к использованию *boolean* или строки (`'alive' | 'dead'`) для описания этого состояния. Но первый подход, на мой взгляд, не самый прозрачный/декларативный, а второй мне не нравится тем, что строки и без того многолики: они и текст хранят, и ключами в объектах/картах выступают и наверняка что-то ещё 🤔. В *typescript* есть *enum*, что уже ближе к тому, с чем хотелось бы работать. Но в *reason* есть нечто лучшее - *variant*'ы. Чем они лучше?

1. Они дают бОльшую типо-безопасность - *reason* заставляет проверить все кейсы *variant*'ов при работе с ними. Встроеным variant'ом является `option`, тот самый, что спасёт нас от `null`'ов и `undefined`'ов, которых в reason нет. В случае с `option` значение у нас может быть - `Some('a)` или не быть - `None`.
2. Они могут хранить одно или несколько значений внутри.
3. Они идут вкупе с другим мощным механизмом языка - сопоставлением с образцом (pattern matching)

Пока давайте остановимся на том, что объявим наш *variant*:

```reason
type cellState =
  | Dead
  | Alive;

let myCell = Alive;
```

Наглядно, не правда ли?

Теперь давайте создадим вселенную - плоскость. Для этого, очевидно, мы будем использовать двумерный массив. Т.к. как цель статьи - изучения языка, давайте попробуем сами реализовать функции, необходимые для создания массивов.

Т.к. двумерный массив ничто иное как массив массивов, начнём мы с функции создания массива, причём не пустого, а наполненного необходимыми значениями. Т.е. я хочу написать функцию, которая принимает 2 значения: длину создаваемого массива и функцию *инициализатор*, которая будет получать в качестве аргумента индекс инициализируемого элемента (обычно это очень удобно, далее покажу почему). Такие функции в функциональном программировании (далее просто *ФП*) носят называние функций высшего порядка, т.к. в качестве аргументов они принимают другие функции (или возвращают их).

## Рекурсивное создание массива

![Recursion](/images/uploads/recursion.jpg 'Recursion')

Другой особенностью языков ФП является то, что в них как правило отсутствуют операторы управления потоком исполнения (🤯): if/else, for/while... т.к. они уводят разработчика от описания вычислений в описание команд машине (не придумал как лучше выразиться 🤷‍♂️). Да и вообще как заметил в одном из своих докладов [Виталий Брагилевский](https://twitter.com/_bravit) ни чем не лучше всеми ненавистного оператора `goto`. И не смотря на то, что в *reason* [циклы есть](https://reasonml.github.io/docs/en/imperative-loops), мы попытаемся воспользоваться идеоматической конструкцией - рекурсией.

```reason
let init = (l, fn) => {
  /*
   * на каждом шаге рекурсии
   * добавляем новый элемент массива
   * и передаём результат в следующий шаг
   */
  let rec _init = (l, arr) =>
    l > 0 ? _init(l - 1, concat(arr, [|fn(l)|])) : arr;

  _init(l, [||]);
};
```

Для людей пришедших из *js*, незнакомыми тут являются 2 конструкции:

* `rec` - в *reason* мы вынуждены явно указать, что наша функция будет рекурсивной
* `reason±[||]` - литерал создания массива (более привычный `js±[]` создаст список)

### Tail call optimisation

Кто-то, возможно, заметит, что эту функцию можно было бы реализовать и без дополнительной внутренней, а кто-то, что создавать массивы рекурсивно не комильфо - ведь мы можем переполнить стек. И как ни странно оба эти утверждения связаны 😮.

Да, я действительно мог записать эту функцию несколько короче:

```reason
let rec init = (l, fn) =>
  l > 0 ? concat(init(l - 1, fn), [|fn(l)|]) : [||];
```

Но именно эта реализация и привела бы к потенциальному переполнению стека 😆. Почему? Функциональные языки программирования появились не вчера, и компиляторы умеют хорошо их оптимизировать. Примером такой оптимизации является *tail call*. Если коротко, то суть в том, что можно не создавать фрейм в стеке для рекурсивного вызова, если он является последним действием в функции. За счёт этого производительность такой рекурсии будет равна итерации (и вообще может быть ей заменена компилятором). Поподробнее об этом можно прочитать [здесь](https://www.webpurple.net/blog/2018-07-19-optimizaciya-hvostovyh-vyzovov-v-ecmascript-6/).

И если посмотреть на первую реализацию, то видно что в функции `_init` её рекурсивный вызов и является последним, а значит наш компилятор должен её оптимизировать 😌.

И тут искушённый читатель может заметить, что не смотря на то, что ECMAScript 6 предлагает tail call оптимизацию, [большинство браузеров реализовать её пока не смогли](https://kangax.github.io/compat-table/es6/#test-proper_tail_calls_(tail_call_optimisation)). И он будет прав 😭. Но! *Reason* ведь не *js*, и у него есть свой компилятор - *BuckleScript*. И он не полагается на интерпретаторы *js* и сам реализует эту оптимизацию, заменяя эту контрукцию на `while` 🤪. Так будет выглядить скомпилированная функция:

```js
function init(l, fn) {
  var _l = l
  var _arr = /* array */ []
  while (true) {
    var arr = _arr
    var l$1 = _l
    var match = l$1 > 0
    if (match) {
      _arr = /* array */ [Curry._1(fn, (l$1 - 1) | 0)].concat(arr)
      _l = (l$1 - 1) | 0
      continue
    } else {
      return arr
    }
  }
}
```

### Императивность под капотом декларативности

![Scooby doo mask reveal](/images/uploads/reveal.jpg 'Reveal')

Ещё одним замечанием, которое напрашивается, является конкатенация массивов на каждом шаге. И не смотря на то, что я являюсь противником преждевременных оптимизаций, не обратить на это внимание в статье я не могу. Мы действительно создаём массив из одного элемента, а потом копируем его и массив полученный на предыдущем шаге в новый массив. На создание массива из *10к* элеметов наша функция тратит *~60ms* на моём macbook pro. И с этим магический компилятор *reason*'а уже ничего поделать не может. Но и не должен!

* Данная функция лишь пример того, как мы можем использовать рекурсию вместо императивных циклов
* *Reason* не запрещает использовать циклы
* Также можно использовать более идеоматические для ФП структуры данных.\
  Например использование списков в рекурсивной функции, а затем преобразование этого списка в массив позволяет создать массив из миллиона элементов за *~300ms* (ведь добавление элемента в список очень дешёвое)
* У *reason* есть стандартная библиотека *Belt* которая предоставляет аналогичный метод `makeBy`, который смог создать массив из *10млн* элеметов с теже *~60ms*

Он, кстати, под капотом имеет ту самую императивщину:

```js
function makeByU(l, f) {
  if (l <= 0) {
    return /* array */ []
  } else {
    var res = new Array(l)
    for (var i = 0, i_finish = (l - 1) | 0; i <= i_finish; ++i) {
      res[i] = f(i)
    }
    return res
  }
}
```

### Типизация

А вы заметили, что мы не описали ни одного типа? Но reason при этом вывел следующий тип для нашей функции: `reason±(int, int => 'a) => Js_array.t('a)`, что означает: фунция которая на вход принимает целое число и функцию, которая тоже принимает целое число а возвращает *что-то* (`a'`), а наша исходная функция вернёт массив этого *чего-то*. Так мы с вами это и задумывали: целое число - это размер создаваемого массива, функция - наш инициализатор, ну и результат действительно массив результатов инициализатора. Кстати, плагин для *WebStorm* показывает выведенные типы следующим образом:

![Webstorm plugin displays inferred types](/images/uploads/webstorm-reason-inference.jpg 'Webstorm plugin for reasonml')

Магия не правда ли? Для меня, как для человека большую часть времени работающего с *typescript*'ом - правда. Как это работает? Ну... *Reason* это ведь новый синтаксис для *OCaml*, который является реализацией языка *Caml*, который, в свою очередь, принадлежит семейству *ML*, в котором используется система типов *Хиндли—Милнера* (надеюсь не ошибся в этой цепочке 🤞). Именно эта система то и позволяет автоматически выводить типы для выражений. Из теории это всё, что на данный момент могу сказать 😳. На практике же, как вы убедились, это означает что нам вовсе не надо описывать типы чтобы получить статическую типизацию.

## Создание матрицы

![Neo stands in front of matrix of TVs](/images/uploads/matrix.jpg 'Matrix')

Ну теперь когда мы умеем создавать массивы, можно и создать массив массивов. Для этого предлагаю использовать библиотечную функцию `reason±makeBy` которая сигнатурой не отличается от созданной нами, но на несколько порядков производительнее:

```reason
let makeMatrixBy = (dimx, dimy, fn) =>
  makeBy(dimy, y => makeBy(dimx, x => fn((x, y))));
```

Ну тут вроде всё просто: принимаем размеры матрицы и функцию инициализатор, возвращаем массив размером `reason±dimy` каждый элемент которого это массив размером `reason±dimx`, наполненный значениями которые возвращает функция `reason±fn`.

### Tuple

Но особенность тут всё же есть - `reason±fn((x, y))`. Я не ошибся, это не лишние скобочки, это [кортеж](https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D1%80%D1%82%D0%B5%D0%B6_(%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0)) ([tuple](https://en.wikipedia.org/wiki/Tuple)) - неизменяемый, упорядоченный, разнородный список значений фиксированного размера. Как говорит официальная документация эта структура данных очень удобна, когда вам нужно передать или вернуть несколько значений *без лишних церемоний*.

Ну с неизменяемостью и фиксированным размером, я думаю, всё понятно. Упорядоченность элементов позволяет обойтись без имён свойств. А благодаря разнородности мы можем хранить значения разных типов в одном кортеже.

Т.е. *tuple* может заменить нам объекты, но я бы не стал их использовать для сущности с более чем тремя атрибутами - сложно будет запомнить, что зачем идёт. А вот для хранения пары координат они подходят идеально 😉.

В *js*, кстати, аналогом могут выступить массивы, для них (как и в *reason* для *tuple*) есть очень удобный синтаксис деструктуризации: `js±let [x, y] = coordinates;` (в reason: `reason±let (x, y) = coordinates;`).

Ну давайте наконец попробуем создать случайно заполненную вселенную:

```reason
let universe = makeMatrixBy(5, 5, _ => Js_math.random() > 0.5 ? Alive : Dead);
Js.log(universe);
```

Что в консоли хрома даёт нам вот такую картинку:

![Матрица в консоли хрома](/images/uploads/random-universe.jpg 'Матрица')

## Итого

Не смотря на то, что с точки зрения игры мы продвинулись не так далеко, мы теперь знаем что такое *reason*, откуда он пришёл и где его можно использовать, а также разобрали несколько языковых конструкций.

Надеюсь, вам было интересно, и вы ещё придёте читать другие статьи про *reason* и не только.

А ещё не забывайте давать обратную связь. Сделать это можно через комментарии, а можно выделив текст на странице отправить сообщение о какой-либо неточности.