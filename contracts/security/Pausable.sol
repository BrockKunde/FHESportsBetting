// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Pausable
 * @dev Contract module which allows children to implement an emergency stop mechanism.
 */
abstract contract Pausable {
    event Paused(address account);
    event Unpaused(address account);
    event PauserSet(address indexed oldPauser, address indexed newPauser);

    bool private _paused;
    address private _pauser;

    constructor() {
        _paused = false;
        _pauser = msg.sender;
    }

    /**
     * @dev Returns true if the contract is paused.
     */
    function paused() public view virtual returns (bool) {
        return _paused;
    }

    /**
     * @dev Returns the current pauser address.
     */
    function pauser() public view virtual returns (address) {
        return _pauser;
    }

    /**
     * @dev Modifier to make a function callable only when not paused.
     */
    modifier whenNotPaused() {
        require(!paused(), "Pausable: paused");
        _;
    }

    /**
     * @dev Modifier to make a function callable only when paused.
     */
    modifier whenPaused() {
        require(paused(), "Pausable: not paused");
        _;
    }

    /**
     * @dev Modifier to make a function callable only by the pauser.
     */
    modifier onlyPauser() {
        require(msg.sender == _pauser, "Pausable: caller is not the pauser");
        _;
    }

    /**
     * @dev Triggers stopped state.
     */
    function pause() public virtual onlyPauser whenNotPaused {
        _paused = true;
        emit Paused(msg.sender);
    }

    /**
     * @dev Returns to normal state.
     */
    function unpause() public virtual onlyPauser whenPaused {
        _paused = false;
        emit Unpaused(msg.sender);
    }

    /**
     * @dev Sets a new pauser address.
     */
    function setPauser(address newPauser) public virtual onlyPauser {
        require(newPauser != address(0), "Pausable: new pauser is zero address");
        address oldPauser = _pauser;
        _pauser = newPauser;
        emit PauserSet(oldPauser, newPauser);
    }
}
