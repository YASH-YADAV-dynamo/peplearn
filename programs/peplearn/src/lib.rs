use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_program;

declare_id!("PvAJYKTn9Xw7FpVSMhBGNRgnsYK4uZMcFUp6VFKahmv");

#[program]
mod sol_reward {
    use super::*;

    const REWARD_AMOUNT: u64 = 50_000_000; // 0.05 SOL (50 million lamports)

    // Function 1: Deposit 0.05 SOL into the program account
    pub fn deposit(ctx: Context<Deposit>) -> Result<()> {
        let vault_info = &ctx.accounts.vault;
        let user_info = &ctx.accounts.user;
        let system_program_info = &ctx.accounts.system_program;
        
        // If vault is empty, ensure PDA exists (create it)
        if vault_info.to_account_info().lamports() == 0 {
            let rent_lamports = Rent::get()?.minimum_balance(0);
            invoke(
                &system_instruction::create_account(
                    user_info.key,      // Payer
                    vault_info.key,     // Vault PDA
                    rent_lamports,      // Rent exemption
                    0,                  // Space (0 because we are only storing SOL)
                    &crate::ID,         // Program ID (should be this program)
                ),
                &[
                    user_info.to_account_info(),
                    vault_info.to_account_info(),
                    system_program_info.to_account_info(),
                ],
            )?;
        }

        // Transfer SOL to the vault
        let ix = system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.vault.key(),
            REWARD_AMOUNT,
        );

        invoke(
            &ix,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.vault.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;
        
        msg!("User deposited 0.05 SOL into the program vault");
        Ok(())
    }

    // Function 2: Withdraw 0.05 SOL from the vault to the user's wallet
    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        let vault_balance = ctx.accounts.vault.to_account_info().lamports();
        require!(vault_balance >= REWARD_AMOUNT, ErrorCode::InsufficientFunds);

        **ctx.accounts.vault.to_account_info().try_borrow_mut_lamports()? -= REWARD_AMOUNT;
        **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? += REWARD_AMOUNT;
        
        msg!("User received 0.05 SOL reward");
        Ok(())
    }
}

// Deposit Context
#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: This is a program vault (PDA)
    #[account(
        mut, 
        seeds = [b"vault"], 
        bump
    )]
    pub vault: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

// Withdraw Context
#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: This is a program vault (PDA)
    #[account(
        mut, 
        seeds = [b"vault"], 
        bump
    )]
    pub vault: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>, // ✅ Added this
}
  
#[error_code]
pub enum ErrorCode {
    #[msg("Not enough funds in the vault.")]
    InsufficientFunds,
}
