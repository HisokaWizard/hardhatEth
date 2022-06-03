//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ERC20 {
    function mint(address to, uint256 amount) external;

    function balanceOf(address holder) external view returns (uint256);

    function transfer(address to, uint256 amount) external;

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external;

    function approve(address spender, uint256 amount) external;

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);
}

contract ERC20Token is Ownable, ERC20 {
    string private constant name = "ERC20";
    string private constant symbol = "E20";
    uint8 public constant decimals = 18;
    uint256 private totalSupply = 0;

    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowances;

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approve(
        address indexed owner,
        address indexed spender,
        uint256 amount
    );

    modifier canSend(
        address from,
        address to,
        uint256 amount
    ) {
        require(balances[from] >= amount, "Not enough tokens!");
        require(balances[to] + amount >= balances[to], "Only positive tokens!");
        _;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(
            balances[to] <= totalSupply,
            "You have more token, than is possible"
        );
        require(
            totalSupply + amount >= totalSupply,
            "You can't burn token here"
        );
        balances[to] += amount;
        totalSupply += amount;
    }

    function balanceOf(address holder) external view returns (uint256) {
        return balances[holder];
    }

    function transfer(address to, uint256 amount)
        external
        canSend(msg.sender, to, amount)
    {
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external canSend(from, to, amount) {
        // check allowance that msg.sender can use from-address to send amount tokens
        require(
            allowances[from][msg.sender] >= amount,
            "Not enough permission to transfer"
        );
        balances[from] -= amount;
        balances[to] += amount;
        // remove allowance that msg.sender can use from-address to send amount tokens
        allowances[from][msg.sender] -= amount;
        emit Transfer(from, to, amount);
    }

    function approve(address spender, uint256 amount) external {
        allowances[msg.sender][spender] = amount;
        emit Approve(msg.sender, spender, amount);
    }

    function allowance(address owner, address spender)
        external
        view
        returns (uint256)
    {
        return allowances[owner][spender];
    }
}
