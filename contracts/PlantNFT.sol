// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {WaterToken} from "./WaterToken.sol";

contract PlantNFT is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
    uint256 private _nextTokenId;
    address private _txTokenAddr; // 用于交易的代币合约地址
    mapping(uint256 tokenId => uint256 price) private _priceOfNFT; // nft价格映射（价格单位WaT）
    error NFTIsUnminted(uint256 tokenId); // NFT未铸造
    error TransferERC20Fail(address from, address to); // erc20代币转账失败
    error InvalidWaterToken(); // 不是同个合约持有者 则报错
    event TransactNFTSuccess(address indexed newOwner, uint256 indexed tokenId); // NFT交易成功

    constructor(address initialOwner)
        ERC721("Plant NFT", "PNFT")
        Ownable(initialOwner)
    {}
    // 查看NFT的waterToken价格
    function priceOfNFT(uint256 tokenId) view public returns(uint256) {
        return _priceOfNFT[tokenId];
    }
    // 查看用于交易的代币合约地址
    function txTokenAddr() view public returns(address){
        return _txTokenAddr;
    }
    // 设置用于交易的代币合约地址
    function setTxTokenAddress(address addr) public onlyOwner {
        // 确保代币合约与本合约是同一持有者
        if(WaterToken(addr).owner() != owner()){
            revert InvalidWaterToken();
        }
        _txTokenAddr = addr;
    }
    // 交易NFT函数
    function transactNFT(uint256 tokenId) public {
        // 获取NFT当前waterToken价格，若为0则表示未定价，不可交易
        uint256 price = _priceOfNFT[tokenId];
        if(price == 0){
            revert NFTIsUnminted(tokenId);
        }
        require(_txTokenAddr != address(0), "setTxTokenAddress first");
        // NFT的交易源和目标
        address from = ownerOf(tokenId);
        address to = msg.sender;
        require(from != to, "source and target can't be the same");
        // 先给NFT原持有者转waterToken
        bool isSuccess = WaterToken(_txTokenAddr).transferFrom(to, from, price);
        if(!isSuccess){
            revert TransferERC20Fail(from, to);
        }
        // 再由本合约 将NFT转给新持有者
        PlantNFT(this).safeTransferFrom(from, to, tokenId);
        emit TransactNFTSuccess(to, tokenId);
        // 每次交易成功 涨0.01WaT
        _priceOfNFT[tokenId] += 1*10**16; 
    }
    // 铸造成功，则初始化NFT价格
    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _priceOfNFT[tokenId] = 1*10**16; // 初始定价为 0.01WaT
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        // 授权本NFT合约 可操作所有NFT（所有NFT的操作最后都会走到这里，所以只需在此写一次即可）
        _setApprovalForAll(to, address(this), true);
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}