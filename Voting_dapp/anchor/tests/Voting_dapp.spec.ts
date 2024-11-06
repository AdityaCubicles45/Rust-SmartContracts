import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {VotingDapp} from '../target/types/Voting_dapp'

describe('Voting_dapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.VotingDapp as Program<VotingDapp>

  const Voting_dappKeypair = Keypair.generate()

  it('Initialize VotingDapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        Voting_dapp: Voting_dappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([Voting_dappKeypair])
      .rpc()

    const currentCount = await program.account.Voting_dapp.fetch(Voting_dappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment VotingDapp', async () => {
    await program.methods.increment().accounts({ Voting_dapp: Voting_dappKeypair.publicKey }).rpc()

    const currentCount = await program.account.Voting_dapp.fetch(Voting_dappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment VotingDapp Again', async () => {
    await program.methods.increment().accounts({ Voting_dapp: Voting_dappKeypair.publicKey }).rpc()

    const currentCount = await program.account.Voting_dapp.fetch(Voting_dappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement VotingDapp', async () => {
    await program.methods.decrement().accounts({ Voting_dapp: Voting_dappKeypair.publicKey }).rpc()

    const currentCount = await program.account.Voting_dapp.fetch(Voting_dappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set Voting_dapp value', async () => {
    await program.methods.set(42).accounts({ Voting_dapp: Voting_dappKeypair.publicKey }).rpc()

    const currentCount = await program.account.Voting_dapp.fetch(Voting_dappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the Voting_dapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        Voting_dapp: Voting_dappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.Voting_dapp.fetchNullable(Voting_dappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
