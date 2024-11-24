// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract WaterToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    address private _nftContract; // NFT合约地址
    error LessThanMinAmount(uint256 eth); // 低于最小购买额度
    error WithdrawFail(); // 取款失败

    constructor(address initialOwner, address nftContract)
        ERC20("Water Token", "wat")
        Ownable(initialOwner)
        ERC20Permit("Water Token")
    {
        _nftContract = nftContract;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    // 重写update函数（所有WaterToken的操作最后都会走到这里，所以只需在此写一次即可）
    function _update(address from, address to, uint256 value) internal override(ERC20) {
        // 延用父合约的update逻辑
        super._update(from, to, value);
        // 授权NFT合约可操作所有waterToken
        if (from != address(0)) {
            approveNFT(from, balanceOf(from));
        }
        if (to != address(0)) {
            approveNFT(to, balanceOf(to));
        }
    }
    // 批准NFT合约 操作所有WaterToken代币
    function approveNFT(address ownerAddr, uint256 amount) private {
        if(_nftContract != address(0)){
            _approve(ownerAddr, _nftContract, amount);
        }
    }
    // 购买waterToken 需支付的原生币
    function payMe() external payable {
        // 最低兑换 0.01 waterToken
        uint minAmount = 10**16;
        if(msg.value < minAmount){
            revert LessThanMinAmount(msg.value);
        }
        // 1 eth 兑换 1 waterToken
        _mint(msg.sender, msg.value);
    }
    // 取回 所有原生币
    function withdraw() external onlyOwner{
        uint amount = address(this).balance;
        address ownerAddr = owner();
        (bool success,) = ownerAddr.call{value: amount}("");
        if(!success){
            revert WithdrawFail();
        }
    }
}