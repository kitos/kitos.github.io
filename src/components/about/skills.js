import React, { useState } from 'react'
import { Link } from 'gatsby'
import { Box, Flex } from '@rebass/grid'
import { animated, Trail } from 'react-spring'

import { Badge } from '../badge'
import { UnstyledButton } from '../button'
import { isMobile } from '../../utils'
import { Tooltip } from '../tooltip'
import useOuterClickHandler from '../outer-click-hook'

const MAX_SKILLS_TO_DISPLAY = isMobile ? 10 : 20

let AnimatedButton = animated(UnstyledButton)

let SkillBadge = ({ children, ...rest }) => (
  <Box as={AnimatedButton} mr="5px" mb="5px" {...rest}>
    <Badge style={{ display: 'block' }}>{children}</Badge>
  </Box>
)

let TooltipContent = ({ skill }) => (
  <>
    {skill.projects && (
      <>
        <b>Projects</b>

        <ul>
          {skill.projects.map(({ fields, name }) => (
            <li key={fields.slug}>
              <Link to={`/portfolio/#${fields.slug}`}>{name}</Link>
            </li>
          ))}
        </ul>
      </>
    )}

    {skill.talks && (
      <>
        <b>Talks</b>

        <ul>
          {skill.talks.map(({ fields, title }) => (
            <li key={fields.slug}>
              <Link to={`/public-activity/#${fields.slug}`}>{title}</Link>
            </li>
          ))}
        </ul>
      </>
    )}
  </>
)

let Skills = ({ skills }) => {
  let [areSkillsExpanded, toggleSkills] = useState(false)

  let [tooltip, setTooltip] = useState({ isOpen: false })
  useOuterClickHandler(
    () => setTooltip({ ...tooltip, isOpen: false }),
    '.tooltip',
    [tooltip]
  )

  return (
    <Flex flexWrap="wrap" style={{ perspective: 500 }}>
      <Trail
        native
        force
        config={{ tension: 2000, friction: 100 }}
        items={
          areSkillsExpanded ? skills : skills.slice(0, MAX_SKILLS_TO_DISPLAY)
        }
        keys={item => item.name}
        from={{ transform: 'rotateX(-90deg)', opacity: 0 }}
        to={{ transform: 'rotateX(0)', opacity: 1 }}
      >
        {skill => style => (
          <SkillBadge
            style={style}
            title="Show legend"
            onClick={e => setTooltip({ ref: e.target, skill, isOpen: true })}
          >
            {skill.name} <b>|</b>{' '}
            <span title="Mentioned in portfolio and public activities.">
              {skill.mentions}
            </span>
          </SkillBadge>
        )}
      </Trail>

      <SkillBadge
        title={areSkillsExpanded ? 'Show less' : 'Show more'}
        onClick={() => toggleSkills(!areSkillsExpanded)}
      >
        {areSkillsExpanded ? '..' : '...'}
      </SkillBadge>

      <Tooltip
        isOpen={tooltip.isOpen}
        referenceElement={tooltip.ref}
        className="tooltip"
      >
        {tooltip.skill !== undefined && (
          <TooltipContent skill={tooltip.skill} />
        )}
      </Tooltip>
    </Flex>
  )
}

export default Skills
export { Skills }
