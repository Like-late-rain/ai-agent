// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TravelCheckStaking
 * @dev Staking contract for TravelCheck platform
 * Supports two stake types: daily and attraction
 * Two modes: sealed (higher rewards, locked) and anytime (lower rewards, flexible)
 */
contract TravelCheckStaking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable tckToken;

    enum StakeType { DAILY, ATTRACTION }
    enum StakeMode { SEALED, ANYTIME }
    enum StakeStatus { ACTIVE, COMPLETED, WITHDRAWN }

    struct Stake {
        address user;
        StakeType stakeType;
        uint256 amount;
        uint256 milestone;  // in days
        StakeMode mode;
        uint256 checkedDays;
        bool isPerfect;
        uint256 accumulatedInterest;
        StakeStatus status;
        uint256 startTime;
        uint256 endTime;
        uint256 completedAt;
        uint256 withdrawnAt;
    }

    // Interest rates (basis points, 1% = 100)
    mapping(uint256 => uint256) public sealedRates;  // milestone => rate
    mapping(uint256 => uint256) public anytimeRates; // milestone => rate

    // Staking data
    mapping(uint256 => Stake) public stakes;
    mapping(address => uint256[]) public userStakes;
    uint256 public nextStakeId;

    // Constants
    uint256 public constant MIN_STAKE_AMOUNT = 1 * 10**18;      // 1 TCK
    uint256 public constant MAX_STAKE_AMOUNT = 1000 * 10**18;   // 1000 TCK
    uint256 public constant BASIS_POINTS = 10000;                // 100% = 10000

    // Events
    event StakeCreated(
        uint256 indexed stakeId,
        address indexed user,
        StakeType stakeType,
        uint256 amount,
        uint256 milestone,
        StakeMode mode
    );
    event CheckedIn(uint256 indexed stakeId, uint256 checkedDays);
    event InterestCalculated(uint256 indexed stakeId, uint256 interest);
    event StakeWithdrawn(uint256 indexed stakeId, uint256 totalAmount);

    /**
     * @dev Constructor
     * @param _tckToken Address of TCK token contract
     * @param initialOwner Address to receive ownership
     */
    constructor(address _tckToken, address initialOwner) Ownable(initialOwner) {
        require(_tckToken != address(0), "Invalid token address");
        tckToken = IERC20(_tckToken);

        // Set interest rates (sealed mode)
        sealedRates[30] = 500;   // 5%
        sealedRates[100] = 800;  // 8%
        sealedRates[200] = 1400; // 14%
        sealedRates[365] = 2000; // 20%

        // Set interest rates (anytime mode - half of sealed)
        anytimeRates[30] = 250;   // 2.5%
        anytimeRates[100] = 400;  // 4%
        anytimeRates[200] = 700;  // 7%
        anytimeRates[365] = 1000; // 10%
    }

    /**
     * @dev Create a new stake
     * @param stakeType Type of stake (DAILY or ATTRACTION)
     * @param amount Amount of TCK tokens to stake
     * @param milestone Duration in days (30, 100, 200, or 365)
     * @param mode Stake mode (SEALED or ANYTIME)
     */
    function createStake(
        StakeType stakeType,
        uint256 amount,
        uint256 milestone,
        StakeMode mode
    ) external nonReentrant returns (uint256) {
        require(amount >= MIN_STAKE_AMOUNT, "Amount too low");
        require(amount <= MAX_STAKE_AMOUNT, "Amount too high");
        require(
            milestone == 30 || milestone == 100 || milestone == 200 || milestone == 365,
            "Invalid milestone"
        );

        // Transfer tokens from user
        tckToken.safeTransferFrom(msg.sender, address(this), amount);

        // Create stake
        uint256 stakeId = nextStakeId++;
        stakes[stakeId] = Stake({
            user: msg.sender,
            stakeType: stakeType,
            amount: amount,
            milestone: milestone,
            mode: mode,
            checkedDays: 0,
            isPerfect: true,
            accumulatedInterest: 0,
            status: StakeStatus.ACTIVE,
            startTime: block.timestamp,
            endTime: block.timestamp + (milestone * 1 days),
            completedAt: 0,
            withdrawnAt: 0
        });

        userStakes[msg.sender].push(stakeId);

        emit StakeCreated(stakeId, msg.sender, stakeType, amount, milestone, mode);
        return stakeId;
    }

    /**
     * @dev Check in for a stake
     * @param stakeId ID of the stake
     */
    function checkIn(uint256 stakeId) external {
        Stake storage stake = stakes[stakeId];
        require(stake.user == msg.sender, "Not stake owner");
        require(stake.status == StakeStatus.ACTIVE, "Stake not active");

        stake.checkedDays++;
        emit CheckedIn(stakeId, stake.checkedDays);

        // Calculate and update interest
        uint256 interest = calculateInterest(stakeId);
        stake.accumulatedInterest = interest;
        emit InterestCalculated(stakeId, interest);

        // Check if milestone completed
        if (stake.checkedDays >= stake.milestone) {
            stake.status = StakeStatus.COMPLETED;
            stake.completedAt = block.timestamp;
        }
    }

    /**
     * @dev Mark stake as not perfect (missed check-in)
     * @param stakeId ID of the stake
     */
    function markImperfect(uint256 stakeId) external onlyOwner {
        Stake storage stake = stakes[stakeId];
        stake.isPerfect = false;
    }

    /**
     * @dev Calculate interest for a stake
     * @param stakeId ID of the stake
     * @return Calculated interest amount
     */
    function calculateInterest(uint256 stakeId) public view returns (uint256) {
        Stake memory stake = stakes[stakeId];

        // Get appropriate interest rate
        uint256 rate = stake.mode == StakeMode.SEALED
            ? sealedRates[stake.milestone]
            : anytimeRates[stake.milestone];

        // Calculate base interest
        uint256 progress = (stake.checkedDays * BASIS_POINTS) / stake.milestone;
        uint256 interest = (stake.amount * rate * progress) / (BASIS_POINTS * BASIS_POINTS);

        // Apply 50% penalty if not perfect and sealed mode
        if (!stake.isPerfect && stake.mode == StakeMode.SEALED) {
            interest = interest / 2;
        }

        return interest;
    }

    /**
     * @dev Withdraw stake and interest
     * @param stakeId ID of the stake
     */
    function withdraw(uint256 stakeId) external nonReentrant {
        Stake storage stake = stakes[stakeId];
        require(stake.user == msg.sender, "Not stake owner");
        require(stake.status != StakeStatus.WITHDRAWN, "Already withdrawn");

        // Check withdrawal conditions
        if (stake.mode == StakeMode.SEALED) {
            require(stake.status == StakeStatus.COMPLETED, "Stake not completed");
        }

        // Calculate final interest
        uint256 finalInterest = calculateInterest(stakeId);
        uint256 totalAmount = stake.amount + finalInterest;

        // Update state
        stake.status = StakeStatus.WITHDRAWN;
        stake.withdrawnAt = block.timestamp;
        stake.accumulatedInterest = finalInterest;

        // Transfer tokens
        tckToken.safeTransfer(msg.sender, totalAmount);

        emit StakeWithdrawn(stakeId, totalAmount);
    }

    /**
     * @dev Get user's stake IDs
     * @param user User address
     * @return Array of stake IDs
     */
    function getUserStakes(address user) external view returns (uint256[] memory) {
        return userStakes[user];
    }

    /**
     * @dev Get stake details
     * @param stakeId ID of the stake
     * @return Stake struct
     */
    function getStake(uint256 stakeId) external view returns (Stake memory) {
        return stakes[stakeId];
    }

    /**
     * @dev Emergency withdraw (only owner)
     * @param token Token address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }
}
