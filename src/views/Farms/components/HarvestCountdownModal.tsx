import React from 'react'
import { Modal, Text } from '@robustswap-libs/uikit'
import { useCurrentTime } from '../../../hooks/useTimer'
import getTimePeriods from '../../../utils/getTimePeriods'
import { formatTimePeriodCountdown } from '../../../utils/formatTimePeriod'
import useI18n from '../../../hooks/useI18n'
import { Farm } from '../../../state/types'

interface HarvestCountdownModalProps {
  farm: Farm
  nextHarvestUntil: number
  harvestInterval: number
  onDismiss?: () => void
}

const HarvestCountdownModal: React.FC<HarvestCountdownModalProps> = ({
  onDismiss,
  nextHarvestUntil,
  harvestInterval,
  farm,
}) => {
  const TranslateString = useI18n()
  const currentTime = Math.floor(useCurrentTime() / 1000)
  const secondsUntilHarvest = nextHarvestUntil - currentTime
  const timeUntil = getTimePeriods(secondsUntilHarvest > 0 ? secondsUntilHarvest : 0)

  return (
    <Modal title={TranslateString(10029, 'Harvest In')} onDismiss={onDismiss}>
      <Text bold color="primary" fontSize="36px" style={{ textAlign: 'center' }}>
        {formatTimePeriodCountdown(timeUntil)}
      </Text>
      <Text color="textDisabled" mt="10px" style={{ textAlign: 'center' }}>
        {farm.isTokenOnly ? 'Pool' : 'Farm'}: {farm.lpSymbol}
      </Text>
      <Text color="textDisabled" mt="5px" style={{ textAlign: 'center' }}>
        {TranslateString(10027, 'Harvest Interval')}: {(harvestInterval / 3600).toLocaleString()}{' '}
        {TranslateString(10028, 'Hours')}
      </Text>
    </Modal>
  )
}

export default HarvestCountdownModal
