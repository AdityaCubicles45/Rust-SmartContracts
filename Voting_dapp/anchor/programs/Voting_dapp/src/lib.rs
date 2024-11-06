#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod Voting_dapp {
    use super::*;

  pub fn close(_ctx: Context<CloseVotingDapp>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.Voting_dapp.count = ctx.accounts.Voting_dapp.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.Voting_dapp.count = ctx.accounts.Voting_dapp.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeVotingDapp>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.Voting_dapp.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeVotingDapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + VotingDapp::INIT_SPACE,
  payer = payer
  )]
  pub Voting_dapp: Account<'info, VotingDapp>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseVotingDapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub Voting_dapp: Account<'info, VotingDapp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub Voting_dapp: Account<'info, VotingDapp>,
}

#[account]
#[derive(InitSpace)]
pub struct VotingDapp {
  count: u8,
}
