/**
 * @file Wallet State Management
 * @description Jotai atoms for managing wallet connection and balance
 */

import { getNonce, verifySignature } from '@/services/auth.service'
import { formatAddress, formatAmount } from '@/utils/format'
import { getBalance, connectWallet as web3ConnectWallet, signMessage } from '@/utils/web3'
import { atom } from 'jotai'
import { setUserAtom } from './user.atom'

/**
 * Wallet state interface
 */
export interface WalletState {
  /** Wallet address */
  address: string | null
  /** Wallet balance in ETH */
  balance: string
  /** Connection status */
  isConnected: boolean
  /** Connection in progress */
  isConnecting: boolean
}

/**
 * Base wallet atom
 */
export const walletAtom = atom<WalletState>({
  address: null,
  balance: '0',
  isConnected: false,
  isConnecting: false,
})

/**
 * Derived atom for formatted wallet address
 *
 * @example
 * const formattedAddress = useAtomValue(formattedAddressAtom)
 * // Returns: '0x1234...5678' or 'Not Connected'
 */
export const formattedAddressAtom = atom((get) => {
  const wallet = get(walletAtom)
  return wallet.address ? formatAddress(wallet.address) : 'Not Connected'
})

/**
 * Derived atom for formatted wallet balance
 *
 * @example
 * const formattedBalance = useAtomValue(formattedBalanceAtom)
 * // Returns: '1.50 ETH'
 */
export const formattedBalanceAtom = atom((get) => {
  const wallet = get(walletAtom)
  const balanceNum = Number.parseFloat(wallet.balance)
  return `${formatAmount(balanceNum, 4)} ETH`
})

/**
 * Action atom to connect wallet
 *
 * @example
 * const connectWallet = useSetAtom(connectWalletAtom)
 * await connectWallet()
 */
export const connectWalletAtom = atom(null, async (get, set) => {
  const currentWallet = get(walletAtom)

  // Prevent multiple simultaneous connection attempts
  if (currentWallet.isConnecting) {
    return
  }

  set(walletAtom, {
    ...currentWallet,
    isConnecting: true,
  })

  try {
    // Step 1: Connect to MetaMask
    const address = await web3ConnectWallet()
    const balance = await getBalance(address)

    // Step 2: Get nonce from backend
    const { nonce, message } = await getNonce(address)

    // Step 3: Sign message with nonce
    const signature = await signMessage(message)

    // Step 4: Verify signature and get user data
    const { user, token } = await verifySignature(address, signature, nonce)

    // Step 5: Update wallet and user state
    set(walletAtom, {
      address,
      balance,
      isConnected: true,
      isConnecting: false,
    })

    set(setUserAtom, user)

    console.log('Wallet connected and authenticated:', { address, token })
  } catch (error) {
    set(walletAtom, {
      address: null,
      balance: '0',
      isConnected: false,
      isConnecting: false,
    })
    throw error
  }
})

/**
 * Action atom to disconnect wallet
 *
 * @example
 * const disconnectWallet = useSetAtom(disconnectWalletAtom)
 * disconnectWallet()
 */
export const disconnectWalletAtom = atom(null, async (_get, set) => {
  // Import clearUserAtom dynamically to avoid circular dependency
  const { clearUserAtom } = await import('./user.atom')

  set(walletAtom, {
    address: null,
    balance: '0',
    isConnected: false,
    isConnecting: false,
  })

  set(clearUserAtom)
})

/**
 * Action atom to refresh wallet balance
 *
 * @example
 * const refreshBalance = useSetAtom(refreshBalanceAtom)
 * await refreshBalance()
 */
export const refreshBalanceAtom = atom(null, async (get, set) => {
  const wallet = get(walletAtom)

  if (!wallet.address) {
    return
  }

  try {
    const balance = await getBalance(wallet.address)
    set(walletAtom, {
      ...wallet,
      balance,
    })
  } catch (error) {
    console.error('Failed to refresh balance:', error)
  }
})

/**
 * Action atom to update wallet address
 *
 * @example
 * const updateAddress = useSetAtom(updateWalletAddressAtom)
 * await updateAddress('0x1234...')
 */
export const updateWalletAddressAtom = atom(null, async (get, set, address: string) => {
  const wallet = get(walletAtom)

  try {
    const balance = await getBalance(address)
    set(walletAtom, {
      ...wallet,
      address,
      balance,
      isConnected: true,
    })
  } catch (error) {
    console.error('Failed to update wallet address:', error)
  }
})
