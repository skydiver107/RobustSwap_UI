import styled from 'styled-components'

const FlexLayout = styled.div<{ isMobile: boolean }>`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 90%;
  max-width: 980px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: ${({ isMobile }) => isMobile ? "40px" : "32px"};
  & > * {
    min-width: 310px;
    max-width: 31.5%;
    width: 100%;
    margin: 0 8px;
    margin-bottom: 32px;
  }
`

export default FlexLayout
