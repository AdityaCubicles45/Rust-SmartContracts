import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {VotingDapp} from '../target/types/Voting_dapp'
import { BankrunProvider, startAnchor } from "anchor-bankrun";

const IDL = require('../target/idl/voting_dapp.json');

const votingAddress = new PublicKey("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");


describe('Voting', () => {

  let context;
  let provider;
  let votingProgram: anchor.Program<VotingDapp>;

  beforeAll( async () => {
    context = await startAnchor("", [{name: "voting", programId: votingAddress}], []);
    provider = new BankrunProvider(context);

    votingProgram = new Program<VotingDapp>(
      IDL,
      provider,
    );

  })
  
  it('Initialize Poll', async () => {
    await votingProgram.methods.initializePoll(
      new anchor.BN(1),                 
      "What is your favorite type of smartphone?",
      new anchor.BN(0),                     
      new anchor.BN(1830925334),             
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

  it("initialize candidate", async () => {
    await votingProgram.methods.initializeCandidate(
      "iPhone",
      new anchor.BN(1),                 
    ).rpc();

    await votingProgram.methods.initializeCandidate(
      "Samsung",
      new anchor.BN(1),                 
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(0).toArrayLike(Buffer, 'le', 8)],
      votingAddress,
    );

    const poll = await votingProgram.account.poll.fetch(pollAddress);

    console.log(poll);

    expect(poll.candidates[0].name).toEqual("iPhone");
    expect(poll.candidates[1].name).toEqual("Samsung");

  });

  it("vote", async () => {

  });
});


