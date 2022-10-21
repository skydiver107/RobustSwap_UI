import React, { useMemo, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { provider } from 'web3-core'
import { getContract } from 'utils/erc20'
import { getFullDisplayBalance, getBalanceNumber } from 'utils/formatBalance'
import { Button, Flex, Heading, Text, IconButton, AlarmIcon, useModal } from '@robustswap-libs/uikit'
import { Web3Provider } from '@ethersproject/providers'
import { Farm } from 'state/types'
import { useFarmFromPid, useFarmUser } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { useApprove } from 'hooks/useApprove'
import StakeAction from './StakeAction'
import HarvestAction from './HarvestAction'
import HarvestCountdownModal from '../HarvestCountdownModal'

const Action = styled.div`
  padding-top: 4px;
`

const StyledIconButton = styled(IconButton)`
  height: 16px;
  margin-left: auto;

  svg {
    width: 18px;
    fill: ${({ theme }) => theme.colors.warning};
  }
`

const tada = keyframes`
  from {
    transform: scale3d(1, 1, 1);
  }

  10%,
  20% {
    transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
  }

  30%,
  50%,
  70%,
  90% {
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
  }

  40%,
  60%,
  80% {
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
  }

  to {
    transform: scale3d(1, 1, 1);
  }
`

const TadaAlarmIcon = styled(AlarmIcon)`
  animation: ${tada} 5s ease-in-out infinite;
  transform: translate3d(0, 0, 0);
`

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  ethereum?: Web3Provider
  account?: string
  harvestInterval?: number
  stakedTokenPriceUSD?: BigNumber
  rbsPrice?: BigNumber
  tokenMode: boolean
  addLiquidityUrl?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({
  farm,
  ethereum,
  account,
  harvestInterval,
  stakedTokenPriceUSD,
  rbsPrice,
  tokenMode,
  addLiquidityUrl
}) => {
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses, tokenAddresses, isTokenOnly, depositFeeBP } = useFarmFromPid(farm.pid)
  const { allowance, tokenBalance, stakedBalance, nextHarvestUntil, canHarvest, earnings } = useFarmUser(pid)
  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const displayBalance = rawStakedBalance.toLocaleString()
  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const tokenAddress = tokenAddresses[process.env.REACT_APP_CHAIN_ID]
  const lpName = farm.lpSymbol.toUpperCase()
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const lpContract = useMemo(() => {
    if (isTokenOnly) {
      return getContract(ethereum, tokenAddress, account)
    }
    return getContract(ethereum, lpAddress, account)
  }, [ethereum, lpAddress, tokenAddress, account, isTokenOnly])

  const { onApprove } = useApprove(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (rawStakedBalance === 0 && tokenBalance.toString() === '0' && tokenMode) ? (
      <Flex style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="subtle" as="a" href={addLiquidityUrl} style={{ width: '100%' }}>
          {TranslateString(507, 'GET LP')}
        </Button>
      </Flex>
    ) : (
      <StakeAction
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName={lpName}
        pid={pid}
        depositFeeBP={depositFeeBP}
        stakedTokenPriceUSD={stakedTokenPriceUSD}
      />
    ) : (
      <Flex style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="subtle" disabled={requestedApproval} onClick={handleApprove} style={{ width: '100%', marginTop: !tokenMode ? 25 : 0 }}>
          {TranslateString(326, 'ENABLE')}
        </Button>
      </Flex>
    )
  }

  const [onPresentHarvestCountdown] = useModal(
    <HarvestCountdownModal nextHarvestUntil={nextHarvestUntil} harvestInterval={harvestInterval} farm={farm} />,
  )

  return (
    <Action>
      <Flex>
        <Text textTransform="uppercase" fontSize="10px" style={{ color: '#A5A5A5' }}>
          {TranslateString(331, 'Earned')}
        </Text>
        <Text textTransform="uppercase" fontSize="10px" pr="3px" style={{ color: '#A5A5A5' }}>
          {/* TODO: Is there a way to get a dynamic value here from useFarmFromSymbol? */}
          &nbsp;RBS
        </Text>
      </Flex>
      <HarvestAction earnings={earnings} pid={pid} canHarvest={canHarvest} rbsPrice={rbsPrice} stakedBalance={stakedBalance} nextHarvest={nextHarvestUntil} cardMode={1} harvestCount={onPresentHarvestCountdown} />
      {tokenMode ? <>
        <Flex>
          <Text fontSize="12px" style={{ color: '#A5A5A5' }}>
            {rawStakedBalance === 0 ? TranslateString(453, 'Available LP') : TranslateString(329, 'Staked') + " LP"}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          {rawStakedBalance === 0 ?
            <div style={{ textAlign: 'left' }}>
              <Text fontSize="20px" style={{ fontWeight: 600 }}>
                {Number(getFullDisplayBalance(tokenBalance)).toFixed(3)} LP
              </Text>
              <Text fontSize="13px">${(Number(getFullDisplayBalance(tokenBalance)) * stakedTokenPriceUSD.toNumber()).toFixed(3)}</Text>
            </div> :
            <Heading style={{ marginTop: 15, opacity: 0 }} />
          }
          {!account ? <UnlockButton /> : renderApprovalOrStakeButton()}
        </Flex>
      </> :
        <>
          <Flex>
            {isApproved && <Text fontSize="12px" style={{ color: '#A5A5A5', marginBottom: 8 }}>
              {TranslateString(329, 'Staked')} {lpName}
            </Text>}
          </Flex>
          {!account ? <UnlockButton fullWidth /> : renderApprovalOrStakeButton()}
        </>
      }
    </Action>
  )
}

export default CardActions
