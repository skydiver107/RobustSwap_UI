import React, { useMemo, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { Web3Provider } from '@ethersproject/providers';
import { provider } from 'web3-core'
import { getContract } from 'utils/erc20'
import { Button, Flex, Text } from '@robustswap-libs/uikit'
import { Farm } from 'state/types'
import { useFarmFromPid, useFarmUser } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { useApprove } from 'hooks/useApprove'
import StakeAction from './StakeAction'
import HarvestAction from './HarvestAction'

const Action = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 0.5;
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
}

const CardActions: React.FC<FarmCardActionsProps> = ({
  farm,
  ethereum,
  account,
  harvestInterval,
  stakedTokenPriceUSD,
  rbsPrice,
  tokenMode
}) => {

  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses, tokenAddresses, isTokenOnly, depositFeeBP } = useFarmFromPid(farm.pid)
  const { allowance, tokenBalance, stakedBalance, nextHarvestUntil, canHarvest, earnings } = useFarmUser(pid)
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
    return isApproved ? (
      <StakeAction
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName={lpName}
        pid={pid}
        depositFeeBP={depositFeeBP}
        stakedTokenPriceUSD={stakedTokenPriceUSD}
      />
    ) : (
      <Flex style={{ alignItems: 'center' }}>
        <Button variant="subtle" disabled={requestedApproval} onClick={handleApprove}>
          {TranslateString(326, 'ENABLE')}
        </Button>
      </Flex>
    )
  }

  return (
    <Action>
      {!account ? <UnlockButton /> : renderApprovalOrStakeButton()}
      <ArrowForwardIosIcon style={{ color: '#3D65CA' }} />
      <HarvestAction earnings={earnings} pid={pid} canHarvest={canHarvest} rbsPrice={rbsPrice} stakedBalance={stakedBalance} nextHarvestUntil={nextHarvestUntil} harvestInterval={harvestInterval} farm={farm} />
    </Action>
  )
}

export default CardActions
