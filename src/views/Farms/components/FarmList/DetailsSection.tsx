import React, { useCallback } from 'react'
import useI18n from 'hooks/useI18n'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { Web3Provider } from '@ethersproject/providers';
import { Farm } from 'state/types'
import { provider } from 'web3-core'
import styled from 'styled-components'
import { useFarmUser } from 'state/hooks'
import { LinkExternal, OpenNewIcon, Text, Flex, Button } from '@robustswap-libs/uikit'
import useStyles from "assets/styles"
import { registerToken } from 'utils/wallet'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance } from 'utils/formatBalance'
import CardActionsContainer from './CardActionsContainer'
import MobileCardActionsContainer from './MobileCardActionsContainer'
import QuestionHelper from '../../../../components/QuestionHelper'

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

export interface ExpandableSectionProps {
  lpLabel?: string
  depositFee?: number
  harvestInterval?: number
  pid: number
  stakedTokenPriceUSD?: BigNumber
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  ethereum?: Web3Provider
  account?: string
  harvestInterval?: number
  stakedTokenPriceUSD?: BigNumber
  rbsPrice?: BigNumber
  isMobile: boolean
  removed: boolean
  totalValueFormated?: string
  tokenMode: boolean
}

const Wrapper = styled.div<{ tokenMode: boolean }>`
  margin-top: auto;
  margin-bottom: auto;
  padding: 24px 0px 0px 0px;
  padding-bottom: ${({ tokenMode }) => tokenMode ? "24px" : "0px"};
  text-align: left;
`

const Divider = styled.div`
  background-color: #3D65CA;
  height: 1px;
  margin: 28px auto;
  width: 100%;
`
const Block = styled.div`
  text-align: left;
`

const StyledBlock = styled.div`
  background-color: #293D71;
  padding-bottom: 8px;
  margin: 12px 0px;
  padding: 8px 24px;
  background-image: url('/images/farm-step.svg');
  background-position: 16px, center;
  background-repeat: no-repeat;
`

const StyledLinkExternal = styled(LinkExternal)`
  svg {
    height: 20px;
    width: 20px;
  }
`

const DetailsSection: React.FC<ExpandableSectionProps & FarmCardActionsProps> = ({
  lpLabel,
  depositFee,
  harvestInterval,
  pid,
  stakedTokenPriceUSD,
  farm,
  ethereum,
  account,
  rbsPrice,
  isMobile,
  removed,
  totalValueFormated,
  tokenMode
}) => {
  const TranslateString = useI18n()
  const { tokenBalance } = useFarmUser(pid)
  const classes = useStyles.chart();
  const chainId = 56
  const registerNativeToken = useCallback(async () => {
    try {
      await registerToken(farm.tokenAddresses[chainId], farm.tokenSymbol, 18, `https://robustswap.com/images/farms/${farm.tokenSymbol === 'WBNB' ? 'BNB' : farm.tokenSymbol}.png`)
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    }
  }, [farm])

  const bscScanAddress = farm.isTokenOnly
    ? `https://bscscan.com/token/${farm.tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
    : `https://bscscan.com/token/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`

  const pairinfo = farm.isTokenOnly
    ? `https://pancakeswap.finance/info/token/${farm.tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
    : `https://pancakeswap.finance/info/pool/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`

  const addLiquidityUrl = farm.isTokenOnly
    ? '' : `https://exchange.robustswap.com/#/add/${farm.quoteTokenAdresses[chainId]}/${farm.tokenAddresses[chainId]}`

  return (
    <Wrapper tokenMode={tokenMode}>
      {isMobile ?
        <>
          <Flex justifyContent="space-between" alignItems="center" style={{ padding: '0px 24px' }}>
            <Block>
              <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(457, 'Multiplier')}:</Text>
              <Flex alignItems="center">
                <Text fontSize="20px" style={{ fontWeight: 'bold', color: '#FF6B2A' }}>{farm.multiplier}</Text>
                <QuestionHelper text={TranslateString(299, 'The multiplier represents the amount of RBS rewards each farm gets. For example, if a 1x farm was getting 1 RBS per block, a 40x farm would be getting 40 RBS per block.')} wth={16} hgh={16} mode={0} />
              </Flex>
            </Block>
            <Block>
              <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(408, 'Total Staked')}:</Text>
              <Flex alignItems="center">
                <Text fontSize="20px" style={{ fontWeight: 'bold' }}>{!removed ? totalValueFormated : 0}</Text>
                {tokenMode ?
                  <QuestionHelper text={TranslateString(305, 'Total USD value of funds in this pool')} wth={16} hgh={16} mode={0} /> :
                  <QuestionHelper text={TranslateString(301, 'Total USD value of funds in this farm’s liquidity pool')} wth={16} hgh={16} mode={0} />
                }
              </Flex>
            </Block>
          </Flex>
          <StyledBlock>
            <Flex alignItems="center" justifyContent="space-between">
              <div style={{ marginLeft: 16 }}>
                <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(453, 'Available LP')}</Text>
                <Text fontSize="14px">{Number(getFullDisplayBalance(tokenBalance)).toFixed(3)} LP</Text>
                <Text fontSize="12px">${(Number(getFullDisplayBalance(tokenBalance)) * stakedTokenPriceUSD.toNumber()).toFixed(3)}</Text>
              </div>
              <Button variant="subtle" as="a" href={addLiquidityUrl}>
                {TranslateString(507, 'GET LP')}
              </Button>
            </Flex>
            <MobileCardActionsContainer
              farm={farm}
              ethereum={ethereum}
              account={account}
              harvestInterval={harvestInterval}
              stakedTokenPriceUSD={stakedTokenPriceUSD}
              rbsPrice={rbsPrice}
            />
          </StyledBlock>
        </> :
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            {!tokenMode && <Button variant="subtle" as="a" href={addLiquidityUrl} style={{ marginRight: 16 }}>
              {TranslateString(507, 'GET LP')}
            </Button>}
            <div>
              {tokenMode ?
                <>
                  <Button onClick={registerNativeToken} className={classes.metamaskButton} style={{ width: 89, height: 32, borderRadius: 28, border: '1px solid #5F47EE', color: '#5F47EE', fontWeight: 600, fontSize: 18, padding: '4px 24px', background: 'transparent' }}>
                    <img style={{ marginRight: 8 }} width={16} src="/images/wallet/metamask.png" alt="metamask logo" /> +
                  </Button>
                </> :
                <>
                  <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(453, 'Available LP')}</Text>
                  <Text fontSize="16px">{Number(getFullDisplayBalance(tokenBalance)).toFixed(3)} LP</Text>
                  <Text fontSize="12px">${(Number(getFullDisplayBalance(tokenBalance)) * stakedTokenPriceUSD.toNumber()).toFixed(3)}</Text>
                </>
              }
            </div>
          </Flex>
          {tokenMode && <>
            <Block>
              <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(999, 'Token')}:</Text>
              <StyledLinkExternal href={pairinfo}>
                <Text fontSize="16px">Info</Text>
              </StyledLinkExternal>
            </Block>
            <Block>
              <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(999, 'Contract')}</Text>
              <StyledLinkExternal href={bscScanAddress}>
                <Text fontSize="16px">View</Text>
              </StyledLinkExternal>
            </Block>
          </>}
          {tokenMode && <Block>
            <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(10027, 'Harvest Interval')}:</Text>
            <Text fontSize="16px" style={{ display: 'flex', alignItems: 'end' }}>
              {(harvestInterval / 3600).toLocaleString()} {TranslateString(10028, 'Hours')}
              <>
                <QuestionHelper text={TranslateString(295, "How often you can harvest your earned RBS.")} wth={16} hgh={16} mode={0} />
              </>
            </Text>
          </Block>}
          {!tokenMode && <ArrowForwardIosIcon style={{ color: '#3D65CA' }} />}
          <CardActionsContainer
            farm={farm}
            ethereum={ethereum}
            account={account}
            harvestInterval={harvestInterval}
            stakedTokenPriceUSD={stakedTokenPriceUSD}
            rbsPrice={rbsPrice}
            tokenMode={tokenMode}
          />
        </Flex>
      }
      {!isMobile && !tokenMode && <Divider style={{ marginTop: 16, marginBottom: 16 }} />}
      {isMobile ?
        <Flex justifyContent="space-between" style={{ padding: '0px 24px' }}>
          {!tokenMode && <><Block>
            <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(10001, 'Deposit Fee')}</Text>
            <Text fontSize="12px">{depositFee / 100}%</Text>
          </Block>
            <Block>
              <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(10032, 'LP Type')}</Text>
              {/* <Text fontSize="12px">{lpLabel}</Text> */}
              <Text fontSize="16px">{removed ? 'CAKE-LP' : 'RBS-LP'}</Text>
            </Block>
            <Block>
              <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(10027, 'Harvest Interval')}:</Text>
              <Text fontSize="12px" style={{ display: 'flex', alignItems: 'end' }}>
                {(harvestInterval / 3600).toLocaleString()} {TranslateString(10028, 'Hours')}
                <>
                  <QuestionHelper text={TranslateString(295, "How often you can harvest your earned RBS.")} wth={16} hgh={16} mode={0} />
                </>
              </Text>
            </Block></>}
        </Flex> :
        <Flex>
          {!tokenMode && <>
            <Block style={{ paddingRight: 56, marginBottom: 24 }}>
              <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(999, 'RBS-BNB LP')}</Text>
              <StyledLinkExternal href={addLiquidityUrl}>
                <Text fontSize="16px" color="#A0B9FB">Get LP</Text>
              </StyledLinkExternal>
            </Block>
            <Block style={{ paddingRight: 56, marginBottom: 24 }}>
              <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(999, 'Contract')}</Text>
              <StyledLinkExternal href={bscScanAddress}>
                <Text fontSize="16px" color="#A0B9FB">View</Text>
              </StyledLinkExternal>
            </Block>
            <Block style={{ paddingRight: 56, marginBottom: 24 }}>
              <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(999, 'Pair Info')}</Text>
              <StyledLinkExternal href={pairinfo}>
                <Text fontSize="16px" color="#A0B9FB">View</Text>
              </StyledLinkExternal>
            </Block>
            <Block style={{ paddingRight: 56, marginBottom: 24 }}>
              <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(10001, 'Deposit Fee')}</Text>
              <Text fontSize="16px">{depositFee / 100}%</Text>
            </Block>
            <Block style={{ paddingRight: 56 }}>
              <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(10032, 'LP Type')}</Text>
              {/* <Text fontSize="16px">{lpLabel}</Text> */}
              <Text fontSize="16px">{removed ? 'CAKE-LP' : 'RBS-LP'}</Text>
            </Block>
            <Block style={{ paddingRight: 56, marginTop: -1 }}>
              <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(10027, 'Harvest Interval')}:</Text>
              <Text fontSize="16px" style={{ display: 'flex', alignItems: 'center' }}>
                {(harvestInterval / 3600).toLocaleString()} {TranslateString(10028, 'Hours')}
                <>
                  <QuestionHelper text={TranslateString(295, "How often you can harvest your earned RBS.")} wth={16} hgh={16} mode={0} />
                </>
              </Text>
            </Block></>}
        </Flex>
      }
    </Wrapper >
  )
}

export default DetailsSection
