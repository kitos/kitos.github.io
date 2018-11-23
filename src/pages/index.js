import React from 'react'

import Layout from '../components/layout'
import Avatar from '../components/avatar'

const IndexPage = () => (
  <Layout>
    <div style={{ maxWidth: 200, margin: 'auto' }}>
      <Avatar />
    </div>

    <h1>Nikita Kirsanov</h1>

    <h2>Social links</h2>

    <ul>
      <li>
        <a
          href="https://twitter.com/kitos_kirsanov"
          target="_blank"
          rel="noreferrer noopener"
        >
          Twitter
        </a>
      </li>

      <li>
        <a
          href="https://github.com/kitos"
          target="_blank"
          rel="noreferrer noopener"
        >
          GitHub
        </a>
      </li>

      <li>
        <a
          href="https://www.linkedin.com/in/%D0%BD%D0%B8%D0%BA%D0%B8%D1%82%D0%B0-%D0%BA%D0%B8%D1%80%D1%81%D0%B0%D0%BD%D0%BE%D0%B2-08b307b9/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Linkedin
        </a>
      </li>
    </ul>

    <h2>About me</h2>

    <p>
      I have 5 years of experience as a software engineer. During this time I
      had a chance to take part in many aspects of enterprise software
      development:
    </p>

    <ul>
      <li>
        I was a lead/key developer in several big (50+ members, mostly teams
        were distributed by different locations) projects: I communicated with a
        customer, participated in tasks estimation, chose technology stack,
        designed architecture solutions, wrote code, led team of 4-6 members,
        conducted code reviews...
      </li>

      <li>
        For 2 years I've been a trainer of front-end lab, also I've taken part
        in several educational programs (react, angular 2) as a mentor / lector
      </li>

      <li>
        I conduct technical interviews with people applying for front-end
        positions in different locations (Russia, China, Mexico, Romania,
        England...) and participate as an expert in assessments
      </li>

      <li>
        I had several public talks both in local front-end community and company
        open events (IT days, IT week...)
      </li>
    </ul>

    <p>
      All these activities gave me good technical background, understanding of
      software development processes and communication skills: I worked with
      JavaScript (ES5/ES6), TypeScript, CSS/HTML... frameworks and libraries
      like angular, react, redux/flux..., nodejs (express, koa...), build tools
      - webpack...; I know what CI/CD is, used different branching strategies,
      worked with a few development methodologies (prefer scrum), understand how
      testing is important and what kind of testing we can implement.
    </p>
  </Layout>
)

export default IndexPage
