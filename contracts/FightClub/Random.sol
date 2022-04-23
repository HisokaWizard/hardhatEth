//SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract Random {
    function random(uint256 number) internal view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.difficulty,
                        msg.sender
                    )
                )
            ) % number;
    }
}
