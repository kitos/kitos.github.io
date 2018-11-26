import React from 'react'
import { cold } from 'react-hot-loader'
import { useRotation } from './rotation-hook'
import { scale } from '../utils/typography'
import { Box, Flex } from '@rebass/grid'
import Badge from './badge'

let VideoCard = ({ video: { id, snippet }, className }) => {
  let rotation = useRotation()
  let link = `https://www.youtube.com/watch?v=${id}`

  return (
    <section className={className}>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <img
          {...rotation}
          src={snippet.thumbnails.medium.url}
          alt={snippet.title}
        />
      </a>

      <h3 style={scale(0.1)}>
        <a href={link}>{snippet.title}</a>
      </h3>

      {snippet.tags && (
        <Flex as="ul" flexWrap="wrap" mx="-5px" css={{ listStyle: 'none' }}>
          {snippet.tags.map(t => (
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
