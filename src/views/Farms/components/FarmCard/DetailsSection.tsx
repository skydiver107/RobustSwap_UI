import React, { useCallback } from 'react'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { LinkExternal, Text, Flex, OpenNewIcon, Button } from '@robustswap-libs/uikit'
import BigNumber from 'bignumber.js'
import useStyles from "assets/styles"
import { registerToken } from 'utils/wallet'
import { useFarmUser } from 'state/hooks'
import HarvestAction from './HarvestAction'
import QuestionHelper from '../../../../components/QuestionHelper'

export interface ExpandableSectionProps {
  rbsPrice?: BigNumber
  removed?: boolean
  totalValueFormated?: string
  lpLabel?: string
  depositFee?: number
  harvestInterval?: number
  pid: number
  stakedTokenPriceUSD?: BigNumber
  tokenMode: boolean
  account?: string
  stakedBalance?: BigNumber
  bscScanAddress?: string
  pairinfo?: string
  addLiquidityUrl?: string
}

const Wrapper = styled.div`
  text-align: left;
  padding: 16px;
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

const StyledLinkExternal = styled(LinkExternal)`
  svg {
    height: 20px;
    width: 20px;
  }
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  rbsPrice,
  lpLabel,
  depositFee,
  harvestInterval,
  pid,
  stakedTokenPriceUSD,
  tokenMode,
  account,
  removed,
  bscScanAddress,
  pairinfo,
  addLiquidityUrl
}) => {
  const { stakedBalance, allowance } = useFarmUser(pid)
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const tokenAddress = bscScanAddress.replace('https://bscscan.com/token/', '')
  const TranslateString = useI18n()
  const { canHarvest, earnings } = useFarmUser(pid)
  const classes = useStyles.chart();
  const registerNativeToken = useCallback(async () => {
    try {
      await registerToken(tokenAddress, lpLabel, 18, `https://robustswap.com/images/farms/${lpLabel === 'WBNB' ? 'BNB' : lpLabel}.png`)
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    }
  }, [lpLabel, tokenAddress])

  return (
    <Wrapper>
      {tokenMode ? <>
        <Flex justifyContent="space-between">
          <Block>
            <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{lpLabel}</Text>
            <StyledLinkExternal href={addLiquidityUrl}>
              <Text fontSize="16px" color="#A0B9FB">Get LP</Text>
            </StyledLinkExternal>
          </Block>
          <Block>
            <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(999, 'Contract')}</Text>
            <StyledLinkExternal href={bscScanAddress}>
              <Text fontSize="16px" color="#A0B9FB">View</Text>
            </StyledLinkExternal>
          </Block>
          <Block>
            <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(999, 'Pair Info')}</Text>
            <StyledLinkExternal href={pairinfo}>
              <Text fontSize="16px" color="#A0B9FB">View</Text>
            </StyledLinkExternal>
          </Block>
        </Flex>
        <Flex justifyContent="space-between" style={{ marginTop: 16 }}>
          <Block>
            <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(10001, 'Deposit Fee')}</Text>
            <Text fontSize="16px">{depositFee / 100}%</Text>
          </Block>
          <Block>
            <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(10032, 'LP Type')}</Text>
            <Text fontSize="16px">{removed ? 'CAKE-LP' : 'RBS-LP'}</Text>
          </Block>
          <Block>
            <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(10027, 'Harvest Interval')}:</Text>
            <Text fontSize="16px" style={{ display: 'flex', alignItems: 'top' }}>
              {(harvestInterval / 3600).toLocaleString()} {TranslateString(10028, 'Hours')}
              <>
                <QuestionHelper text="How often you can harvest your earned RBS." wth={16} hgh={16} mode={0} />
              </>
            </Text>
          </Block>
        </Flex> </> :
        <>
          <Flex justifyContent="center">
            <Button onClick={registerNativeToken} className={classes.metamaskButton} style={{ marginTop: 0, marginBottom: 16, width: '100%', height: 32, borderRadius: 28, border: '1px solid #5F47EE', color: '#5F47EE', fontWeight: 600, fontSize: 18, padding: '4px 24px', background: 'transparent' }}>
              <img style={{ marginRight: 8 }} width={16} src="/images/wallet/metamask.png" alt="metamask logo" /> +
            </Button>
          </Flex>
          <Flex justifyContent="space-between">
            <Block>
              <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(999, 'Token')}:</Text>
              <StyledLinkExternal href={pairinfo}>
                <Text fontSize="16px">Info</Text>
              </StyledLinkExternal>
            </Block>
            <Block>
              <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(999, 'Contract')}:</Text>
              <StyledLinkExternal href={bscScanAddress}>
                <Text fontSize="16px">View</Text> {/* {depositFee / 100} */}
              </StyledLinkExternal>
            </Block>
            <Block>
              <Text fontSize="12px" style={{ color: '#A5A5A5' }}>{TranslateString(10027, 'Harvest Interval')}:</Text>
              <Text fontSize="16px" style={{ display: 'flex', alignItems: 'top' }}>
                {(harvestInterval / 3600).toLocaleString()} {TranslateString(10028, 'Hours')}
                <>
                  <QuestionHelper text="How often you can harvest your earned RBS." wth={16} hgh={16} mode={0} />
                </>
              </Text>
            </Block>
          </Flex>
        </>}
    </Wrapper>
  )
}

export default DetailsSection
