import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { AlarmIcon, Button, Flex, Heading, IconButton, Text } from '@robustswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useHarvest } from 'hooks/useHarvest'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getBalanceNumber } from 'utils/formatBalance'
import styled, { keyframes } from 'styled-components'

interface FarmCardActionsProps {
  earnings?: BigNumber
  pid?: number
  canHarvest: boolean
  rbsPrice?: BigNumber
  stakedBalance?: BigNumber
  nextHarvest?: number
  cardMode?: number
  harvestCount?: () => void
}

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
`

const StyledIconButton = styled(IconButton)`
  height: 16px;

  svg {
    width: 24px;
    fill: ${({ theme }) => theme.colors.warning};
  }
`

const tada = keyframes`
  // from {
  //   transform: scale3d(1, 1, 1);
  // }

  // 10%,
  // 20% {
  //   transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
  // }

  // 30%,
  // 50%,
  // 70%,
  // 90% {
  //   transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
  // }

  // 40%,
  // 60%,
  // 80% {
  //   transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
  // }

  // to {
  //   transform: scale3d(1, 1, 1);
  // }
`

const TadaAlarmIcon = styled(AlarmIcon)`
  // animation: ${tada} 5s ease-in-out infinite;
  // transform: translate3d(0, 0, 0);
`

const HarvestAction: React.FC<FarmCardActionsProps> = ({ earnings, pid, canHarvest, rbsPrice, stakedBalance, nextHarvest, cardMode = 0, harvestCount }) => {
  const TranslateString = useI18n()
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useHarvest(pid)
  const { account } = useActiveWeb3React()
  const rawEarningsBalance = getBalanceNumber(earnings)
  const earningBalanceUSD = getBalanceNumber(earnings.times(rbsPrice))
  const displayBalance = rawEarningsBalance.toLocaleString()

  return (
    <Flex mb="8px" justifyContent="space-between" alignItems="center">
      {cardMode === 1 && <div>
        <Heading color={account ? rawEarningsBalance === 0 ? 'textDisabled' : 'text' : 'text'} style={{ textAlign: 'left' }}>
          {account ? displayBalance : '-'}
        </Heading>
        {rawEarningsBalance !== 0 && (
          <Text fontSize="13px" mt="4px" color="white" style={{ textAlign: 'left' }}>
            ${earningBalanceUSD.toLocaleString()}
          </Text>
        )}
      </div>}
      <BalanceAndCompound style={{ width: cardMode ? 'auto' : '100%', marginLeft: 'auto' }}>
        <Button
          disabled={rawEarningsBalance === 0 || !canHarvest || pendingTx}
          onClick={async () => {
            setPendingTx(true)
            await onReward()
            setPendingTx(false)
          }}
          style={{
            minWidth: '122px',
            color: 'white',
            opacity: (rawEarningsBalance === 0 || !canHarvest || pendingTx) ? 0.4 : 1
          }}
          variant="subtle"
        >
          {TranslateString(562, 'HARVEST')}
        </Button>
      </BalanceAndCompound>
      {(stakedBalance.gt(0) || earnings.gt(0)) && nextHarvest > 0 && !canHarvest ? (
        <StyledIconButton onClick={harvestCount} variant="text" size="sm">
          <TadaAlarmIcon />
        </StyledIconButton>) : (
        ''
      )}
    </Flex>
  )
}

export default HarvestAction
