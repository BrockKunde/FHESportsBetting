// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title RateLimiter
 * @dev Contract module for implementing rate limiting (DoS protection)
 */
abstract contract RateLimiter {
    // Mapping from address to last action timestamp
    mapping(address => uint256) private _lastActionTime;

    // Minimum time between actions (in seconds)
    uint256 private _actionCooldown;

    event CooldownUpdated(uint256 oldCooldown, uint256 newCooldown);

    constructor(uint256 cooldown) {
        _actionCooldown = cooldown;
    }

    /**
     * @dev Modifier to enforce rate limiting
     */
    modifier rateLimit() {
        require(
            block.timestamp >= _lastActionTime[msg.sender] + _actionCooldown,
            "RateLimiter: action too frequent"
        );
        _lastActionTime[msg.sender] = block.timestamp;
        _;
    }

    /**
     * @dev Returns the current cooldown period
     */
    function actionCooldown() public view returns (uint256) {
        return _actionCooldown;
    }

    /**
     * @dev Returns the time until next action is allowed
     */
    function timeUntilNextAction(address account) public view returns (uint256) {
        uint256 nextAllowedTime = _lastActionTime[account] + _actionCooldown;
        if (block.timestamp >= nextAllowedTime) {
            return 0;
        }
        return nextAllowedTime - block.timestamp;
    }

    /**
     * @dev Updates the cooldown period (internal function)
     */
    function _updateCooldown(uint256 newCooldown) internal {
        uint256 oldCooldown = _actionCooldown;
        _actionCooldown = newCooldown;
        emit CooldownUpdated(oldCooldown, newCooldown);
    }
}
