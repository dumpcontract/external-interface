
interface IWETH {
    function deposit() external payable;

    function transfer(address to, uint value) external returns (bool);
    
    function withdraw(uint) external;
    function balanceOf(address account) external view returns (uint256);

}
