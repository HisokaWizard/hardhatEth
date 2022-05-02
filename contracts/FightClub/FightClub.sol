//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "hardhat/console.sol";

// contract FightClub {
//     enum Skills {
//         strength,
//         agility,
//         stamina,
//         instinct
//     } // 0, 1, 2, 3

//     struct Warrior {
//         address id;
//         bool inFight;
//         uint8 strength;
//         uint8 agility;
//         uint8 stamina;
//         uint8 instinct;
//         uint8 freePoints;
//         uint8 level;
//         uint16 health;
//         uint16 experience;
//         uint16 wins;
//         uint16 loses;
//         string name;
//     }

//     mapping(address => Warrior) public warriors;

//     constructor() {
//         Warrior memory boss;
//         boss.agility = 255;
//         boss.instinct = 255;
//         boss.strength = 255;
//         boss.stamina = 255;
//         boss.level = 167;
//         boss.health = 255 * 16;
//         boss.experience = 167 * 256;
//         boss.id = msg.sender;
//         boss.name = "HisokaWizard";
//         warriors[msg.sender] = boss;
//     }

//     function random(uint256 number) internal view returns (uint256) {
//         return
//             uint256(
//                 keccak256(
//                     abi.encodePacked(
//                         block.timestamp,
//                         block.difficulty,
//                         msg.sender
//                     )
//                 )
//             ) % number;
//     }

//     modifier emptyFreePoints() {
//         require(warriors[msg.sender].freePoints > 0, "No free points");
//         _;
//     }

//     modifier moreThanFreePoints(uint8 _amount) {
//         require(
//             warriors[msg.sender].freePoints >= _amount,
//             "Not enough free points"
//         );
//         _;
//     }

//     modifier warriorNotExists(address _player) {
//         require(warriors[_player].id == _player, "Warrior not exists");
//         _;
//     }

//     modifier ownWarrior() {
//         require(warriors[msg.sender].id == msg.sender, "It is not you warrior");
//         _;
//     }

//     function countHealth(uint8 _stamina) private pure returns (uint16) {
//         return _stamina * 16;
//     }

//     function countExperince(uint8 _level) private view returns (uint16) {
//         return uint16(_level * 8 * random(5));
//     }

//     function countLevelExperince(uint8 _level) private pure returns (uint16) {
//         return _level * 256;
//     }

//     function battleReward(address _player1, address _player2) private {
//         warriors[_player1].wins++;
//         warriors[_player2].loses++;
//         warriors[_player1].experience += countExperince(
//             warriors[_player1].level
//         );
//     }

//     function addOwnWarrior(string memory _name) public {
//         require(
//             warriors[msg.sender].id == address(0),
//             "Warrior already exists"
//         );
//         Warrior memory warrior;
//         warrior.agility = 3;
//         warrior.instinct = 3;
//         warrior.stamina = 3;
//         warrior.strength = 3;
//         warrior.freePoints = 6;
//         warrior.level = 1;
//         warrior.health = countHealth(warrior.stamina);
//         warrior.id = msg.sender;
//         warrior.name = _name;
//         warriors[msg.sender] = warrior;
//     }

//     function increaseSkills(Skills _skill, uint8 _amount)
//         public
//         emptyFreePoints
//         moreThanFreePoints(_amount)
//         ownWarrior
//     {
//         if (_skill == Skills.strength) {
//             warriors[msg.sender].strength += _amount;
//         }
//         if (_skill == Skills.agility) {
//             warriors[msg.sender].agility += _amount;
//         }
//         if (_skill == Skills.instinct) {
//             warriors[msg.sender].instinct += _amount;
//         }
//         if (_skill == Skills.stamina) {
//             warriors[msg.sender].stamina += _amount;
//             warriors[msg.sender].health = countHealth(
//                 warriors[msg.sender].stamina
//             );
//         }
//         warriors[msg.sender].freePoints -= _amount;
//     }

//     function increaseLevel(address _player) private {
//         if (
//             countLevelExperince(warriors[_player].level) <
//             warriors[_player].experience
//         ) {
//             warriors[_player].level++;
//             warriors[_player].freePoints += 6;
//         }
//     }

//     function countCritical(address _player)
//         private
//         view
//         warriorNotExists(_player)
//         returns (uint8)
//     {
//         uint8 chance = (warriors[_player].instinct * 100) / 255;
//         if (random(100 / chance) == 1) {
//             return warriors[_player].strength * 2;
//         }
//         return 0;
//     }

//     function attact(address _player, uint8 _enemyAgility)
//         private
//         view
//         warriorNotExists(_player)
//         returns (uint16)
//     {
//         return
//             warriors[_player].strength +
//             uint16(random(warriors[_player].strength)) -
//             (_enemyAgility - warriors[_player].agility) +
//             countCritical(_player);
//     }

//     function easyFight(address competitor) public {
//         require(
//             warriors[competitor].id != address(0),
//             "Don't have this warrior"
//         );
//         require(warriors[competitor].id != msg.sender, "It is not movie!!");
//         require(
//             warriors[competitor].level == warriors[msg.sender].level ||
//                 warriors[competitor].level == warriors[msg.sender].level + 1,
//             "This opponent too weak or too strong against of you"
//         );
//         while (
//             warriors[msg.sender].health > 0 || warriors[competitor].health > 0
//         ) {
//             uint16 yourDamage = attact(
//                 msg.sender,
//                 warriors[competitor].agility
//             );
//             uint16 competitorDamage = attact(
//                 competitor,
//                 warriors[msg.sender].agility
//             );
//             console.log(
//                 warriors[msg.sender].name,
//                 " hit ",
//                 warriors[competitor].name,
//                 " to face "
//             );
//             console.log("-", yourDamage);
//             console.log(
//                 warriors[competitor].name,
//                 " hit ",
//                 warriors[msg.sender].name,
//                 " to stomach "
//             );
//             console.log("-", competitorDamage);
//             warriors[competitor].health -= yourDamage;
//             warriors[msg.sender].health -= competitorDamage;
//         }
//         if (warriors[competitor].health < 0) {
//             console.log("Congratulation!! You win!!");
//             battleReward(msg.sender, competitor);
//             increaseLevel(msg.sender);
//         }
//         if (warriors[msg.sender].health < 0) {
//             console.log("So sorry, you lose!!");
//             battleReward(competitor, msg.sender);
//             increaseLevel(msg.sender);
//         }
//         warriors[msg.sender].health = countHealth(warriors[msg.sender].level);
//         warriors[competitor].health = countHealth(warriors[competitor].level);
//     }
// }
