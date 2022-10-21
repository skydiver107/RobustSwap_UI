import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Card, CopyCircleIcon, CopyIcon, Heading, Text } from '@robustswap-libs/uikit'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import { useMedia } from 'react-use'
import { accountToReferralCode } from 'utils/referralCode'
import useReferralsCount, { useTotalReferralCommissions } from 'hooks/useReferralRecords'
import useGetDocumentTitlePrice from 'hooks/useGetDocumentTitlePrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { usePriceRbsBusd, usePriceRbtBusd } from 'state/hooks'
import UnlockButton from 'components/UnlockButton'
import { getBalanceNumber } from 'utils/formatBalance'
import Page from '../../components/layout/Page'
import useI18n from '../../hooks/useI18n'
import UnlockWalletNotice from './components/UnlockWalletNotice'

const Hero = styled.div<{ isMobile: boolean, isConnect: string }>`
  background-image: ${({ isConnect }) => isConnect ? "url('/images/referrals/img-referral.png')" : "url('/images/referrals/img-referral-no-connect.png')"};
  background-size: cover;
  background-repeat: no-repeat;
  margin-bottom: 44px;
  margin-top: ${({ isMobile }) => isMobile ? "-15px" : "0px"};

  height: ${({ isConnect, isMobile }) => isMobile ? isConnect ? "450px" : "410px" : "380px"};
  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 0;
    padding-bottom: 0;
  }
`
const StyledHeading = styled(Heading) <{ isMobile: boolean }>`
  font-weight: 600;
  font-size: 34px;
  line-height: 40px;
  letter-spacing: -0.5px;
  color: #FCFCFC;
  margin-left: ${({ isMobile }) => isMobile ? "24px" : "80px"};
`
const PubTitle = styled(Text) <{ isMobile: boolean }>`
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  color: #FCFCFC;
  max-width: 543px;
  width: 90%;
  margin-left: ${({ isMobile }) => isMobile ? "24px" : "80px"};
  margin-top: 16px;
`
const LogTitle = styled(Text)`
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
  color: #FCFCFC;
`
const LogPrice = styled(Text)`
  fontWeight: 300; 
  fontSize: 16px;
  line-height: 24px;
  color: #FCFCFC;
  margin-right: 16px;
`
const StyledCardAccent = styled.div<{ isMobile: boolean }>`
  background: linear-gradient(
    180deg, #89FFE3, #FFF174
  );
  border-radius: 16px;
  min-width: ${({ isMobile }) => isMobile ? "312px" : "435px"};
  max-width: ${({ isMobile }) => isMobile ? "312px" : "435px"};
  margin-right: ${({ isMobile }) => isMobile ? "auto" : "80px"};
  margin-top: ${({ isMobile }) => isMobile ? "32px" : "auto"};
  margin-bottom: ${({ isMobile }) => isMobile ? "34px" : "auto"};
  margin-left: ${({ isMobile }) => isMobile ? "auto" : "none"};
  padding: 1px;
  min-height:190px;
`
const LinkDiv = styled.div<{ isMobile: boolean }>`
  background: linear-gradient(90.04deg, #0C0720 0.04%, #291A83 99.97%);
  border-radius: 16px;
  min-width: ${({ isMobile }) => isMobile ? "310px" : "433px"};
  max-width: ${({ isMobile }) => isMobile ? "310px" : "433px"};
  min-height: 188px;
  padding: 32px;
`
const LinkHeader = styled.text`
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 28px;
`
const LinkContent = styled.div`
  margin-top: 24px;
  border-radius: 16px;
  background: #151745;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
`
const StyledDexStatsCard = styled(Card)`
  width: 320px;
  height: 309px;
  text-align: center;
  border-radius: 8px;
  margin-right: 16px;
  margin-bottom: 16px;
  background: #1E215C;
  padding: 30px;
`
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 992px;
  width: 90%;
  margin: 0px auto 70px auto;
  padding: 0px;
`

const Wrapper = styled.div<{ isMobile: boolean, isConnect: string }>`
  display: ${({ isMobile }) => isMobile ? "block" : "flex"};
  justify-content: ${({ isMobile }) => isMobile ? "none" : "space-between"};
  height: ${({ isMobile }) => isMobile ? "410px" : "300px"};
  padding-top: ${({ isMobile, isConnect }) => isMobile ? isConnect ? "15px" : "50px" : "0px"};
`
const Referrals: React.FC = () => {
  useGetDocumentTitlePrice('Referral')
  const TranslateString = useI18n()
  const { account } = useActiveWeb3React()
  const rbsPrice = usePriceRbsBusd().toFixed(2)
  const rbtPrice = usePriceRbtBusd().toFixed(2)
  const referralCode = accountToReferralCode(account)
  const referralLink = `https://robustswap.com/?ref=${referralCode}`
  const referralsCount = useReferralsCount()
  const totalReferralCommissions = useTotalReferralCommissions()
  const isMobile = useMedia('(max-width: 720px)')
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)

  return (
    <>
      <Hero isMobile={isMobile} isConnect={account}>
        {!isMobile && <div style={{ display: 'flex', alignItems: 'center', padding: '18px 48px 16px 40px' }}>
          <div>
            <LogTitle>
              RBS
            </LogTitle>
            <LogPrice>
              ${rbsPrice}
            </LogPrice>
          </div>
          <div style={{ height: '38px', borderRight: '1px solid #E2E9EF', display: 'block' }}>
          </div>
          <div style={{ marginLeft: 16 }}>
            <LogTitle>
              RBT
            </LogTitle>
            <LogPrice>
              ${rbtPrice}
            </LogPrice>
          </div>
        </div>}
        <Wrapper isMobile={isMobile} isConnect={account}>
          <div style={{ display: 'block', marginTop: 'auto', marginBottom: 'auto', minWidth: '327px' }}>
            <StyledHeading isMobile={isMobile}>
              <div>{TranslateString(10006, 'Invite friends.')}</div>
              <div>{TranslateString(10003, 'Earn RBS together.')}</div>
            </StyledHeading>
            <PubTitle isMobile={isMobile}>
              <div>{TranslateString(10007, 'Invite your friends with your referral link and get rewarded from their earnings.')}</div>
            </PubTitle>
            {!account && <UnlockButton variant="primary" title="Get Referral Link" style={{ marginLeft: isMobile ? 24 : 80, marginTop: 16, width: 203 }} />}
          </div>
          {account && <StyledCardAccent isMobile={isMobile}>
            <LinkDiv isMobile={isMobile}>
              <LinkHeader style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>{TranslateString(10009, "Referral Link")}</div>
                {isTooltipDisplayed &&
                  <div style={{ fontSize: 14 }}>
                    Link Copied
                  </div>}
              </LinkHeader>
              <LinkContent>
                <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                  {
                    isMobile ? referralLink.substr(0, 10) + '.../' + referralLink.substr(referralLink.length - 6, 6) :
                      referralLink.substr(0, 18) + '.../' + referralLink.substr(referralLink.length - 6, 6)
                  }
                </Text>
                <Button
                  style={{ background: 'transparent', padding: 0 }}
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(referralLink)
                      setIsTooltipDisplayed(true)
                      setTimeout(() => {
                        setIsTooltipDisplayed(false)
                      }, 1500)
                    }
                  }}>
                  <CopyCircleIcon />
                </Button>
              </LinkContent>
            </LinkDiv>
          </StyledCardAccent>}
        </Wrapper>
      </Hero>
      <Page>
        <Header>
          <Text style={{ fontSize: 34, lineHeight: '40px', letterSpacing: '0.5px', fontWeight: 'bold', color: '#A0B9FB', paddingBottom: 16 }}>
            {account ? TranslateString(999, 'Dashboard') : TranslateString(999, 'How to invite friends')}
          </Text>
        </Header>
        {!account ? <Grid container style={{ justifyContent: 'center' }}>
          <StyledDexStatsCard>
            <img src="/images/referrals/Illu-link.svg" alt="link" width="132px" height="114px" />
            <Text style={{ fontSize: 20, fontWeight: 800 }}>Get a referral link</Text>
            <Text style={{ fontSize: 18, fontStyle: 'normal', fontWeight: 300, color: '#A0B9FB' }}>
              Connect a wallet and generate your referral link
            </Text>
          </StyledDexStatsCard>
          <StyledDexStatsCard>
            <img src="/images/referrals/Illu-send.svg" alt="link" width="132px" height="114px" />
            <Text style={{ fontSize: 20, fontWeight: 800 }}>Invite friends</Text>
            <Text style={{ fontSize: 18, fontStyle: 'normal', fontWeight: 300, color: '#A0B9FB' }}>
              Invite your friends to sign up via your referral link
            </Text>
          </StyledDexStatsCard>
          <StyledDexStatsCard>
            <img src="/images/referrals/Illus-earn.svg" alt="link" width="132px" height="114px" />
            <Text style={{ fontSize: 20, fontWeight: 800 }}>Earn RBS</Text>
            <Text style={{ fontSize: 18, fontStyle: 'normal', fontWeight: 300, color: '#A0B9FB' }}>
              Receive referral rewards in RBS tokens from your friends&apos; earnings
            </Text>
          </StyledDexStatsCard>
        </Grid> :
          <Grid container spacing={3} style={{ /* backgroundColor: isMobile ? 'transparent' : '#1E215C', borderRadius: 8, */ marginTop: 0, maxWidth: 992, width: '90%', marginLeft: 'auto', marginRight: 'auto', marginBottom: 70, justifyContent: 'space-between' }}>
            <Grid item sm={3} xs={12} style={{ padding: 24, backgroundColor: '#1E215C', height: 122, borderRadius: 8, marginBottom: 16 }}>
              <Text style={{ fontSize: 16 }}>{TranslateString(10024, "Your RBS Earnings")}</Text>
              <Text style={{ fontSize: 34, fontWeight: 600, color: '#E354FA' }}>
                {Math.floor(getBalanceNumber(totalReferralCommissions)).toFixed(4)}
              </Text>
            </Grid>
            <Grid item sm={3} xs={12} style={{ padding: 24, backgroundColor: '#1E215C', height: 122, borderRadius: 8, marginBottom: 16 }}>
              <div style={{ width: 115 }}>
                <Text style={{ fontSize: 16 }}>{TranslateString(10010, "Total Referrals")}</Text>
                <Text style={{ fontSize: 34, fontWeight: 600, color: '#E354FA', textAlign: 'center' }}>
                  {referralsCount.toNumber()}
                </Text>
              </div>
            </Grid>
            <Grid item sm={5} xs={12} style={{ padding: 24, wordBreak: 'break-all', backgroundColor: '#1E215C', height: 122, borderRadius: 8, marginBottom: 16 }}>
              <Text style={{ fontSize: 16 }}>{TranslateString(10009, "Referral Link")}</Text>
              <div style={{ display: 'flex' }}>
                <Text style={{ color: '#E354FA', fontSize: 12, maxWidth: 238 }}>
                  {referralLink}
                </Text>
                <Button
                  style={{ background: 'transparent', padding: 0, marginLeft: 8 }}
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(referralLink)
                    }
                  }}>
                  <CopyIcon style={{ width: 24, height: 24 }} />
                </Button>
              </div>
            </Grid>
          </Grid>
        }
        <div>
          {!account && <UnlockWalletNotice />}
        </div>
      </Page>
    </>
  )
}

export default Referrals
