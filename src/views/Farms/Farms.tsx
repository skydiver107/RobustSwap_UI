import React, { useEffect, useCallback, useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { useMedia } from 'react-use'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import Cookies from 'js-cookie'
import { Heading, Text } from '@robustswap-libs/uikit'
import styled from 'styled-components'
import { BLOCKS_PER_YEAR } from 'config'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useFarms, usePriceRbsBusd, usePriceBnbBusd, usePriceRbtBusd /* usePriceEthBusd, usePriceUsdcBusd, usePriceUsdtBusd */ } from 'state/hooks'
import useGetDocumentTitlePrice from 'hooks/useGetDocumentTitlePrice'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import { QuoteToken } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import FarmList from './components/FarmList/FarmList'
import FarmTabButtons from './components/FarmTabButtons'

export interface FarmsProps {
  tokenMode?: boolean
}

const Hero = styled.div<{ isMobile: boolean, tokenMode: boolean }>`
  background-image: ${({ tokenMode, isMobile }) => !tokenMode ?
    (isMobile ? "url('/images/farms/farms-header-bg-mobile.png')" : "url('/images/farms/farms-header-bg.png')") :
    (isMobile ? "url('/images/farms/pools-header-bg-mobile.png')" : "url('/images/farms/pools-header-bg.png')")};
  background-size: cover;
  background-repeat: no-repeat;
  margin-bottom: 44px;
  margin-top: ${({ isMobile }) => isMobile ? "-15px" : "0px"};
  height: ${({ isMobile }) => isMobile ? "240px" : "320px"};

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 0;
    padding-bottom: 0;
  }
`
const StyledHeading = styled(Heading) <{ isMobile: boolean }>`
  font-weight: 600;
  font-size: 34px;
  line-height: 40px;
  letter-spacing: -0.5px;
  color: #FCFCFC;
  margin-left: ${({ isMobile }) => isMobile ? "24px" : "80px"};
  margin-top: 36px;
`
const PubTitle = styled(Text) <{ isMobile: boolean }>`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  color: #FCFCFC;
  max-width: ${({ isMobile }) => isMobile ? "327px" : "538px"};
  margin-left: ${({ isMobile }) => isMobile ? "24px" : "80px"};
  margin-top: 16px;
`
const LogTitle = styled(Text)`
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
  color: #FCFCFC;
`
const LogPrice = styled(Text)`
  fontWeight: 300; 
  fontSize: 16px;
  line-height: 24px;
  color: #FCFCFC;
  margin-right: 16px;
`
const FarmBanner = styled.div<{ isMobile: boolean }>`
  background-image: ${({ isMobile }) => isMobile ? "url('/images/farms/farms-banner-bg.png')" : "url('/images/farms/farms-banner-bg.png')"};
  background-size: cover;
  background-repeat: no-repeat;
  width: 320px !important;
  height: 152px;
  margin-top: 30px;
  margin-right: 80px;
  padding: 34px 86px 34px 25px;
`
const FarmBanner1 = styled.div<{ isMobile: boolean }>`
  background-image: ${({ isMobile }) => isMobile ? "url('/images/farms/pools-banner-bg.png')" : "url('/images/farms/pools-banner-bg.png')"};
  background-size: cover;
  background-repeat: no-repeat;
  width: 320px !important;
  height: 152px;
  margin-top: 30px;
  margin-right: 80px;
  padding: 48px 96px 48px 25px;
`
const BannerText = styled.text`
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 28px;
`

const Farms: React.FC<FarmsProps> = (farmsProps) => {
  const { path } = useRouteMatch()
  const isMobile = useMedia('(max-width: 768px)')
  const TranslateString = useI18n()
  let farmsLP = useFarms()
  farmsLP = farmsLP.filter((farm) => farm.pid !== 100)
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState(1)
  const { account, library } = useActiveWeb3React()
  const rbsPrice = usePriceRbsBusd()
  let bnbPrice = usePriceBnbBusd()
  // const ethPrice = usePriceEthBusd()
  // const usdcPrice = usePriceUsdcBusd()
  // const usdtPrice = usePriceUsdtBusd()
  const rbtPrice = usePriceRbtBusd().toFixed(2)
  const { tokenMode } = farmsProps
  useGetDocumentTitlePrice(!tokenMode ? 'Farms' : 'Pools')

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const [stakedOnly, setStakedOnly] = useState(false)
  const [viewMode, setViewMode] = useState(isMobile ? isMobile : Cookies.get('viewMode') ? Cookies.get('viewMode') === 'true' : !isMobile)

  const sortByMultiplier = (item1, item2) => {
    return item2.multiplier.replace('X', '') - item1.multiplier.replace('X', '');
  }
  const sortByAPR = (item1, item2) => {
    return item2.apy - item1.apy
  }
  const sortByLiquidity = (item1, item2) => {
    return item2.lpTotalInQuoteToken - item1.lpTotalInQuoteToken
  }
  const sortByEarned = (item1, item2) => {
    return item2.userData.earnings - item1.userData.earnings
  }
  // activeFarms.sort(sortByMultiplier);
  let activeFarms = farmsLP.filter((farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier !== '0X')
  if (filter !== '') {
    activeFarms = activeFarms.filter((farm) => farm.lpSymbol.indexOf(filter.toUpperCase()) !== -1)
  }
  let inactiveFarms = farmsLP.filter((farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier === '0X')
  if (filter !== '') {
    inactiveFarms = inactiveFarms.filter((farm) => farm.lpSymbol.indexOf(filter.toUpperCase()) !== -1)
  }
  let stakedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )
  if (filter !== '') {
    stakedOnlyFarms = stakedOnlyFarms.filter((farm) => farm.lpSymbol.indexOf(filter.toUpperCase()) !== -1)
  }

  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      // const cakePriceVsBNB = new BigNumber(farmsLP.find((farm) => farm.pid === CAKE_POOL_PID)?.tokenPriceVsQuote || 0)
      const farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        // if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
        //   return farm
        // }
        const rbsRewardPerBlock = new BigNumber(farm.rbsPerBlock || 1)
          .times(new BigNumber(farm.poolWeight))
          .div(new BigNumber(10).pow(18))

        const rbsRewardPerYear = rbsRewardPerBlock.times(BLOCKS_PER_YEAR)
        let apy = rbsPrice.times(rbsRewardPerYear)
        let totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0)

        if (farm.quoteTokenSymbol === QuoteToken.BNB) {
          totalValue = totalValue.times(bnbPrice)
        }

        // if (farm.quoteTokenSymbol === QuoteToken.ETH) {
        //   totalValue = totalValue.times(ethPrice)
        // }

        // if (farm.quoteTokenSymbol === QuoteToken.USDC) {
        //   totalValue = totalValue.times(usdcPrice)
        // }

        // if (farm.quoteTokenSymbol === QuoteToken.USDT) {
        //   totalValue = totalValue.times(usdtPrice)
        // }

        if (totalValue.comparedTo(0) > 0) {
          apy = apy.div(totalValue)
        }
        else apy = apy.div(100000000)  // exception when staking is 0
        return { ...farm, apy }
      })

      if (sort === 1) {
        // farmsToDisplayWithAPY.sort()
      } else if (sort === 2) {
        farmsToDisplayWithAPY.sort(sortByMultiplier)
      } else if (sort === 3) {
        farmsToDisplayWithAPY.sort(sortByAPR)
      } else if (sort === 4) {
        farmsToDisplayWithAPY.sort(sortByLiquidity)
      } else if (sort === 5) {
        farmsToDisplayWithAPY.sort(sortByEarned)
      }
      if (viewMode) {
        return farmsToDisplayWithAPY.map((farm) => (
          <FarmCard
            key={farm.pid}
            farm={farm}
            removed={removed}
            bnbPrice={bnbPrice}
            rbsPrice={rbsPrice}
            // usdcPrice={usdcPrice}
            // usdtPrice={usdtPrice}
            // ethPrice={ethPrice}
            ethereum={library}
            account={account}
            isMobile={false}
          />
        ))
      } else {
        return farmsToDisplayWithAPY.map((farm) => (
          <FarmList
            key={farm.pid}
            farm={farm}
            removed={removed}
            bnbPrice={bnbPrice}
            rbsPrice={rbsPrice}
            // ethPrice={ethPrice}
            // usdcPrice={usdcPrice}
            // usdtPrice={usdtPrice}
            ethereum={library}
            account={account}
            isMobile={isMobile}
            tokenMode={tokenMode}
          />
        ))
      }
    },
    [bnbPrice, account, rbsPrice, library, sort, viewMode, isMobile, tokenMode],
  )
  return (
    <>
      <Hero isMobile={isMobile} tokenMode={tokenMode}>
        {!isMobile && <div style={{ display: 'flex', alignItems: 'center', padding: '18px 48px 16px 40px' }}>
          <div>
            <LogTitle>
              RBS
            </LogTitle>
            <LogPrice>
              ${rbsPrice.toFixed(2)}
            </LogPrice>
          </div>
          <div style={{ height: '38px', borderRight: '1px solid #E2E9EF', display: 'block' }}>
          </div>
          <div style={{ marginLeft: 16 }}>
            <LogTitle>
              RBT
            </LogTitle>
            <LogPrice>
              ${rbtPrice}
            </LogPrice>
          </div>
        </div>}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'block' }}>
            <StyledHeading isMobile={isMobile}>
              {tokenMode
                ? TranslateString(676, 'Pools')
                : TranslateString(674, 'Farms')}
            </StyledHeading>
            <PubTitle isMobile={isMobile}>
              {tokenMode ?
                TranslateString(730, 'Looking for competitive rewards, low-risk, and no impermanent-loss farming alternative? Stake your RBS and other tokens below to earn more RBS.') :
                TranslateString(729, 'ROBUSTSWAP Farms offer multiple farming opportunities and high rewards to you. Get rewarded by staking your LP tokens.')
              }
            </PubTitle>
          </div>
          {!isMobile && <div>
            {tokenMode ?
              <>
                <FarmBanner1 isMobile={isMobile}>
                  <div style={{ display: 'flex' }}>
                    <BannerText>{TranslateString(737, 'High APR,')}</BannerText>
                  </div>
                  <BannerText>{TranslateString(738, 'low risk earning.')}</BannerText>
                </FarmBanner1>
              </>
              :
              <>
                <FarmBanner isMobile={isMobile}>
                  <div style={{ display: 'flex' }}>
                    <BannerText>{TranslateString(734, 'Enjoy')}</BannerText>&nbsp;
                    <BannerText style={{ color: '#D6EE47' }}>{TranslateString(735, 'FREE')}</BannerText>
                  </div>
                  <BannerText>{TranslateString(736, 'deposit with our featured farms.')}</BannerText>
                </FarmBanner>
              </>
            }
          </div>}
        </div>
      </Hero>
      <Page>
        <FarmTabButtons stakedOnly={stakedOnly} setStakedOnly={setStakedOnly} viewMode={viewMode} setViewMode={setViewMode} filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} isMobile={isMobile} />
        <div>
          <FlexLayout isMobile={isMobile}>
            <Route exact path={`${path}`}>
              {stakedOnly ? farmsList(stakedOnlyFarms, false) : farmsList(activeFarms, false)}
            </Route>
            <Route exact path={`${path}/history`}>
              {farmsList(inactiveFarms, true)}
            </Route>
          </FlexLayout>
        </div>
      </Page>
    </>
  )
}

export default Farms
