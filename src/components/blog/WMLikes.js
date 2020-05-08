import * as React from 'react'
import { useState } from 'react'
import { Box, Flex } from '@rebass/grid'
import { Menu, MenuButton, MenuLink, MenuList } from '@reach/menu-button'
import '@reach/menu-button/styles.css'

import { HeartIcon } from '../icons/heart-icon'
import Dialog from '../dialog'
import { WMAuthorList } from './WMAuthorList'
import { Stack } from '../Stack'
import { IconButton } from '../IconButton'

export let WMLikes = ({ tweetId, items }) => {
  let [isDialogOpen, setIsOpen] = useState(false)
  let hasLikes = items.length > 0
  let hasTweet = tweetId != null

  if (!hasLikes && !hasTweet) {
    return null
  }

  return (
    <>
      <Flex as={Stack} rowGap={1} alignItems="center">
        <Menu>
          {({ isExpanded }) => (
            <>
              <IconButton
                as={MenuButton}
                disabled={!hasTweet}
                icon={
                  <HeartIcon
                    fill={isExpanded ? undefined : '#fff'}
                    stroke={isExpanded ? undefined : 'gray'}
                  />
                }
              >
                Like
              </IconButton>

              <Box as={MenuList} py={2} style={{ borderRadius: 3 }}>
                <MenuLink
                  href={`https://twitter.com/intent/like?tweet_id=${tweetId}`}
                  target="_blank"
                >
                  via Twitter
                </MenuLink>
              </Box>
            </>
          )}
        </Menu>

        {hasLikes && (
          <Box
            as="a"
            ml={2}
            href="#likes"
            onClick={(e) => {
              e.preventDefault()
              setIsOpen(true)
            }}
          >
            {items.length} likes
          </Box>
        )}
      </Flex>

      {hasLikes && (
        <Dialog
          title="Liked by"
          isOpen={isDialogOpen}
          onDismiss={() => setIsOpen(false)}
        >
          <WMAuthorList authors={items.map(({ author }) => author)} />
        </Dialog>
      )}
    </>
  )
}
