import React, { useState } from 'react'
import { Box, Flex } from '@rebass/grid'
import { animated, Trail } from 'react-spring'

import { Badge } from '../badge'
import { UnstyledButton } from '../button'
import { isMobile } from '../../utils'

const MAX_SKILLS_TO_DISPLAY = isMobile ? 10 : 20

let AnimatedBadge = animated(Badge)

let SkillBadge = ({ children, ...rest }) => (
  <Box as={AnimatedBadge} mr="5px" mb="5px" {...rest}>
    {children}
  </Box>
)

let Skills = ({ skills }) => {
  let [expandSkills, toggleSkills] = useState(false)

  return (
    <Flex flexWrap="wrap" style={{ perspective: 500 }}>
      <Trail
        native
        force
        config={{
          tension: 2000,
          friction: 100,
        }}
        items={expandSkills ? skills : skills.slice(0, MAX_SKILLS_TO_DISPLAY)}
        keys={item => item.name}
        from={{ transform: 'rotateX(-90deg)', opacity: 0 }}
        to={{ transform: 'rotateX(0)', opacity: 1 }}
      >
        {({ name, mentions }) => style => (
          <SkillBadge style={style}>
            {name} <b>|</b>{' '}
            <span title="Mentioned in portfolio and public activities.">
              {mentions}
            </span>
          </SkillBadge>
        )}
      </Trail>

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
