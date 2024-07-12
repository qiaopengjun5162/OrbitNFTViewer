import client from "@/client";
import { abi } from "@abi/OrbitAbi";
import { useState } from "react";
import { getAddress, getContract, isAddress } from "viem";

// 获取合约地址
const contract_address = getAddress(import.meta.env.ENV_CONTRACT_ADDRESS);

if (!isAddress(contract_address)) {
    throw new Error("Invalid contract address");
}

// 获取合约
const contract = getContract({ address: contract_address, abi, client });

// 获取区块号
const blockNumber = await client.getBlockNumber();

// 获取合约名称、符号、总供应量、余额
const [name, symbol, totalSupply, balance] = await Promise.all([
    contract.read.name(),
    contract.read.symbol(),
    contract.read.totalSupply(),
    contract.read.balanceOf([contract_address]),
]);

// 获取合约余额
const contract_balance = await client.getBalance({
    address: contract_address,
});

// 获取合约交易数量
const transactionCount = await client.getTransactionCount({
    address: contract_address,
});

// 获取合约日志
const logs = await contract.getEvents.Transfer();

const NFTMetadata: React.FC = () => {
    const [tokenId, setTokenId] = useState<string>("");
    const [tokenURI, setTokenURI] = useState<string>("");
    const [error, setError] = useState<string>("");

    // 根据tokenId获取tokenURI
    const handleFetchMetadata = async () => {
        try {
            const uri = await client.readContract({
                ...contract,
                functionName: "tokenURI",
                args: [BigInt(tokenId)],
            });
            setTokenURI(uri as string);
            setError("");
        } catch (err) {
            setError("Failed to fetch token URI. Please check the tokenId.");
            console.error(err);
        }
    };
    return (
        <div>
            <h2>NFT Metadata</h2>
            <div>
                <p>Block Number: {blockNumber.toString()}</p>

                <p className="text-slate-500">Name: {name}</p>

                <p>Symbol: {symbol}</p>

                <p>Total Supply: {totalSupply.toString()}</p>

                <p>Balance: {balance.toString()}</p>

                <p>Contract Balance: {contract_balance.toString()}</p>

                <p>Transaction Count: {transactionCount.toString()}</p>

                <p>Logs: {logs.map((log) => log.transactionHash).join(", ")}</p>
            </div>
            <div>
                <h2>NFT Metadata Lookup</h2>
                <div>
                    <label>
                        Token ID:
                        <input
                            type="text"
                            value={tokenId}
                            onChange={(e) => setTokenId(e.target.value)}
                        />
                    </label>
                </div>
                <button onClick={handleFetchMetadata}>Fetch Metadata</button>
                {tokenURI && <p>Token URI: {tokenURI}</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        </div>
    );
};
export default NFTMetadata;
