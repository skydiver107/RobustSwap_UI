import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Flex, Text, IconButton, AlarmIcon, useModal, Heading } from '@robustswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useHarvest } from 'hooks/useHarvest'
import { getBalanceNumber } from 'utils/formatBalance'
import styled, { keyframes } from 'styled-components'
import { Farm } from 'state/types'
import HarvestCountdownModal from '../HarvestCountdownModal'

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

interface FarmCardActionsProps {
  earnings?: BigNumber
  pid?: number
  canHarvest: boolean
  rbsPrice?: BigNumber
  stakedBalance?: BigNumber
  nextHarvestUntil: number
  harvestInterval: number
  farm: FarmWithStakedValue
}

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
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

const StyledIconButton = styled(IconButton)`
  height: 16px;
  margin-left: auto;

  svg {
    width: 24px;
    fill: ${({ theme }) => theme.colors.warning};
  }
`

const HarvestAction: React.FC<FarmCardActionsProps> = ({ earnings, pid, canHarvest, rbsPrice, stakedBalance, nextHarvestUntil, harvestInterval, farm }) => {
  const TranslateString = useI18n()
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useHarvest(pid)

  const rawEarningsBalance = getBalanceNumber(earnings)
  const earningBalanceUSD = getBalanceNumber(earnings.times(rbsPrice))
  const displayBalance = rawEarningsBalance.toLocaleString()

  const [onPresentHarvestCountdown] = useModal(
    <HarvestCountdownModal nextHarvestUntil={nextHarvestUntil} harvestInterval={harvestInterval} farm={farm} />,
  )
  return (
    <Flex alignItems="center">
      <BalanceAndCompound>
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
      {(stakedBalance.gt(0) || earnings.gt(0)) && nextHarvestUntil > 0 && !canHarvest ? (
        <StyledIconButton onClick={onPresentHarvestCountdown} variant="text" size="sm">
          <TadaAlarmIcon />
        </StyledIconButton>
      ) : (
        ''
      )}
      <div style={{ paddingLeft: 16 }}>
        <Text textTransform="uppercase" fontSize="10px" style={{ color: '#A5A5A5' }}>
          {TranslateString(331, 'Earned')}
        </Text>
        <Heading
          color={rawEarningsBalance === 0 ? 'textDisabled' : 'text'}
          style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.5 }}>
          {displayBalance}
        </Heading>
        {rawEarningsBalance !== 0 && (
          <Text fontSize="12px" color="white" style={{ textAlign: 'left' }}>
            ${earningBalanceUSD.toLocaleString()}
          </Text>
        )}
      </div>
    </Flex>
  )
}

export default HarvestAction
