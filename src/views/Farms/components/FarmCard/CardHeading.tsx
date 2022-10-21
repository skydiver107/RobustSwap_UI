import React from 'react'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { Flex, Heading, Image, Text } from '@robustswap-libs/uikit'
import { auto } from '@popperjs/core'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  depositFee?: number
  primaryToken?: string
  secondToken?: string
  tokenSymbol?: string
  bscScanAddress?: string
  pairinfo?: string
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 0.25rem;
  }
  align-items: center;
  margin-top:auto;
  margin-bottom:auto;
`

const CardHeading: React.FC<ExpandableSectionProps> = ({ lpLabel, depositFee, primaryToken, secondToken, tokenSymbol, bscScanAddress, pairinfo }) => {
  const TranslateString = useI18n()
  const statusImage = `/images/farms/no-fees.svg`

  return (
    <Wrapper justifyContent="flex-start" style={{ marginBottom: 24 }}>
      <div style={{ width: 40, height: 40 }}>
        {secondToken !== '' && <Image
          src={`/images/farms/${secondToken === 'WBNB' ? 'BNB' : secondToken}.svg`}
          alt={secondToken}
          width={24}
          height={24} />}
        <Image
          src={`/images/farms/${primaryToken === 'WBNB' ? 'BNB' : primaryToken}.svg`}
          alt={primaryToken}
          width={secondToken === '' ? 40 : 32}
          height={secondToken === '' ? 40 : 32}
          marginLeft={secondToken ? "8px" : "0px"}
          marginTop={secondToken ? "-12px" : "0px"} />
      </div>
      <div style={{ textAlign: 'left', paddingLeft: 8, width: '100%' }}>
        <Heading>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: 170, marginTop: auto, marginBottom: auto }}>
              {lpLabel.replace('LP', '')}
              {lpLabel.indexOf('-') === -1 && <Text style={{ fontSize: 12 }}>{TranslateString(509, "Earn RBS")}</Text>}
            </div>
            {(tokenSymbol === 'RBS' || tokenSymbol==='RBT') && <Image src={statusImage} alt={tokenSymbol} width={64} height={30} />}
          </div>
        </Heading>
        {/* <Flex justifyContent="flex-start">
          <StyledLinkExternal
            href={bscScanAddress}
          >
            {TranslateString(356, 'View Contract')}
          </StyledLinkExternal>
          <StyledLinkExternal
            href={pairinfo}
          >
            {TranslateString(355, 'Pair Info')}
          </StyledLinkExternal>
        </Flex> */}
      </div>
    </Wrapper>
  )
}

export default CardHeading
