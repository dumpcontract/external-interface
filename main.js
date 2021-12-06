const hre = require("hardhat");

async function getTokenBalance(token, signer) {
  contract = await ethers.getContractAt("IERC20", token, signer);
  const balance = await contract.balanceOf(signer);
  return ethers.utils.formatUnits(balance, 18);
}


async function totalSupply(tokenAddr){

  contract = await ethers.getContractAt("IERC20", tokenAddr)
  balance = await contract.totalSupply();
  return ethers.utils.formatUnits(balance, 18);

}


async function main(){
	const UNISWAP_ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
	const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
	const WBTC_ADDRESS = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";

	// <Set up accounts>
	const accounts = await hre.ethers.getSigners();
	hacker = accounts[4];
	hackerAddr = await hacker.getAddress();

	// <Setup Token>

	wethT = await hre.ethers.getContractAt("IWETH",WETH_ADDRESS);
	wbtcT = await hre.ethers.getContractAt("IERC20",WBTC_ADDRESS); 

	// <Down load some weth and wbtc>
	 await wethT.connect(hacker).deposit( { value: ethers.utils.parseEther("12")} )
	
	const balanceAfter = await wethT.balanceOf(hackerAddr);
	console.log(`hacker weth blance  ${balanceAfter}`);

	//await wethT.approve(UNISWAP_ROUTER_ADDRESS,ethers.utils.parseEther("10"));
	await wethT.connect(hacker).approve(UNISWAP_ROUTER_ADDRESS,10000000000000000000000000n);
	console.log("APProvewd");

	  ISwapRouter = await hre.ethers.getContractAt(
	    "ISwapRouter",
	    UNISWAP_ROUTER_ADDRESS
	  );
	  // ISwapRouter.ExactInputSingleParams memory params =
	  await ISwapRouter.connect(hacker).exactInputSingle({
	    tokenIn: WETH_ADDRESS,
	    tokenOut: WBTC_ADDRESS,
	    fee: 3000,
	    recipient: hackerAddr,
	    deadline: 10000000000,
//	    amountIn: ethers.utils.parseEther("1"),
		amountIn: 10000000000000,
		amountOutMinimum: 0,
	    sqrtPriceLimitX96: 0
	  });
	  // swapRouter.exactInputSingle(params);

	  console.log(
	    "WBTC balance after swap",
	    (await wbtcT.balanceOf(hacker.address)).toString()
	  );


}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

