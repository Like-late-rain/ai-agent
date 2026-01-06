// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TravelCheckToken
 * @dev ERC20 token for TravelCheck platform
 * Symbol: TCK
 * Decimals: 18
 * Initial Supply: 1,000,000,000 TCK
 */
contract TravelCheckToken is ERC20, ERC20Burnable, Ownable {
    /**
     * @dev Constructor mints initial supply to deployer
     * @param initialOwner Address to receive initial supply and ownership
     */
    constructor(address initialOwner)
        ERC20("TravelCheck Token", "TCK")
        Ownable(initialOwner)
    {
        // Mint 1 billion tokens (1,000,000,000 * 10^18)
        _mint(initialOwner, 1_000_000_000 * 10 ** decimals());
    }

    /**
     * @dev Mint new tokens (only owner)
     * @param to Address to receive minted tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Override decimals to use 18 decimals (standard)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
