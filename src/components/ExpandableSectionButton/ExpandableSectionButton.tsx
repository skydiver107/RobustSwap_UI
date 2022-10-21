import React from 'react'
import styled from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon, Text } from '@robustswap-libs/uikit'
import useI18n from 'hooks/useI18n'

export interface ExpandableSectionButtonProps {
  onClick?: () => void
  expanded?: boolean
  viewMode?: number
  isMobile?: boolean
  marginBottom?: string
}

const Wrapper = styled.div<{ viewMode: number }>`
  display: ${({ viewMode }) => viewMode === 1 ? 'flex' : 'flex'};
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    fill: ${({ theme }) => theme.colors.primary};
  }
`

const ExpandableSectionButton: React.FC<ExpandableSectionButtonProps> = ({ onClick, expanded, viewMode, isMobile, marginBottom }) => {
  const TranslateString = useI18n()
  return (
    <Wrapper aria-label="Hide or show expandable content" role="button" onClick={() => onClick()} viewMode={viewMode} style={{ marginBottom: marginBottom }}>
      {!isMobile && <Text style={{ color: '#A5A5A5', fontSize: 12, marginLeft: 12 }}>
        {expanded ? TranslateString(725, 'Hide') : TranslateString(658, 'Details')}
      </Text>}
      {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
    </Wrapper>
  )
}

ExpandableSectionButton.defaultProps = {
  expanded: false,
}

export default ExpandableSectionButton
