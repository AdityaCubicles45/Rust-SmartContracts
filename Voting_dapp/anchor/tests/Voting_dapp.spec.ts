import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {VotingDapp} from '../target/types/voting_dapp'
import { BankrunProvider, startAnchor } from "anchor-bankrun";

const IDL = require('../target/idl/voting_dapp.json');

const votingAddress = new PublicKey("NaMyQYJ2vYFUDZbGNV1NfJ335fq8uUUcfP19NT9sZLA");


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
  
  it('initialize poll', async () => {
    // Call the `initializePoll` method on the votingProgram to create a new poll
    await votingProgram.methods.initializePoll(
      new anchor.BN(1),         // poll_id
      "What is your favorite type of hamburger?", // description
      new anchor.BN(0), // poll_start
      new anchor.BN(1830002472),          // poll_end
    ).rpc(); // Sends this transaction as an RPC call to the Solana blockchain

    // Derive the poll's public address using `poll_id` as a seed
    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)], // Convert `poll_id` to a buffer and use it as a seed
      votingAddress // The program's public key
    );

    // Fetch the poll account data from the blockchain
    const poll = await votingProgram.account.poll.fetch(pollAddress);
    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("What is your favorite type of hamburger?");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
  })

  it("initialize candidate", async() => {
    await votingProgram.methods.initializeCandidate(
      "Smooth",
      new anchor.BN(1),
    ).rpc();
    await votingProgram.methods.initializeCandidate(
      "Crunchy",
      new anchor.BN(1),
    ).rpc();

    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Crunchy")],
      votingAddress,
    );
    const crunchyCandidate = await votingProgram.account.candidate.fetch(crunchyAddress);
    console.log(crunchyCandidate);
    expect(crunchyCandidate.candidateVotes.toNumber()).toEqual(0);

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Smooth")],
      votingAddress,
    );
    const smoothCandidate = await votingProgram.account.candidate.fetch(smoothAddress);
    console.log(smoothCandidate);
    expect(smoothCandidate.candidateVotes.toNumber()).toEqual(0);

  })

  it("vote", async () => {

  });
});


