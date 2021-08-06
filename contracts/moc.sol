pragma solidity ^0.5.0;

import "OpenZeppelin/openzeppelin-contracts@2.5.0/contracts/drafts/Counters.sol";
import "OpenZeppelin/openzeppelin-contracts@2.5.0/contracts/token/ERC721/ERC721Full.sol";

/* 
PACMan DAO is bringing rapid on-chain activism.
Visit https://github.com/PacManDAO/ for more info
*/

contract MockCongress is ERC721Full {

/* Variables */
	using Counters for Counters.Counter;
        Counters.Counter moc_ids;

        struct MoC {
                string username;
		string seat;
        }

        mapping(uint => MoC) public directory;

        address private contract_owner;
	address public votes;

/* Constructor */
        constructor(address votes_addr) ERC721Full("PacMan MOC", "MOC") public {
		votes = votes_addr;
                contract_owner = msg.sender;
        }


/* View Functions */
	function lookupIdFromSeat(string memory seat) public view returns (uint) {
		for(uint i = 1; i <= moc_ids.current(); i++) {
			if(keccak256(abi.encodePacked(directory[i].seat)) == keccak256(abi.encodePacked(seat))) {
				return(i);
			}
		}
		return(0);
	}
	
/* Write Functions */
	function updateUsername(uint token_id, string memory username) onlyTokenOwner(token_id) public {
		directory[token_id].username = username;
	}

	function updateURI(uint token_id, string memory uri) onlyTokenOwner(token_id) public {
	       _setTokenURI( token_id , uri);
	}

	function currentId() public view returns (uint) {
		return moc_ids.current();
	}
/* Owner functions */
	function newOwner(address new_owner_addr) onlyContractOwner public {
 		contract_owner = new_owner_addr;
	}

	function mintMOC(
		string memory username, 
		string memory seat, 
		string memory uri
	) public onlyContractOwner returns(uint) {
	
	       moc_ids.increment();
	       uint moc_id = moc_ids.current();

	       _mint(contract_owner, moc_id);
	       _setTokenURI(moc_id, uri);
	       directory[moc_id] = MoC(username, seat);
	       return moc_id;
	}


/* Modifiers */
	modifier onlyContractOwner() {
	       require(msg.sender == contract_owner, "No Insurrection");
	       _;
	} 
	modifier onlyTokenOwner(uint token_id) {
		require(msg.sender == ownerOf(token_id), "Wrong Puppeteer");
		_;
	}
}
