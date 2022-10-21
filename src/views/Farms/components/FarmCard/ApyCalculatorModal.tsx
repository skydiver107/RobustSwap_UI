import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Button, Modal, Text, Link, Flex } from '@robustswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { calculateCakeEarnedPerThousandDollars, apyModalRoi } from 'utils/compoundApyHelpers'
import { Address } from 'config/constants/types'

interface ApyCalculatorModalProps {
  onDismiss?: () => void
  lpLabel?: string
  rbsPrice?: BigNumber
  apy?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  quoteTokenAdresses?: Address
  quoteTokenSymbol?: string
  tokenAddresses: Address
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, auto);
  margin-bottom: 24px;
`

const GridItem = styled.div`
  margin-bottom: '10px';
  text-align: right;
`

const Description = styled(Text)`
  margin-bottom: 28px;
  width: 100%;
  max-width: 400px;
  color: #F0EFEF;
`
const StyledLink = styled(Link)`
  color: white;
`

const ApyCalculatorModal: React.FC<ApyCalculatorModalProps> = ({
  onDismiss,
  lpLabel,
  quoteTokenAdresses,
  lpTotalInQuoteToken,
  quoteTokenSymbol,
  tokenAddresses,
  rbsPrice,
  apy,
}) => {
  const TranslateString = useI18n()
  const chainId = process.env.REACT_APP_CHAIN_ID
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses })
  const swapUrlPathParts = `?outputCurrency=${tokenAddresses[chainId]}`
  const farmApy = apy.times(new BigNumber(100)).toNumber()
  const oneThousandDollarsWorthOfCake = 1000 / rbsPrice.toNumber()
  const getUrl = lpLabel.includes('-') ?
    `https://exchange.robustswap.com/#/add/${liquidityUrlPathParts}` :
    `https://exchange.robustswap.com/#/swap${swapUrlPathParts}`

  const cakeEarnedPerThousand1D = calculateCakeEarnedPerThousandDollars({ numberOfDays: 1, farmApy, rbsPrice, lpTotalInQuoteToken })
  const cakeEarnedPerThousand7D = calculateCakeEarnedPerThousandDollars({ numberOfDays: 7, farmApy, rbsPrice, lpTotalInQuoteToken })
  const cakeEarnedPerThousand30D = calculateCakeEarnedPerThousandDollars({ numberOfDays: 30, farmApy, rbsPrice, lpTotalInQuoteToken })
  const cakeEarnedPerThousand365D = calculateCakeEarnedPerThousandDollars({ numberOfDays: 365, farmApy, rbsPrice, lpTotalInQuoteToken })

  return (
    <Modal title="ROI" onDismiss={onDismiss}>
      <Grid>
        <GridItem style={{ textAlign: 'left' }}>
          <Text fontSize="14px" bold color="secondary" textTransform="uppercase" mb="20px">
            {TranslateString(323, 'Timeframe')}
          </Text>
        </GridItem>
        <GridItem style={{ paddingRight: 32 }}>
          <Text fontSize="14px" bold color="secondary" textTransform="uppercase" mb="20px">
            {TranslateString(324, 'ROI')}
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="14px" bold color="secondary" textTransform="uppercase" mb="20px">
            {TranslateString(325, 'RBS per')} $1000
          </Text>
        </GridItem>
        {/* 1 day row */}
        <GridItem style={{ textAlign: 'left' }}>
          <Text fontSize="20px" bold>1d</Text>
        </GridItem>
        <GridItem style={{ paddingRight: 32 }}>
          <Text fontSize="20px" bold>
            {apyModalRoi({ amountEarned: cakeEarnedPerThousand1D, amountInvested: oneThousandDollarsWorthOfCake })}%
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="20px" bold>{cakeEarnedPerThousand1D}</Text>
        </GridItem>
        {/* 7 day row */}
        <GridItem style={{ textAlign: 'left' }}>
          <Text fontSize="20px" bold>7d</Text>
        </GridItem>
        <GridItem style={{ paddingRight: 32 }}>
          <Text fontSize="20px" bold>
            {apyModalRoi({ amountEarned: cakeEarnedPerThousand7D, amountInvested: oneThousandDollarsWorthOfCake })}%
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="20px" bold>{cakeEarnedPerThousand7D}</Text>
        </GridItem>
        {/* 30 day row */}
        <GridItem style={{ textAlign: 'left' }}>
          <Text fontSize="20px" bold>30d</Text>
        </GridItem>
        <GridItem style={{ paddingRight: 32 }}>
          <Text fontSize="20px" bold>
            {apyModalRoi({ amountEarned: cakeEarnedPerThousand30D, amountInvested: oneThousandDollarsWorthOfCake })}%
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="20px" bold>{cakeEarnedPerThousand30D}</Text>
        </GridItem>
        {/* 365 day / APY row */}
        <GridItem style={{ textAlign: 'left' }}>
          <Text fontSize="20px" bold>365d</Text>
        </GridItem>
        <GridItem style={{ paddingRight: 32 }}>
          <Text fontSize="20px" bold>
            {apyModalRoi({ amountEarned: cakeEarnedPerThousand365D, amountInvested: oneThousandDollarsWorthOfCake })}%
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="20px" bold>{cakeEarnedPerThousand365D}</Text>
        </GridItem>
      </Grid>
      <Description fontSize="16px">
        {TranslateString(
          319,
          'Rates are estimates provided for your convenience only, and by no means represent guaranteed returns.',
        )}
      </Description>
      <Flex justifyContent="center">
        <Button variant="subtle" as="a" href={getUrl} style={{ width: '100%' }}>
          {TranslateString(505, 'Get')} {lpLabel}
        </Button>
      </Flex>
    </Modal>
  )
}

export default ApyCalculatorModal
