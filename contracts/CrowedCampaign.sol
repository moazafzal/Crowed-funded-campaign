// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CrowedCampaign {
    ERC20 public token;
    address public owner;
    mapping(address => uint256) public balances;
    uint256 public totalPledged;
    uint256[] public goals;
    bool public goalReached;

    constructor(address _tokenAddress,address creater) {
        token = ERC20(_tokenAddress);
        owner = creater;
        goalReached = false;
    }

    function deposit(uint256 _amount) public {
        require(
            token.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed."
        );
        balances[msg.sender] += _amount;
        totalPledged += _amount;
        emit Deposit(msg.sender, _amount);

        if (!goalReached && totalPledged >= goals[0]) {
            goalReached = true;
            emit GoalReached();
        }
    }

    function setGoals(uint256[] memory _goals) public {
        require(msg.sender == owner, "Only the owner can set the goals.");
        goals = _goals;
        emit GoalsSet();
    }

    function withdraw(uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Not enough funds.");
        require(token.transfer(msg.sender, _amount), "Transfer failed.");
        balances[msg.sender] -= _amount;
        totalPledged -= _amount;
        emit Withdrawal(msg.sender, _amount);
    }

    function refund() public {
        require(!goalReached, "Goals have been met, no refund available.");
        uint256 refundAmount = balances[msg.sender];
        require(token.transfer(msg.sender, refundAmount), "Transfer failed.");
        balances[msg.sender] = 0;
        totalPledged -= refundAmount;
        emit Refund(msg.sender, refundAmount);
    }

    function getPledgedAmount() public view returns (uint256) {
        return totalPledged;
    }

    function changeOwner(address _newOwner) public {
        require(
            msg.sender == owner,
            "Only the current owner can change the owner."
        );
        owner = _newOwner;
        emit OwnerChanged(owner);
    }

    event Deposit(address indexed _from, uint256 _amount);
    event Withdrawal(address indexed _from, uint256 _amount);
    event Refund(address indexed _from, uint256 _amount);
    event OwnerChanged(address indexed _newOwner);
    event GoalReached();
    event GoalsSet();
}

