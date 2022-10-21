import React from 'react'
import { Card, CardBody, Text, Link } from '@robustswap-libs/uikit'
import styled from 'styled-components'
import moment from 'moment'
import { useCurrentTime } from '../../../hooks/useTimer'
import getTimePeriods from '../../../utils/getTimePeriods'
import { zeroPad } from '../../../utils/formatTimePeriod'

const StyledCard = styled(Card)`
  margin-bottom: 32px;
  text-align: center;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
`

const CountdownNumberBox = styled.div`
  padding: 10px 5px;
  border-radius: 12px;
  border: 2px dotted #48af99;
  // background: linear-gradient(180deg, #54dade 0%, #24c7d6 76.22%);
  color: #48af99;
  font-size: 20px;
  font-weight: 900;
  margin: 15px;
  margin-bottom: 7px;
  width: 46px;

  @media (min-width: 768px) {
    font-size: 38px;
    margin: 20px;
    margin-bottom: 6px;
    width: 72px;
  }
`

const CenteredText = styled.div`
  text-align: center;
  align-items: center;
`

const StyledText = styled(Text)`
  color: #48af99;
  font-size: 14px;
`

const InlineStyledLink = styled(Link)`
  display: inline-block;
`

const startBlock = 6922000
const etaTime = 1619502610

const FarmingStartCard = () => {
  const currentTime = Math.floor(useCurrentTime() / 1000)
  const secondsUntilUpdate = etaTime - currentTime
  const timeUntil = getTimePeriods(secondsUntilUpdate > 0 ? secondsUntilUpdate : 0)

  return (
    <StyledCard>
      <CardBody>
        <Text bold color="primary" fontSize="18px" mb="8px">
          🚜&nbsp;&nbsp;Farming will start at block{' '}
          <InlineStyledLink href={`https://bscscan.com/block/${startBlock}`} target="_blank" fontSize="18px">
            #{startBlock}
          </InlineStyledLink>
          &nbsp;🚜
        </Text>
        <Text fontSize="14px">Estimated Target Date: {moment(etaTime * 1000).toLocaleString()}</Text>
        <StyledCardContentInner>
          <Row>
            <div>
              <CountdownNumberBox>
                <CenteredText>{zeroPad(timeUntil.days)}</CenteredText>
              </CountdownNumberBox>
              <StyledText>Days</StyledText>
            </div>
            <div>
              <CountdownNumberBox>
                <CenteredText>{zeroPad(timeUntil.hours)}</CenteredText>
              </CountdownNumberBox>
              <StyledText>Hours</StyledText>
            </div>
            <div>
              <CountdownNumberBox>
                <CenteredText>{zeroPad(timeUntil.minutes)}</CenteredText>
              </CountdownNumberBox>
              <StyledText>Minutes</StyledText>
            </div>
            <div>
              <CountdownNumberBox>
                <CenteredText>{zeroPad(timeUntil.seconds)}</CenteredText>
              </CountdownNumberBox>
              <StyledText>Seconds</StyledText>
            </div>
          </Row>
        </StyledCardContentInner>
        <Text bold color="primary" fontSize="18px" mb="4px" mt="16px">
          🚀&nbsp;&nbsp;Fair Launch, No PreSale, No PreMine&nbsp;🚀
        </Text>
        <Link
          bold={false}
          href=""
          target="_blank"
          style={{ fontSize: '14px', margin: '0 auto' }}
        >
          Read More About The Launch
        </Link>
        <Text bold color="primary" fontSize="18px" mb="4px" mt="16px">
          🥞&nbsp;&nbsp;Fully Support RBS-LP v2&nbsp;🥞
        </Text>
      </CardBody>
    </StyledCard>
  )
}

export default FarmingStartCard
