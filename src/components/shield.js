import styled from 'styled-components'
import { Flex } from '@rebass/grid'
import React from 'react'

let Label = styled.span`
  background: #555;
  color: #fff;
  padding: 5px 10px;
  font-size: 12px;
`

let Value = styled(Label)`
  background: #a2c63e;
`

export let Shield = ({ label, value }) => (
  <Flex>
    <Label>{label}</Label>
    <Value>{value}</Value>
  </Flex>
)
