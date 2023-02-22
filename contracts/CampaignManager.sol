// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CrowedCampaign.sol";

contract CampaignManager {
  address public owner;
  address public tokenAddress;
  struct Campaign {
    string name;
    CrowedCampaign campaign;
  }
  Campaign[] public campaigns;

  constructor(address _tokenAddress)  {
    owner = msg.sender;
    tokenAddress = _tokenAddress;
  }

  function createCampaign(string memory _name) public {
    require(getCampaignIndex(_name) == type(uint).max, "Campaign already exists.");
    CrowedCampaign campaign = new CrowedCampaign(tokenAddress,msg.sender);
    campaigns.push(Campaign(_name, campaign));
    emit CampaignCreated(_name, address(campaign));
  }

  function changeOwner(string memory _name, address _newOwner) public {
    uint index = getCampaignIndex(_name);
    require(index != type(uint).max, "Campaign does not exist.");
    require(msg.sender == owner, "Only the owner can change the campaign owner.");
    campaigns[index].campaign.changeOwner(_newOwner);
    emit OwnerChanged(_name, _newOwner);
  }

  function getCampaigns() public view returns (Campaign[] memory) {
    return campaigns;
  }

  function getCampaignIndex(string memory _name) private view returns (uint) {
    for (uint i = 0; i < campaigns.length; i++) {
      if (keccak256(abi.encodePacked(campaigns[i].name))  == keccak256(abi.encodePacked(_name))) {
        return i;
      }
    }
    return type(uint).max;
  }

  event CampaignCreated(string indexed _name, address indexed _address);
  event OwnerChanged(string indexed _name, address indexed _newOwner);
}
