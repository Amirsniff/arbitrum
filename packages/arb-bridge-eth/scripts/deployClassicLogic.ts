import { Signer } from '@ethersproject/abstract-signer'
import hre from 'hardhat'
import {
  RollupAdminFacet__factory,
  RollupUserFacet__factory,
  Bridge__factory,
  Inbox__factory,
  SequencerInbox__factory,
} from '../build/types'

if (!process.env['ETHERSCAN_API_KEY'])
  throw new Error('Please set ETHERSCAN_API_KEY')

const main = async () => {
  const accounts: Signer[] = await hre.ethers.getSigners()

  const RollupAdmin = new RollupAdminFacet__factory(accounts[0])
  const RollupUser = new RollupUserFacet__factory(accounts[0])
  const Bridge = new Bridge__factory(accounts[0])
  const Inbox = new Inbox__factory(accounts[0])
  const SequencerInbox = new SequencerInbox__factory(accounts[0])

  console.log('deploying rollup admin')
  const rollupAdmin = await RollupAdmin.deploy()
  await rollupAdmin.deployed()
  console.log(rollupAdmin.address)

  await hre.run('verify:verify', {
    address: rollupAdmin.address,
    constructorArguments: [],
  })

  console.log('deploying rollup user')
  const rollupUser = await RollupUser.deploy()
  await rollupUser.deployed()
  console.log(rollupUser.address)

  await hre.run('verify:verify', {
    address: rollupUser.address,
    constructorArguments: [],
  })

  console.log('init rollup user')
  const initRU = await rollupUser.initialize(hre.ethers.constants.AddressZero)
  await initRU.wait()

  console.log('deploying bridge')
  const bridge = await Bridge.deploy()
  await bridge.deployed()
  console.log(bridge.address)

  await hre.run('verify:verify', {
    address: bridge.address,
    constructorArguments: [],
  })

  console.log('init bridge')
  const initBridge = await bridge.initialize()
  await initBridge.wait()

  console.log('deploying inbox')
  const inbox = await Inbox.deploy()
  await inbox.deployed()
  console.log(inbox.address)

  await hre.run('verify:verify', {
    address: inbox.address,
    constructorArguments: [],
  })

  console.log('init inbox')
  const initInbox = await inbox.initialize(
    hre.ethers.constants.AddressZero,
    hre.ethers.constants.AddressZero
  )
  await initInbox.wait()

  console.log('deploying sequencer inbox')
  const sequencerInbox = await SequencerInbox.deploy()
  await sequencerInbox.deployed()
  console.log(sequencerInbox.address)

  await hre.run('verify:verify', {
    address: sequencerInbox.address,
    constructorArguments: [],
  })

  console.log('init seq inbox')
  const initSeqInbox = await sequencerInbox.initialize(
    hre.ethers.constants.AddressZero,
    hre.ethers.constants.AddressZero,
    hre.ethers.constants.AddressZero
  )
  await initSeqInbox.wait()
}

main()
  .then(() => console.log('done'))
  .catch(err => {
    console.error('error')
    console.error(err)
  })
