import React from 'react'
import { cold } from 'react-hot-loader'
import styled from 'styled-components'
import { Box, Flex } from '@rebass/grid'

import { scale } from '../utils/typography'
import { useRotation } from './rotation-hook'
import Badge from './badge'
import YouTubePlayButton from './youtube-play-button'

let VideoLink = styled.a`
  display: block;
  position: relative;

  ${YouTubePlayButton} {
    opacity: 0.8;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
`

let Img = styled.img`
  width: 100%;
  object-fit: cover;

  /* trim black space on high youtube thumbnail  */
  @media screen and (min-width: 40em) {
    height: 178px;
  }
`

let unique = arrOfPrimitives => Array.from(new Set(arrOfPrimitives))

let VideoCard = ({
  video: {
    id,
    title,
    url,
    tags,
    snippet: { thumbnails, tags: snippetTags },
  },
  className,
}) => {
  let rotation = useRotation()
  let { medium, high, maxres } = thumbnails

  tags = unique([...(tags || []), ...(snippetTags || [])])

  return (
    <section className={className}>
      <VideoLink
        {...rotation}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Img
          src={medium.url}
          srcSet={`${medium.url}, ${high.url} 1.5x, ${maxres.url} 3x`}
          alt={title}
        />

        <YouTubePlayButton />
      </VideoLink>

      <h3 style={scale(0.1)}>
        <a href={url}>{title}</a>
      </h3>

      {tags.length > 0 && (
        <Flex as="ul" flexWrap="wrap" mx="-5px" css={{ listStyle: 'none' }}>
          {tags.map(t => (
            <Box as="li" key={t} m="5px 2px" fontSize="12px">
              <Badge>#{t}</Badge>
            </Box>
          ))}
        </Flex>
      )}
    </section>
  )
}

cold(VideoCard)

export default VideoCard
