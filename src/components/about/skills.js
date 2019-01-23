import React, { useState } from 'react'
import { Box, Flex } from '@rebass/grid'

import { Badge } from '../badge'
import { UnstyledButton } from '../button'
import { isMobile } from '../../utils'

const MAX_SKILLS_TO_DISPLAY = isMobile ? 10 : 20

let SkillBadge = ({ children, ...rest }) => (
  <Box as={Badge} mr="5px" mb="5px" {...rest}>
    {children}
  </Box>
)

let Skills = ({ skills }) => {
  let [expandSkills, toggleSkills] = useState(false)

  return (
    <Flex flexWrap="wrap">
      {(expandSkills ? skills : skills.slice(0, MAX_SKILLS_TO_DISPLAY)).map(
        ({ name, mentions }) => (
          <SkillBadge key={name}>
            {name} <b>|</b>{' '}
            <span title="Mentioned in portfolio and public activities.">
              {mentions}
            </span>
          </SkillBadge>
        )
      )}

      <UnstyledButton onClick={() => toggleSkills(!expandSkills)}>
        <SkillBadge
          title={expandSkills ? 'Show less' : 'Show more'}
          style={{ display: 'block' }}
        >
          {expandSkills ? '..' : '...'}
        </SkillBadge>
      </UnstyledButton>
    </Flex>
  )
}

export default Skills
export { Skills }
