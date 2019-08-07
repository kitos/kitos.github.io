---
title: Implementing medium like tooltip
date: 2019-08-07T20:52:08.746Z
thumbnail: /images/uploads/blog-tech-stack.jpg
preface: >-
  Do you know that if you select post text on medium a tooltip with several
  options (tweet, highlight...) will appear? Have you used it? I would like to
  tell you how to create similar one and about DOM API I've learned during
  implementation.
tags:
  - reactjs
  - render-props
  - web-api
---
It might (and should) look like quite a trivial thing to implement. But still there are some pitfalls, so I want to tell how to avoid them, what libraries and patterns can help. And again to strengthen my English 😁

## Positioning is not easy

Here is a list of problems commonly faced when dealing with popups:

* how to position element over everything else aka _z-index: 999;_
* take into account viewport borders
* handle scrolling
