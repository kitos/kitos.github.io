---
slug: yet-another-article-about-css-composition
lang: en
title: Yet another article about CSS composition
date: 2020-03-26T11:10:20.179Z
thumbnail:
  img: /images/uploads/lazy.jpg
  author: f
  src: f
tags:
  - f
preface: f
---
The common practice now is to create a list of styled components in the top of a file and then compile them into one react component, or sometimes even moving styled components into separate file. Which kills the initial idea - colocation. We are not concerned that HTML and JS should leave together anymore, but looks like [we still are about CSS](https://twitter.com/markdalgleish/status/1242382940446711808). Even though they are not considered to be [different concerns for a long time](https://youtu.be/x7cQ3mrcKaY).

In general, by spreading logic across project (we might also call it structuring) [we do not simplify](https://twitter.com/dan_abramov/status/1145354949871767552) neither maintenance nor navigation. To efficiently work with a codebase I want to quickly understand how certain pieces work. If in order to understand e.g. how experts avatars are aligned I have to jump between files, JSX and CSS it is definitely not a win.

The key to success is building small reusable blocks and combining them into more complex blocks - composition. And of course it is not the most obvious advice to follow. But at least we can try and compile some list of more concrete advices and examples:

It is pretty common for us to extract functions that might be reused, filling up *utils* folder with one time used helpers. But for some reason we are ok with introducing thousands of Wrappers and Containers. It is also super hard to overestimate usefulness of their names.

Also when we are speaking about composition, we also mentioning that it (composition) is declarative. Even though css is declarative by nature, it is not always easy to express our design: sometimes we have to write enormous listings with media queries.

To fix both issues we can use layout components like Flex and Box provided by @rebass/grid. With a help of them you can easily *describe* the adaptive/responsive layout of your components: