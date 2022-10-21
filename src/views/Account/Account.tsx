import React, { useState } from 'react'
import clsx from 'clsx'
import { useMedia } from 'react-use'
import BigNumber from 'bignumber.js/bignumber'
import { getBalanceNumber } from 'utils/formatBalance'
import { getRbsAddress } from 'utils/addressHelpers'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { useWalletModal } from '@robustswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useAuth from 'hooks/useAuth'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useFarms, useTotalValue, usePriceRbsBusd, usePriceBnbBusd /* usePriceEthBusd, usePriceUsdcBusd, usePriceUsdtBusd */ } from 'state/hooks'
import { BLOCKS_PER_YEAR } from 'config'
import { QuoteToken } from 'config/constants/types'
import { useTotalSupply, useBurnedBalance, useMasterChefBalance } from 'hooks/useTokenBalance'
import useAllEarnings from '../../hooks/useAllEarnings'
import useStyles from '../../assets/styles'
import { useTotalLockedUpRewards } from '../../hooks/useFarmsWithBalance'

const Account = () => {
  const classes = useStyles.account()
  const TranslateString = useI18n()
  const isMobile = useMedia('(max-width: 800px)')
  const { login, logout } = useAuth()
  const { account } = useActiveWeb3React()
  const { onPresentConnectModal } = useWalletModal(login, "0px", logout)
  const [activeSwitcher, setActiveSwitcher] = useState(0)
  const [earnings, setEarnings] = useState(0)
  const totalValue = useTotalValue()

  const totalSupply = useTotalSupply()
  const burnedBalance = useBurnedBalance(getRbsAddress())
  const masterChefBalance = useMasterChefBalance(getRbsAddress())
  const totalLocked = useTotalLockedUpRewards()
  const totalLockedIncludeMasterChef = totalLocked.plus(masterChefBalance)
  const circSupply = totalSupply
    ? totalSupply.minus(burnedBalance.plus(totalLockedIncludeMasterChef))
    : new BigNumber(0)
  const cakeSupply = getBalanceNumber(circSupply)
  const allEarnings = useAllEarnings()
  const earningsSum = allEarnings.reduce((accum, earning) => {
    return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)
  const rbsPriceUsd = usePriceRbsBusd()
  const bnbPrice = usePriceBnbBusd()
  // const ethPrice = usePriceEthBusd()
  // const usdcPrice = usePriceUsdcBusd()
  // const usdtPrice = usePriceUsdtBusd()
  const changeSwitcher = (event: any) => {
    let val = event;
    if (typeof val !== 'number') {
      val = val.target.value;
    }
    setActiveSwitcher(val);
    let earningVal = earningsSum / 365
    if (val === 0) {
      earningVal = earningsSum / 365
    } else if (val === 1) {
      earningVal = earningsSum / 52
    } else if (val === 2) {
      earningVal = earningsSum / 12
    } else if (val === 3) {
      earningVal = earningsSum
    }
    setEarnings(earningVal)
  }
  const farmsLP = useFarms()
  const activeFarms = farmsLP.filter((farm) => !!farm.isTokenOnly === true && farm.multiplier !== '0X')
  const pantherWithAPY: any[] = activeFarms.map((farm) => {
    const cakeRewardPerBlock = new BigNumber(farm.rbsPerBlock || 1)
      .times(new BigNumber(farm.poolWeight))
      .div(new BigNumber(10).pow(18))
    const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

    let apy = rbsPriceUsd.times(cakeRewardPerYear)

    let totalValue1 = new BigNumber(farm.lpTotalInQuoteToken || 0)

    if (farm.quoteTokenSymbol === QuoteToken.BNB) {
      totalValue1 = totalValue1.times(bnbPrice)
    }

    // if (farm.quoteTokenSymbol === QuoteToken.ETH) {
    //   totalValue1 = totalValue1.times(ethPrice)
    // }

    // if (farm.quoteTokenSymbol === QuoteToken.USDC) {
    //   totalValue1 = totalValue1.times(usdcPrice)
    // }

    // if (farm.quoteTokenSymbol === QuoteToken.USDT) {
    //   totalValue1 = totalValue1.times(usdtPrice)
    // }

    if (totalValue1.comparedTo(0) > 0) {
      apy = apy.div(totalValue1)
    }
    return { ...farm, apy }
  })
  const farmAPY =
    pantherWithAPY[0].apy &&
    pantherWithAPY[0].apy.times(new BigNumber(100)).toNumber().toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  return (
    <Box className={classes.mainContainer}>
      <Typography className={classes.pageTitle}>Your PANTHER Stats</Typography>
      <Typography className={classes.subPageTitle}>Keep track of your pool & farms.</Typography>
      <Box className={classes.bodyWrapper}>
        {account ? (
          <Card className={classes.cardWrapper1}>
            <Box className={classes.statsValue}>
              <Typography style={{ fontSize: 24, fontWeight: 600, fontFamily: 'Poppin', color: '#7381FC' }}>
                TVL All Pools
              </Typography>
              <Typography style={{ fontSize: 24, fontWeight: 600, fontFamily: 'Poppin', color: '#F0EFEF' }}>
                ${totalValue ? totalValue.toNumber().toLocaleString() : 0}
              </Typography>
            </Box>
            <Box className={classes.statsValue}>
              <Typography style={{ fontSize: 24, fontWeight: 600, fontFamily: 'Poppin', color: '#7381FC' }}>
                PANTHER Holdings
              </Typography>
              <Typography style={{ fontSize: 24, fontWeight: 600, fontFamily: 'Poppin', color: '#F0EFEF' }}>
                {cakeSupply ? cakeSupply.toLocaleString() : 0}
              </Typography>
            </Box>
            <Box
              style={{
                background: '#6BA1FF',
                color: '#FCFCFC',
                borderRadius: 8,
                fontFamily: 'Poppin',
                fontSize: 20,
                fontWeight: 'bold',
                padding: '9px 32px',
                textAlign: 'left',
                marginTop: 8,
              }}
            >
              Earnings
            </Box>
            {!isMobile ? (
              <Box style={{ width: '100%', display: 'flex', justifyContent: 'space-between', paddingTop: 24 }}>
                <Button
                  className={clsx(classes.switchButton, {
                    [classes.activeSwitcher]: activeSwitcher === 0,
                  })}
                  // className={activeSwitcher !== 0 ? classes.switchButton : classes.activeSwitcher}
                  onClick={() => changeSwitcher(0)}
                >
                  Daily
                </Button>
                <Button
                  className={clsx(classes.switchButton, {
                    [classes.activeSwitcher]: activeSwitcher === 1,
                  })}
                  onClick={() => changeSwitcher(1)}
                >
                  Weekly
                </Button>
                <Button
                  className={clsx(classes.switchButton, {
                    [classes.activeSwitcher]: activeSwitcher === 2,
                  })}
                  onClick={() => changeSwitcher(2)}
                >
                  Monthly
                </Button>
                <Button
                  style={{ marginRight: 0 }}
                  className={clsx(classes.switchButton, {
                    [classes.activeSwitcher]: activeSwitcher === 3,
                  })}
                  onClick={() => changeSwitcher(3)}
                >
                  Yearly
                </Button>
              </Box>
            ) : (
              <Box>
                <Select
                  value={activeSwitcher}
                  onChange={changeSwitcher}
                  IconComponent={() => <ArrowDropDownIcon />}
                  style={{
                    width: '100%',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    background: 'rgba(107, 161, 255, 0.2)',
                    marginTop: '24px',
                    borderRadius: 8,
                    fontFamily: 'Poppin',
                  }}
                  disableUnderline
                  MenuProps={{
                    getContentAnchorEl: null,
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                  }}
                >
                  <MenuItem style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} value={0}>
                    <Typography style={{ fontSize: '20px', fontWeight: 500, padding: '0px 16px', fontFamily: 'Poppin' }}>Daily</Typography>
                  </MenuItem>
                  <MenuItem style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} value={1}>
                    <Typography style={{ fontSize: '20px', fontWeight: 500, padding: '0px 16px', fontFamily: 'Poppin' }}>Weekly</Typography>
                  </MenuItem>
                  <MenuItem style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} value={2}>
                    <Typography style={{ fontSize: '20px', fontWeight: 500, padding: '0px 16px', fontFamily: 'Poppin' }}>Monthly</Typography>
                  </MenuItem>
                  <MenuItem style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} value={3}>
                    <Typography style={{ fontSize: '20px', fontWeight: 500, padding: '0px 16px', fontFamily: 'Poppin' }}>Yearly</Typography>
                  </MenuItem>
                </Select>
              </Box>
            )}
            <Box
              style={{ textAlign: 'left', alignItems: 'center', display: 'flex', paddingTop: 16, paddingBottom: 24 }}
            >
              <img src="" alt="" style={{ width: 60, height: 60 }} />
              <Box>
                <Typography style={{ paddingLeft: 16, fontSize: 34, fontWeight: 500, fontFamily: 'Poppin' }}>
                  {earnings ? earnings.toFixed(3) : (earningsSum / 365).toFixed(3)}
                </Typography>
                <Typography style={{ paddingLeft: 16, fontSize: 20, fontWeight: 'bold', fontFamily: 'Poppin' }}>
                  $ {earnings ? (rbsPriceUsd.toNumber() * earnings).toFixed(2) : ((rbsPriceUsd.toNumber() * earningsSum) / 365).toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <Box style={{ textAlign: 'left', paddingTop: 24 }}>
              <Typography style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'Poppin', paddingBottom: 0 }}>
                {TranslateString(352, 'APR')}
              </Typography>
              <Typography style={{ fontSize: 34, fontWeight: 500, fontFamily: 'Poppin', paddingTop: 0 }}>
                {farmAPY} %
              </Typography>
            </Box>
          </Card>
        ) : (
          <Card className={classes.cardWrapper}>
            <Typography style={{ fontSize: 16, fontFamily: 'Poppin', paddingBottom: 24 }}>
              Please unlock your wallet to see your stats
            </Typography>
            <Button className={classes.walletButton} onClick={onPresentConnectModal}>
              UNLOCK WALLET
            </Button>
          </Card>
        )}
        {account ? (
          <Box className={classes.bgWrapper}>
            <img src="/images/stats-bg-active.svg" alt="bg_image" />
          </Box>
        ) : (
          <Box className={classes.bgWrapper}>
            <img src="/images/stats-bg.svg" alt="bg_image" />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Account
