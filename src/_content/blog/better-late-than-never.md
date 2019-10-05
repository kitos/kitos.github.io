---
slug: better-late-than-never
lang: en
title: Better late than never
date: 2019-01-10T22:20:34.479Z
thumbnail: /images/uploads/clock.jpg
tags:
  - gatsbyjs
  - reactjs
  - success_story
preface: "I have been thinking about developing my personal blog for a least 5 years already. Finally I have enough experience and comfortable toolchain. Here is my first try to post something here ✨\U0001F973\U0001F389"
---
## First steps

First time I thought about creating personal site was when I was taking java courses at EPAM Systems. The main motivation was to learn new things. So I've created a list of technologies I wanted to build my blog with:

![List of technologies](/images/uploads/blog-tech-stack.jpg "Technologies")

At that moment I haven't worked with either of them (except MySQL I guess) and hardly understood how I could wire them all together. Also you might noticed that I didn't write a word about infrastructure and deployment of my future site (I had no idea about it).

Time went on, I got a job, started to get familiar with technologies from my list: we actively used Liquibase on my first project; I figured out that I can use fancy groovy and gradle instead of xml and maven to write build scripts; but the main frontend library was jQuery, and it was clear that I wouldn't like to use it in personal project. In a year I joined project with AngularJS, one more year later I had realized that I would not use either :-)

## Getting closer to right stack

Meanwhile react was getting more and more popular. And I decided to give it a try: colleagues of mine and I started local frontend community - WebPurple and to be true frontend community it must have its own site. Its first version has under the hood: react, redux,material-ui, koa, mongoose and was deployed to some VPS. I've learned a couple of things:

* Material Design fits tools best (not sites)
* managing content manually is bad idea
* IaaS is overkill (also painful) as well as PaaS (after a couple of months fighting with manual setup of all infrastructure to VM I've moved to heroku and mlab) for promo site
* I don't want to pay for hosting (or a at least it to be cheap)
* I want WebPurple site to be BLAZING fast (without much effort)

## Love at second sight

Any ideas on what I am gonna talking about? Static site generation, JAMStack, GastbyJS! In early 2018, I began to hear more and more about Gatsby. I don't know why didn't pay much attention to it when I first time heard about it (I might thought it is not applicable for my cases). But after I started to investigate the approach (JAMStack) it offers I had fallen in love 😍. It took me about 2 weeks to migrate the whole (thought it is not that big) site from koa, mongodb and heroku to gatsby, netlify-cms and netlify.

* ⚡️site had perfect performance by default
  * static markup (first load)
  * code splitting
  * image optimization
  * prefetch...
* 💃content is easily managed via CMS
  * user friendly UI
  * extensible (build on react)
  * content stored alongside your code (in git repo!)...
* 🙈infrastructure is the simplest (ADN aka better CDN)
  * CD - deploy on every git push
  * automatic PR preview
  * https, custom domains, AWS lambdas...

You can checkout the result - www.webpurple.net (source). I've even given a talk (russian) about it.

Later I've applied gatsby for one of my customers news site, but with a bit different setup: strapi as a CMS and Jenkins as a CD tool.

## Happy end

Finally I felt like I've found best toolchain and it was time to get my hands on personal site. Since I fill pretty comfortable with technical stack (although this time I use contentful as CMS, travis as CI/CD and github pages as a hosting), my motivation is less about learning new things and more about improving my english (via writing articles about amazing things I deal with) and a bit of showing off 🤓. I hope you enjoy the site (its unique design 😇). And you started to think about building your one (using great gatsby of course). Keep in mind that gatsby is suitable not only for blogs or promo-sites, it can make any of your sites performant (even for e-commerce project).

### P.S.

By the way I've started to develop my site before it had become mainstream 😂.
