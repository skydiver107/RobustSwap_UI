import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Skeleton, Text } from '@robustswap-libs/uikit'
import { Web3Provider } from '@ethersproject/providers'
// import { communityFarms } from 'config/constants'
import { Farm } from 'state/types'
import useI18n from 'hooks/useI18n'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { QuoteToken } from 'config/constants/types'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'
import QuestionHelper from '../../../../components/QuestionHelper'

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

const RainbowLight = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 8px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const FCard = styled.div`
  align-self: baseline;
  background: #1E215C;
  border-radius: 8px;
  border: 1px solid #3D65CA;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 16px 16px 0px 16px;
  position: relative;
  text-align: center;
  width: 320px !important;
`

const Divider = styled.div`
  background-color: #3D65CA;
  height: 1px;
  margin: 16px auto;
  width: 100%;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
  background: #151745;
  margin: 0px -16px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`

const Block = styled.div`
    text-align: left;
    padding-bottom: 4px;
`

interface FarmCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  rbsPrice?: BigNumber
  bnbPrice?: BigNumber
  ethPrice?: BigNumber
  usdcPrice?: BigNumber
  usdtPrice?: BigNumber
  ethereum?: Web3Provider
  account?: string
  isMobile?: boolean
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, removed, rbsPrice, bnbPrice, ethPrice, usdcPrice, usdtPrice, ethereum, account, isMobile }) => {
  const TranslateString = useI18n()

  const [showExpandableSection, setShowExpandableSection] = useState(false)

  // const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)
  // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  // const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()
  let earningToken = farm.tokenSymbol
  let stakingToken = ""

  if (!farm.isTokenOnly) stakingToken = farm.quoteTokenSymbol

  const totalValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) {
      return null
    }
    if (farm.quoteTokenSymbol === QuoteToken.BNB) {
      return bnbPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.ETH) {
      return ethPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.USDC) {
      return usdcPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.USDT) {
      return usdtPrice.times(farm.lpTotalInQuoteToken)
    }
    return farm.lpTotalInQuoteToken
  }, [bnbPrice, ethPrice, usdcPrice, usdtPrice, farm.lpTotalInQuoteToken, farm.quoteTokenSymbol])

  const totalValueFormated = totalValue && !new BigNumber(totalValue).isNaN()
    ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  const chainId = 56
  const addLiquidityUrl = farm.isTokenOnly
    ? '' : `https://exchange.robustswap.com/#/add/${farm.quoteTokenAdresses[chainId]}/${farm.tokenAddresses[chainId]}`

  const lpLabel = farm.isTokenOnly ? farm.lpSymbol : `${farm.lpSymbol}`
  const exception = (farm.lpTotalInQuoteToken?.toString() === '0')

  const farmAPY =
    farm.apy &&
    farm.apy.times(new BigNumber(exception ? 10000 : 100)).toNumber().toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses } = farm

  // stakedTokenPrice
  const stakedTokenPriceUSD: BigNumber = useMemo(() => {
    let lpTokenPriceVsQuote
    if (farm.isTokenOnly) {
      lpTokenPriceVsQuote = new BigNumber(farm.tokenPriceVsQuote)
    } else {
      lpTokenPriceVsQuote = new BigNumber(farm.quoteTokenBlanceLP).times(2).div(farm.lpTotalSupply)
    }

    if (farm.quoteTokenSymbol === QuoteToken.BNB) {
      return bnbPrice.times(lpTokenPriceVsQuote)
    }
    if (farm.quoteTokenSymbol === QuoteToken.ETH) {
      return ethPrice.times(lpTokenPriceVsQuote)
    }
    if (farm.quoteTokenSymbol === QuoteToken.USDC) {
      return usdcPrice.times(lpTokenPriceVsQuote)
    }
    if (farm.quoteTokenSymbol === QuoteToken.USDT) {
      return usdtPrice.times(lpTokenPriceVsQuote)
    }
    return lpTokenPriceVsQuote
  }, [
    bnbPrice,
    ethPrice,
    usdcPrice,
    usdtPrice,
    farm.tokenPriceVsQuote,
    farm.quoteTokenSymbol,
    farm.quoteTokenBlanceLP,
    farm.lpTotalSupply,
    farm.isTokenOnly,
    // farm.tokenSymbol
  ])

  return (
    <FCard>
      {(farm.tokenSymbol === 'RBS' || farm.tokenSymbol === 'RBT') && <StyledCardAccent />}
      <CardHeading
        lpLabel={lpLabel}
        depositFee={farm.depositFeeBP}
        primaryToken={earningToken}
        secondToken={stakingToken}
        tokenSymbol={farm.tokenSymbol}
        bscScanAddress={
          farm.isTokenOnly
            ? `https://bscscan.com/token/${farm.tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
            : `https://bscscan.com/token/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`
        }
        pairinfo={
          farm.isTokenOnly
            ? `https://pancakeswap.finance/info/token/${farm.tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
            : `https://pancakeswap.finance/info/pool/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`
        }
      />
      {!removed && (
        <Block>
          <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(352, 'APR')}:</Text>
          <Text fontSize="20px" bold style={{ display: 'flex', alignItems: 'center', color: '#E354FA', fontWeight: 800 }}>
            {farm.apy ? (
              <>
                {farmAPY ? farmAPY : 0}%
                <ApyButton
                  lpLabel={lpLabel}
                  quoteTokenAdresses={quoteTokenAdresses}
                  lpTotalInQuoteToken={farm.lpTotalInQuoteToken}
                  quoteTokenSymbol={quoteTokenSymbol}
                  tokenAddresses={tokenAddresses}
                  rbsPrice={rbsPrice}
                  apy={farm.apy}
                />
              </>
            ) : (
              <Skeleton height={24} width={80} />
            )}
          </Text>
        </Block>
      )}
      <Block>
        <Text fontSize="12px" style={{ color: '#A5A5A5' }}>
          {TranslateString(408, 'Total Staked')}:
        </Text>
        <Flex alignItems="center">
          <Text fontSize="20px" style={{ fontWeight: 'bold' }}>{!removed ? totalValueFormated : 0}</Text>
          {lpLabel.indexOf('-') >= 0 ?
            <QuestionHelper text={TranslateString(301, 'Total USD value of funds in this farm’s liquidity pool')} wth={16} hgh={16} mode={0} /> :
            <QuestionHelper text={TranslateString(305, 'Total USD value of funds in this pool')} wth={16} hgh={16} mode={0} />
          }
        </Flex>
      </Block>
      {/* {lpLabel.indexOf('-') >= 0 &&  */}
      <Block>
        <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(457, 'Multiplier')}:</Text>
        <Flex alignItems="center">
          <Text fontSize="20px" style={{ fontWeight: 800, color: '#E354FA' }}>{farm.multiplier}</Text>
          <QuestionHelper text={TranslateString(299, 'The multiplier represents the amount of RBS rewards each farm gets. For example, if a 1x farm was getting 1 RBS per block, a 40x farm would be getting 40 RBS per block.')} wth={16} hgh={16} mode={0} />
        </Flex>
      </Block>
      {/* } */}
      <CardActionsContainer
        farm={farm}
        ethereum={ethereum}
        account={account}
        harvestInterval={farm.harvestInterval}
        stakedTokenPriceUSD={stakedTokenPriceUSD}
        rbsPrice={rbsPrice}
        tokenMode={lpLabel.indexOf('-') >= 0}
        addLiquidityUrl={addLiquidityUrl}
      />
      <Divider />
      <ExpandableSectionButton
        onClick={() => setShowExpandableSection(!showExpandableSection)}
        expanded={showExpandableSection}
        viewMode={1}
        isMobile={isMobile}
        marginBottom="16px"
      />
      <ExpandingWrapper expanded={showExpandableSection}>
        <DetailsSection
          rbsPrice={rbsPrice}
          lpLabel={lpLabel}
          depositFee={farm.depositFeeBP}
          harvestInterval={farm.harvestInterval}
          pid={farm.pid}
          stakedTokenPriceUSD={stakedTokenPriceUSD}
          tokenMode={lpLabel.indexOf('-') >= 0}
          account={account}
          removed={removed}
          bscScanAddress={
            farm.isTokenOnly
              ? `https://bscscan.com/token/${farm.tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
              : `https://bscscan.com/token/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`
          }
          pairinfo={
            farm.isTokenOnly
              ? `https://pancakeswap.finance/info/token/${farm.tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
              : `https://pancakeswap.finance/info/pool/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`
          }
          addLiquidityUrl={addLiquidityUrl}
        />
      </ExpandingWrapper>
    </FCard>
  )
}

export default FarmCard
