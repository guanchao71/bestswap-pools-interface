import { useCallback, useMemo } from 'react'
import { provider } from 'web3-core'

// import useSushi from './useSushi'
import { useWallet } from 'use-wallet'

// import { stake, getMasterChefContract } from '../sushi/utils'
import useFarm from './useFarm'
import { getContract } from '../utils/pool'
import BigNumber from 'bignumber.js'

const useStake = (pid: number) => {
  const { account, ethereum } = useWallet()
  const farm = useFarm(pid)

  const contract = useMemo(() => {
    return getContract(ethereum as provider, farm.poolAddress)
  }, [ethereum, farm])

  const handleStake = useCallback(
    async (amount: string) => {
      console.log('handle stake');
      const value = new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()

      const call = !farm.isWBNB
        ? contract.methods.stake(value).send({ from: account })
        : contract.methods.stake().send({ from: account, value })

      const txHash = call.on('transactionHash', (tx: any) => {
        console.log(tx)
        return tx.transactionHash
      })
      console.log(txHash)
    },
    [account, contract, farm],
  )

  const handleStakeWithRef = useCallback(
    async (amount: string, addr: string) => {
      console.log('handle stake ref');
      console.log('amount', amount)
      console.log('amount', addr)
      const value = new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()

      const call = !farm.isWBNB
        ? contract.methods.stakeWithRef(value, addr).send({ from: account })
        : contract.methods.stakeWithRef(addr).send({ from: account, value })

      const txHash = call.on('transactionHash', (tx: any) => {
        console.log(tx)
        return tx.transactionHash
      })
      console.log(txHash)
    },
    [account, contract, farm],
  )

  return { onStake: handleStake, onStakeWithRef: handleStakeWithRef }
}

export default useStake
