import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {VotingDapp} from '../target/types/Voting_dapp'
import { BankrunProvider, startAnchor } from "anchor-bankrun";

const IDL = require('../target/idl/voting_dapp.json');

const votingAddress = new PublicKey("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");


describe('Voting', () => {
  
  it('Initialize Poll', async () => {
    const context = await startAnchor("", [{name: "voting", programId: votingAddress}], []);
	  const provider = new BankrunProvider(context);

    const votingProgram = new Program<VotingDapp>(
      IDL,
      provider,
    );

    await votingProgram.methods.initializePoll(
      new anchor.BN(1) as anchor.BN,                    
      "What is your favorite type of smartphone?" as string,
      new anchor.BN(0) as anchor.BN,                     
      new anchor.BN(1830925334) as anchor.BN             
    ).rpc();
    
    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingAddress,
    );

    const poll = await votingProgram.account.poll.fetch(pollAddress);

    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("What is your favorite type of smartphone?");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());

  });
});


