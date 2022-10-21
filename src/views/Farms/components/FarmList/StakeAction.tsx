import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, IconButton, AddIcon, MinusIcon, useModal, Text } from '@robustswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import { getBalanceNumber } from 'utils/formatBalance'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'

interface FarmCardActionsProps {
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string
  pid?: number
  depositFeeBP?: number
  stakedTokenPriceUSD?: BigNumber
}

const IconButtonWrapper = styled.div`
  display: flex;
  background-color: transparent;
  svg {
    width: 52px;
    height: 30px;
  }
`

const StakeAction: React.FC<FarmCardActionsProps> = ({
  stakedBalance,
  tokenBalance,
  tokenName,
  pid,
  depositFeeBP,
  stakedTokenPriceUSD,
}) => {
  const TranslateString = useI18n()
  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)

  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const stakedBalanceUSD = getBalanceNumber(stakedBalance.times(stakedTokenPriceUSD))
  const displayBalance = rawStakedBalance.toLocaleString(undefined, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })
  const tokenMode = tokenName.includes('-')

  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={onStake} tokenName={tokenName} depositFeeBP={depositFeeBP} />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={tokenName} depositFeeBP={depositFeeBP} />,
  )

  const renderStakingButtons = () => {
    return rawStakedBalance === 0 ? (
      <Button variant="subtle" onClick={onPresentDeposit} style={{ minWidth: '122px' }}>
        {TranslateString(321, 'STAKE')}
      </Button>
    ) : (
      <IconButtonWrapper>
        <IconButton style={{ backgroundColor: 'transparent', boxShadow: 'none' }} onClick={onPresentWithdraw} mr="10px">
          <MinusIcon color="primary" />
        </IconButton>
        <IconButton style={{ backgroundColor: 'transparent', boxShadow: 'none' }} onClick={onPresentDeposit}>
          <AddIcon />
        </IconButton>
      </IconButtonWrapper>
    )
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      {renderStakingButtons()}
      <div>
        <div style={{ textAlign: 'left', paddingLeft: 16 }}>
          <Text fontSize="12px" style={{ color: '#A5A5A5' }}>
            {!tokenMode ? `${TranslateString(329, 'Staked')} ${tokenName}` : TranslateString(329, 'Staked') + " LP"}
          </Text>
          <Text fontSize="16px">{displayBalance} {tokenMode && 'LP'}</Text>
          <Text fontSize="12px">${stakedBalanceUSD.toFixed(3)}</Text>
        </div>
      </div>
    </Flex >
  )
}

export default StakeAction
