import React from 'react'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { Flex, Heading, Image } from '@robustswap-libs/uikit'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  depositFee?: number
  primaryToken?: string
  secondToken?: string
  tokenSymbol?: string
  bscScanAddress?: string
  pairinfo?: string
  isMobile: boolean
}

const Wrapper = styled(Flex) <{ isMobile: boolean }>`
  svg {
    margin-right: 0.25rem;
  }
  align-items: center;
  flex-grow: 0.2;
  padding: ${({ isMobile }) => isMobile ? '0px 24px' : '0px 0px'}
  border: 1px solid #000;
`

const CardHeading: React.FC<ExpandableSectionProps> = ({ lpLabel, depositFee, primaryToken, secondToken, tokenSymbol, bscScanAddress, pairinfo, isMobile }) => {
  const TranslateString = useI18n()
  const statusImage = `/images/farms/no-fees.svg`

  return (
    <Wrapper justifyContent="flex-start" isMobile={isMobile}>
      {(tokenSymbol === 'RBS' || tokenSymbol === 'RBT') && <Image src={statusImage} alt={tokenSymbol} width={64} height={30} marginRight={16} />}
      <div style={{ width: 40, height: isMobile ? 40 : 44 }}>
        {secondToken !== '' && <Image
          src={`/images/farms/${secondToken === 'WBNB' ? 'BNB' : secondToken}.svg`}
          alt={secondToken}
          width={24}
          height={24} />}
        <Image
          src={`/images/farms/${primaryToken === 'WBNB' ? 'BNB' : primaryToken}.svg`}
          alt={primaryToken}
          width={secondToken === '' ? 40 : 32}
          height={secondToken === '' ? isMobile ? 40 : 44 : 32}
          marginLeft={secondToken ? "8px" : "0px"}
          marginTop={secondToken ? "-12px" : "0px"} />
      </div>
      <div style={{ textAlign: 'left', paddingLeft: 8, width: 165, marginTop: 10 }}>
        <Heading mb="8px" style={{ fontWeight: 800 }}>{lpLabel.replace('LP', '')}</Heading>
      </div>
    </Wrapper>
  )
}

export default CardHeading
