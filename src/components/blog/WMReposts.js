import * as React from 'react'
import { useState } from 'react'
import { Box, Flex } from '@rebass/grid'
import { Menu, MenuButton, MenuLink, MenuList } from '@reach/menu-button'
import '@reach/menu-button/styles.css'

import Dialog from '../dialog'
import { WMAuthorList } from './WMAuthorList'
import { Stack } from '../Stack'
import { IconButton } from '../IconButton'
import { RepostIcon } from '../icons/repost-icon'

export let WMReposts = ({ tweetId, items }) => {
  let [isDialogOpen, setIsOpen] = useState(false)
  let hasReposts = items.length > 0
  let hasTweet = tweetId != null

  if (!hasReposts && !hasTweet) {
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
                icon={<RepostIcon fill={isExpanded ? '#59BB6D' : undefined} />}
                hoverBackground={'#E6F2EC'}
              >
                Repost
              </IconButton>

              <Box as={MenuList} py={2} style={{ borderRadius: 3 }}>
                <MenuLink
                  href={`https://twitter.com/intent/retweet?tweet_id=${tweetId}`}
                  target="_blank"
                >
                  via Twitter
                </MenuLink>
              </Box>
            </>
          )}
        </Menu>

        {hasReposts && (
          <Box
            as="a"
            ml={2}
            href="#reposts"
            onClick={(e) => {
              e.preventDefault()
              setIsOpen(true)
            }}
          >
            {items.length} reposts
          </Box>
        )}
      </Flex>

      {hasReposts && (
        <Dialog
          title="Reposted by"
          isOpen={isDialogOpen}
          onDismiss={() => setIsOpen(false)}
        >
          <WMAuthorList authors={items.map(({ author }) => author)} />
        </Dialog>
      )}
    </>
  )
}
