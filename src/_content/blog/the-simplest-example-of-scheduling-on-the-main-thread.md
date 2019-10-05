---
slug: the-simplest-example-of-scheduling-on-the-main-thread
lang: en
title: The simplest example of scheduling on the main thread
date: 2019-02-19T22:42:04.602Z
thumbnail: /images/uploads/jeshoots-com-9qqtuym4ss4-unsplash.jpg
tags:
  - web-api
  - algorithms
  - reactjs
preface: >-
  I have recently read several articles related to relatively new react
  reconciliation algorithm (aka react fiber). And I wondered how to implement
  something really simple to explain idea of scheduling and splitting work into
  chunks. So here is my thoughts.
---
## The problem

The more complex our applications become the more work browser have to do. And due to single threaded nature of javascript it is becoming harder to make our apps responsive (to respond to user interactions immediately).

Let's develop some simple app to clearly understand what I am talking about. An app I would like to create will generate huge array of random numbers and sort it.

Let's start with core feature - sort function. Yep, we are not going use 

_Array.prototype.sort_, cause it will be impossible to improve it later. The simplest algorithm I know is [bubble sort](https://en.wikipedia.org/wiki/Bubble_sort):

```js
let sortPass = array => {
  let needOneMorePass = false

  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] > array[i + 1]) {
      let temp = array[i]
      array[i] = array[i + 1]
      array[i + 1] = temp

      needOneMorePass = true
    }
  }

  return needOneMorePass
}

let bubbleSortSync = array => {
  // do not mutate original array
  let clone = array.slice()

  while (sortPass(clone)) {}

  return clone
}
```

I've splitted algorithm into 2 functions to show how it is easy breakable into units of work - passes.

Now let's add some simple ui: button to trigger core functional of our app (sorting). To track ui responsiveness during algorithm execution we will add css animation and text input. Also we will try to display several array elements before and after sorting:

[stop the world - bubble sort](embedded-codesandbox://the-simplest-example-of-scheduling-on-the-main-thread/stop-the-world)

Have you seen that? Button click "stops the world": green block is not rotating anymore, input cannot be edited. And the reason for that is that browser processes everything in a single thread: it wasn't able to update layout and respond to user while we were sorting.

![Stop the world](/images/uploads/stop-the-world.jpg "Stop the world")

To improve our app we should not block main thread for more than 16ms (for 60 frames per second). Thus, we should be able to suspend the execution of the sort function and resume it after the browser has completed its work.

## Schedule on the main thread!

Luckily our algorithm can be suspended/resumed easily and browser has [nice API](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) to determine best time to execute low priority (not connected to user interactions and animations) code - _requestIdleCallback. _Here is how we can use it:

```js
// we won't be able to return sorted array synchronously anymore
// so let's use promises
let bubbleSortAsync = (array) => new Promise(resolve => {
  // immutability espeсially importaint in async code
  let clone = array.slice()

  requestIdleCallback(function step(deadline) {
    let needOneMorePass = false

    do {
      needOneMorePass = sortPass(clone)

    } while (needOneMorePass && deadline.timeRemaining())

    if (needOneMorePass) {
      // resume sorting later
      requestIdleCallback(step)
    } else {
      resolve(clone)
    }
  })
})
```

Experience became so smooth that I decided to rerender array elements on every callback (to show the progress).
And here is a demo:

[Imagine next app](embedded-codesandbox://the-simplest-example-of-scheduling-on-the-main-thread/scheduling)

Here is how it looks in profiler:

![Smooth sort profile](/images/uploads/smooth-sort-profile.jpg "Smooth sort profile")

Looks cool, right? Though sorting takes a bit more time to finish, user doesn't feel that it is slow. That is exactly what we were looking for.

### We are not alone in scheduling war

Pretty same ideas are used in newer version of [react reconciliation](https://reactjs.org/docs/reconciliation.html) algorithm - Fiber. But in our case we didn't take into account a lot of things:

- it was easy to split work of bubble sort into chunks (what about other algorithms?) 
- we did not care about cancelation what if user pressed sort button again?
can we drop a job we've done and start new one? 
- in real apps there would be probably more kind of jobs
so what about prioritising? 
- ... 

And we do not have to! React team has already solved all this complex things and we haven't even noticed that - there was no API changes when fiber was introduced.

Also one day browsers might introduce [more convenient API](https://github.com/developit/task-worklet) for scheduling.

### Useful links

- [A Quest to Guarantee Responsiveness: Scheduling On and Off the Main Thread (Chrome Dev Summit 2018)](https://www.youtube.com/watch?v=mDdgfyRB5kg) 
- [Lin Clark - A Cartoon Intro to Fiber - React Conf 2017](https://www.youtube.com/watch?v=ZCuYPiUIONs) 
- [The how and why on React’s usage of linked list in Fiber to walk the component’s tree](https://medium.com/react-in-depth/the-how-and-why-on-reacts-usage-of-linked-list-in-fiber-67f1014d0eb7) 
- [React as a UI Runtime](https://overreacted.io/react-as-a-ui-runtime/)
