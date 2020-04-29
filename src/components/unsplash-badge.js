import React from 'react'

export let UnsplashBadge = ({ link, author }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    title={`Download free do whatever you want high-resolution photos from ${author}`}
    css={`
      background-color: #000;
      color: white;
      text-decoration: none;
      padding: 4px 6px;
      font-size: 12px;
      font-weight: bold;
      line-height: 1.2;
      display: inline-block;
      border-radius: 3px;
    `}
  >
    <span
      css={`
        display: inline-block;
        padding: 2px 3px;
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        css={`
          height: 12px;
          width: auto;
          position: relative;
          vertical-align: middle;
          top: -2px;
          fill: white;
        `}
        viewBox="0 0 32 32"
      >
        <title>unsplash-logo</title>
        <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z" />
      </svg>
    </span>
    <span
      css={`
        display: inline-block;
        padding: 2px 3px;
      `}
    >
      {author}
    </span>
  </a>
)
