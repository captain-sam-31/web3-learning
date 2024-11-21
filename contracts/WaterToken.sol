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
        approveNFT(to, balanceOf(to));
    }
    // 重写burn函数
    function burn(uint256 value) public override {
        _burn(_msgSender(), value);
        // 更新NFT可操作的waterToken数量
        approveNFT(msg.sender, balanceOf(msg.sender));
    }
    // 重写burnFrom函数
    function burnFrom(address account, uint256 value) public override {
        _spendAllowance(account, _msgSender(), value);
        _burn(account, value);
        // 更新NFT可操作的waterToken数量
        approveNFT(account, balanceOf(account));
    }
    // 重写transfer函数
    function transfer(address to, uint256 value) public override returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, value);
        // 更新NFT可操作的waterToken数量
        approveNFT(owner, balanceOf(owner));
        approveNFT(to, balanceOf(to));
        return true;
    }
    // 重写transferFrom函数
    function transferFrom(address from, address to, uint256 value) public override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, value);
        _transfer(from, to, value);
        // 更新NFT可操作的waterToken数量
        approveNFT(from, balanceOf(from));
        approveNFT(to, balanceOf(to));
        return true;
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
        approveNFT(msg.sender, balanceOf(msg.sender));
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