import * as React from 'react'

export let WMAuthorList = ({ authors }) => (
  <ul
    css={`
      margin: 0 0 0 10px;
      list-style: none;
      display: flex;
      flex-wrap: wrap;
    `}
  >
    {authors.map(({ name, photo, url }) => (
      <li key={name} style={{ marginLeft: -10 }}>
        <a href={url} target="_blank" rel="noopener">
          <img
            loading="lazy"
            src={photo}
            title={name}
            alt={name}
            css={`
              width: 45px;
              height: 45px;
              border-radius: 50%;
              border: 2px solid #fff;
              transition: border 100ms, transform 200ms;

              &:hover {
                border: 4px solid #44a3e6;
                transform: scale(1.2);
              }
            `}
          />
        </a>
      </li>
    ))}
  </ul>
)
