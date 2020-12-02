import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import Label from '../../../components/Label'
import Spacer from '../../../components/Spacer'
import Value from '../../../components/Value'
import useAllEarnings from '../../../hooks/useAllEarnings'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useAllStakedValue from '../../../hooks/useAllStakedValue'
import useTotalLPSupply from '../../../hooks/useTotalLPSupply'
import useFarms from '../../../hooks/useFarms'
import useTokenPrice from '../../../hooks/useTokenPrice'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useKira from '../../../hooks/useKira'
import { getKiraAddress, getKiraStakingAddress, getKiraStakingContract, getRewardRate } from '../../../kira/utils'
import { getBalanceNumber } from '../../../utils/formatBalance'
import Kira_Img from '../../../assets/img/kira.png'
import { checkPropTypes } from 'prop-types'

const PendingRewards: React.FC = () => {
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(0)
  const [scale, setScale] = useState(1)

  const allEarnings = useAllEarnings()
  let sumEarning = 0
  for (let earning of allEarnings) {
    sumEarning += new BigNumber(earning)
      .div(new BigNumber(10).pow(18))
      .toNumber()
  }

  const [farms] = useFarms()
  const allStakedValue = useAllStakedValue()

  if (allStakedValue && allStakedValue.length) {
    const sumWeth = farms.reduce(
      (c, { id }, i) => c + (allStakedValue[i].totalWethValue.toNumber() || 0),
      0,
    )
  }

  useEffect(() => {
    setStart(end)
    setEnd(sumEarning)
  }, [sumEarning])

  return (
    <span
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'right bottom',
        transition: 'transform 0.5s',
        display: 'inline-block',
      }}
    >
      <CountUp
        start={start}
        end={end}
        decimals={end < 0 ? 4 : end > 1e5 ? 0 : 3}
        duration={1}
        onStart={() => {
          setScale(1.25)
          setTimeout(() => setScale(1), 600)
        }}
        separator=","
      />
    </span>
  )
}

const Balances: React.FC = () => {
  const kira = useKira()
  const { account }: { account: any; ethereum: any } = useWallet()
  const [rewardPerSecond, setRewardPerSecond] = useState(new BigNumber(0))
  const [ROI, setROI] = useState(new BigNumber(0))

  const kexBalanceInContract = useTokenBalance(getKiraAddress(kira), getKiraStakingAddress(kira))
  const [valueOfLockedAssets, setValueOfLockedAssets] = useState(new BigNumber(0))

  const kiraStakingContract = getKiraStakingContract(kira)
  const totalLPSupply = useTotalLPSupply(account)
  const stakedBalance = useStakedBalance(0)
  const tokenPrice = useTokenPrice()

  useEffect(() => {
    setValueOfLockedAssets(kexBalanceInContract.multipliedBy(tokenPrice.KEX))
  }, [tokenPrice, kexBalanceInContract])

  useEffect(() => {
    async function fetchTotalSupply() {
      const reward = await getRewardRate(kiraStakingContract)
      setRewardPerSecond(reward)
    }
    if (kira) {
      fetchTotalSupply()
    }
  }, [kira, setRewardPerSecond])

  // GET ROI PER MONTH
  useEffect(() => {
    if (totalLPSupply.toNumber() > 0) {
      setROI(stakedBalance.dividedBy(totalLPSupply).multipliedBy(rewardPerSecond).multipliedBy(3600 * 24 * 30))
    }
  }, [stakedBalance, totalLPSupply, rewardPerSecond])

  return (
    <StyledWrapper>
      <Card>
        <CardContent>
          <StyledCardContainer>
            <Label text="User Information" weight={600} size={20}/>
            <Spacer size="sm"/>

            <StyledInfoContainer>
              <Label text="Your ROI per month" color='#333333'/>
              <StyledInfoValue>
                <Value
                  value={!!account ? getBalanceNumber(ROI): 'Locked'}
                />
                {account ? <Label text="KEX"/> : null}
              </StyledInfoValue>
            </StyledInfoContainer>
          </StyledCardContainer>
        </CardContent>
        <Footnote>
          Rewards per second
          <FootnoteValue>{getBalanceNumber(rewardPerSecond)} KEX</FootnoteValue>
        </Footnote>
      </Card>
      <Spacer />

      <Card>
        <CardContent>
          <StyledCardContainer>
            <Label text="Pool Information" weight={600} size={20}/>
            <Spacer size="sm"/>

            <StyledInfoContainer>
              <Label text="Value of Locked Assets" color='#333333'/>
              <StyledInfoValue>
                {account ? <Label text="$"/> : null}
                <Value
                  value={!!account ? getBalanceNumber(valueOfLockedAssets) : 'Locked'}
                />
              </StyledInfoValue>
            </StyledInfoContainer>

            <StyledInfoContainer>
              <Label text="Total Circulating LP Token" color='#333333'/>
              <StyledInfoValue>
                <Value
                  value={!!account ? getBalanceNumber(totalLPSupply, 18) : 'Locked'}
                />
              </StyledInfoValue>
            </StyledInfoContainer>
          </StyledCardContainer>
        </CardContent>
        <Footnote>
          Pending harvest
          <FootnoteValue>
            <PendingRewards /> KEX
          </FootnoteValue>
        </Footnote>
      </Card>
    </StyledWrapper>
  )
}

const Footnote = styled.div`
  font-size: 14px;
  padding: 8px 20px;
  color: ${(props) => props.theme.color.purple[400]};
  border-top: solid 1px ${(props) => props.theme.color.purple[300]};
`
const FootnoteValue = styled.div`
  font-family: 'Roboto Mono', monospace;
  float: right;
`

const StyledWrapper = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: stretch;
  }
`

const StyledCardContainer = styled.div`
  flex: 1
`

const StyledInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledInfoValue = styled.div`
  font-size: 20px;
  font-weight: 300;
  color: ${(props) => props.theme.color.purple[500]};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`
export default Balances