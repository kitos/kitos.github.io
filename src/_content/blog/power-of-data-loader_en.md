---
slug: power-of-data-loader
lang: en
tweet_id: t123
title: Power of DataLoader
date: 2021-08-06T09:32:32.760Z
thumbnail:
  author: Karsten Würth
  src: https://unsplash.com/@karsten_wuerth?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
  img: /uploads/power.jpg
tags:
  - dataloader
  - performance
  - contentful
preface: In this post I would like to share my recent experience of working with DataLoader, with a step-by-step example.
---

In this post I would like to share my recent experience of working with DataLoader, with a step-by-step example.

I actually have been thinking about writing an article about DataLoader for few years, since I first tried it. I even had [a talk](https://youtu.be/Iy1DUcBjXcQ) (in russian) about it once.
And finally I have some really simple and yet meaningful example of its usage outside of GraphQL ecosystem.

## Problem space

An app I have recently been working on was a _contentful_ extension which gathered some metrics about content usage/completeness.
One particular feature was to find links to the pages from other ones. E.g. we wanted to know how many offer pages are associated with a city page.

To give you an idea, _contentful_ has a very powerful mechanism to build site hierarchy (not only) - reference fields. Where one entry can have link/s to others.
With a help of it we've been able to create structure like this:

TODO

On which we heavily rely to automate a lot of content sections throughout our website: main navigation, breadcrumbs, thumbnails with parent/child/sibling pages and basically the whole gatsby (yep, we use SSG) build process relies on it.

## Limitation of existing API

And obviously we'd like to use this info to gather our metrics, moreover _contentful_ provides a way to do so - [links_to_entry](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/links-to-entry) query param.
It returns a list of entries which refer to the one you are interested in. E.g. using js sdk:

```js
let { items: entries } = await space.getEntries({
  links_to_entry: 'id-of-our-city',
})
```

But there are few issues with this approach:

- it works for 1 entry, we can't get links to multiple cities;
- _contentful_ docs suggest: "it is more performant to query based on a content type's reference field";

And in my case, I really need to work with hundreds of pages, so both of them sound rather concerning.
Here is an example:

```js
let cityIds = [1, 2, 3, ...hundredMore]

// make 103 parallel heavy requests
// at least contentful sdk handles rate limit responses for us (retries requests)
let citiesWithLinks = await Promise.all(
  cityIds.map((id) => space.getEntries({ links_to_entry: id }))
)
```

Luckily _contentful_ provides an alternative:

```js
space.getEntries({
  // now we need to know
  content_type: 'offer', // referencing content type
  'fields.city.sys.id': 42, // and field
})
```

It also allows using operators, so we actually can make a single request for all cities at once:

```js
let offersReferencingToAllCities = space.getEntries({
  content_type: 'offer',
  'fields.city.sys.id[in]': cityIds,
})
```

Now we have to group this flat array of offers by the city they belong to:

```js
// lodash have a handy method for that
let offersByCityId = _.groupBy(
  offersReferencingToAllCities,
  (offer) => offer.fields.city.sys.id
)
```

Finally, we can get same result we had in the beginning with fewer (just 1 in our case) api calls. Here is full example:

```js
let cityIds = [1, 2, 3, ...hundredMore]

let offersReferencingToAllCities = space.getEntries({
  content_type: 'offer',
  'fields.city.sys.id[in]': cityIds,
})

let offersByCityId = _.groupBy(
  offersReferencingToAllCities,
  (offer) => offer.fields.city.sys.id
)

// ta-da!
cityIds.map((id) => offersByCityId[id] ?? [])
```

Well great, but it's it confusing that we achieved what we wanted to, but didn't use _DataLoader_ as I promised?

Right, there is a couple of issues with our final solution actually:

- it is obviously more complicated than the one we started with;
- contentful has a limit on number of returned entries, so it is very likely that we'd wanna batch in a smart way (and complicate solution even further);
- our abstractions not always allow us to operate on all entities, so that we can batch calls explicitly (e.g. graphql resolvers);

So wouldn't it be cool if we had an api similar to our initial solution, and performance of the last one? Easy! That's what we need _DataLoader_ for!

```js
/**
 * We'll have a data loader per content type and field,
 * cause that's what contentful allows us to batch
 */
let createLinksLoader = (contentType, field) =>
  // we should provide a batch loader
  // which gets an array of keys (in our case entry ids)
  // and returns array of resuls, respecting the original order
  new DataLoader(async (ids) => {
    // pretty much same code we had,
    // except now it is more generic/reusable
    let referencingEntries = await space.getEntries({
      content_type: contentType,
      [`fields.${field}.sys.id[in]`]: cityIds,
    })

    let groupedEntries = _.groupBy(
      referencingEntries,
      (offer) => offer.fields[field].sys.id
    )

    return ids.map((id) => groupedEntries[id] ?? [])
  })
```

And now we can use our loader:

```js
let cityIds = [1, 2, 3, ...hundredMore]

let offerToCityLinksLoader = createLinksLoader('offer', 'city')

let citiesWithLinks = await Promise.all(
  cityIds.map((id) => offerToCityLinksLoader.load(id))
)
```

Neat, isn't it? Now we have a performant, reusable links loader and even more:

- _DataLoader_ also deduplicate and cache calls;
- with a help of `maxBatchSize` option, we can prevent hitting the limit for number of returned entries I mentioned above;

Hope you enjoyed the article!
