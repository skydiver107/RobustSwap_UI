import React, { useEffect, useState, useLayoutEffect } from 'react'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, Text, Toggle, Button, Input } from '@robustswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { setWith } from 'lodash';
import Cookies from 'js-cookie';

const FarmTabButtons = ({ stakedOnly, setStakedOnly, viewMode, setViewMode, filter, setFilter, sort, setSort, isMobile }) => {
  const { url, isExact } = useRouteMatch()
  const TranslateString = useI18n()
  const [wth, setWth] = useState(window.innerWidth)
  const [min1, setMin1] = useState(document.getElementsByClassName("sc-lcujXC keHIjv")[0]?.clientWidth)
  const [min2, setMin2] = useState(document.getElementsByClassName("sc-lcujXC dGGJWA")[0]?.clientWidth)
  useEffect(() => {
    if (min1 !== document.getElementsByClassName("sc-lcujXC keHIjv")[0]?.clientWidth)
      setMin1(document.getElementsByClassName("sc-lcujXC keHIjv")[0]?.clientWidth)
    else if (min2 !== document.getElementsByClassName("sc-lcujXC dGGJWA")[0]?.clientWidth)
      setMin2(document.getElementsByClassName("sc-lcujXC dGGJWA")[0]?.clientWidth)
    else
      setWth(window.innerWidth - (min1 ? min1 : 0) - (min2 ? min2 : 0) - 100)
  }, [min1, min2, wth, isMobile])

  const handleChangeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSort(event.target.value as number);
  };
  return (
    <Wrapper isMobile={isMobile} style={{ width: Math.floor(wth / 330) * 330, maxWidth: 980, minWidth: 320 }}>
      <Flex style={{ paddingBottom: isMobile ? '16px' : 0 }}>
        {!isMobile &&
          <>
            <StyledButton onClick={() => {
              setViewMode(false)
              Cookies.set('viewMode', false)
            }}>
              {viewMode ?
                <img src="/images/icon-list.svg" alt="icon list" width="32px" height="32px" /> :
                <img src="/images/icon-list-active.svg" alt="icon list" width="32px" height="32px" />
              }
            </StyledButton>
            <StyledButton onClick={() => {
              setViewMode(true)
              Cookies.set('viewMode', true)
            }} style={{ marginRight: 28 }}>
              {viewMode ?
                <img src="/images/icon-card-active.svg" alt="icon card" width="32px" height="32px" /> :
                <img src="/images/icon-card.svg" alt="icon card" width="32px" height="32px" />
              }
            </StyledButton>
          </>}
        <ButtonMenu activeIndex={isExact ? 0 : 1} size="sm" variant="subtle">
          <ButtonMenuItem as={Link} to={`${url}`} style={{ borderRadius: 0, width: 67 }}>
            {TranslateString(601, 'Live')}
          </ButtonMenuItem>
          <ButtonMenuItem as={Link} to={`${url}/history`} style={{ borderRadius: 0, width: 108 }}>
            {TranslateString(599, 'Finished')}
          </ButtonMenuItem>
        </ButtonMenu>
        <ToggleWrapper>
          <Toggle scale="sm" checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} />
          <Text style={{ color: '#7381FC', fontSize: isMobile ? '14px' : '16px' }}> {TranslateString(699, 'Staked only')}</Text>
        </ToggleWrapper>
      </Flex>
      <Flex>
        <Input
          id="search"
          name="search-card"
          type="text"
          placeholder={TranslateString(10011, 'Search')}
          style={{ maxWidth: 170, marginRight: 8 }}
          value={filter}
          onChange={(e) => setFilter(e.currentTarget.value)}
        // isWarning={error}
        // disabled={isloading}
        />
        <Select
          value={sort}
          onChange={handleChangeSelect}
          style={{
            borderRadius: 8,
            background: "rgba(30, 33, 92, 1)",
            paddingLeft: "16px",
            width: '100%',
            // border: '1px solid rgba(107, 161, 255, 0.2)',
            height: 40,
            color: '#7381FC',
            fontSize: 14,
            fontWeight: 500,
            backgroundColor: '#1E215C'
          }}
          IconComponent={
            () => (<ArrowDropDownIcon style={{ color: "#7381FC" }} />)
          }
          disableUnderline
        >
          <StyledMenuItem value={1}>{TranslateString(395, 'HOT')}</StyledMenuItem>
          <StyledMenuItem value={2}>{TranslateString(457, 'Multiplier')}</StyledMenuItem>
          <StyledMenuItem value={3}>{TranslateString(352, 'APR')}</StyledMenuItem>
          <StyledMenuItem value={4}>{TranslateString(686, 'Liquidity')}</StyledMenuItem>
          <StyledMenuItem value={5}>{TranslateString(331, 'Earned')}</StyledMenuItem>
        </Select>
      </Flex>
    </Wrapper>
  )
}

export default FarmTabButtons

const Wrapper = styled.div<{ isMobile: boolean }>`
  display: ${({ isMobile }) => isMobile ? 'block' : 'flex'};
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
  margin-left: auto;
  margin-right: auto;
  padding: ${({ isMobile }) => isMobile ? '0px 0px' : '0px 8px'};
`

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 16px;
  ${Text} {
    margin-left: 16px;
  }
`

const StyledButton = styled(Button)`
  padding: 0px 0px;
  width: 32px;
  height: 32px;
  margin-right: 16px;
  background: transparent;
`
const Flex = styled.div`
  display: flex;
  align-items: center;
`

const StyledMenuItem = styled(MenuItem)`
  color: #7381FC;
`