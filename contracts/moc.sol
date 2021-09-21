pragma solidity ^0.5.0;

pragma experimental ABIEncoderV2;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC721/ERC721Full.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/ownership/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/math/SafeMath.sol"; 
/*
PACMan DAO is bringing rapid on-chain activism.
Visit https://github.com/PacManDAO/ for more info
*/

contract MockCongress is ERC721Full {

    /* Variables */
	using Counters for Counters.Counter;
    Counters.Counter moc_ids;


    // tokenId to Seat
    // Seat = StateTypeDistrict i.e. WASEN1, WAREP1
    mapping(uint => string) public directory;

    // Owner of Contract
    address private contract_owner;
    
    // Not sure what??
	address public votes;

    // Event for NewMoc
    event NewMoc(uint indexed tokenId,  string seat, address token);

    /* Constructor */
    constructor(address votes_addr) ERC721Full("PacMan MOC", "MOC") public {
		votes = votes_addr;
        contract_owner = msg.sender;
    }

    function setBaseURI(string calldata URI ) external onlyContractOwner {
            _setBaseURI(URI);
    }
    // Mint the batch of Mocs, seats is array of seats to mint
    // a tradeoff between time/gas it takes to mint indidually vs time/gas to mint all at the same time
    function mintBatch(string[] calldata seats) external onlyContractOwner  {
        for(uint i = 0; i < seats.length; i++) {
            mintMOC(seats[i]);
        }
    }
    // Look up the seat by the tokenid
	function lookupIdFromSeat(string memory seat) public view returns (uint) {
		for(uint i = 1; i <= moc_ids.current(); i++) {
			if(keccak256(abi.encodePacked(directory[i])) == keccak256(abi.encodePacked(seat))) {
				return(i);
			}
		}
		return(0);
	}
    // Get currentId
	function currentId() public view returns (uint) {
		return moc_ids.current();
	}
    
    /* Owner functions */
	function newOwner(address new_owner_addr) onlyContractOwner public {
 		contract_owner = new_owner_addr;
	}
    // mint a single seat
	function mintMOC(
		string memory seat
	) public onlyContractOwner returns(uint) {

	       moc_ids.increment();
	       uint moc_id = moc_ids.current();
	       _mint(contract_owner, moc_id);
	       //_setTokenURI(moc_id, uri);
	       directory[moc_id] = seat;

	       // emit the event
	       emit NewMoc(moc_id, seat, address(this));

	       return moc_id;
	}

    // set decimals to 0, as each token is unqiue and one of a kind, as this pops up in metamask
    function decimals() external pure returns(uint) {
        return 0;
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
