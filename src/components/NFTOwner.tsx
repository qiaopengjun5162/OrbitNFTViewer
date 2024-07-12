import client from '@/client';
import { abi } from '@abi/OrbitAbi';
import { getAddress, getContract, isAddress } from 'viem';
import { useState } from 'react';

// 获取合约地址
const contract_address = getAddress(import.meta.env.ENV_CONTRACT_ADDRESS);

// 判断合约地址是否有效
if (!isAddress(contract_address)) {
    throw new Error(`Invalid contract address: ${contract_address}`);
}

const NFTOwner: React.FC = () => {
    // 定义tokenId和拥有者地址状态
    const [tokenId, setTokenId] = useState<string>('');
    const [ownerAddress, setOwnerAddress] = useState<string>('');
    // 定义错误状态
    const [error, setError] = useState<string>('');

    // 获取合约实例
    const contract = getContract({ address: contract_address, abi, client })

    // 获取拥有者地址
    const handleFetchOwner = async () => {
        try {
            // 调用合约的ownerOf方法获取拥有者地址
            const owner = await client.readContract({
                ...contract,
                functionName: 'ownerOf',
                args: [BigInt(tokenId)]
            });
            // 设置拥有者地址状态
            setOwnerAddress(owner as string);
            // 设置错误状态
            setError('');
        } catch (err) {
            // 设置错误状态
            setError('Failed to fetch owner address. Please check the tokenId.');
            console.error(err);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold underline">NFT Owner Lookup</h2>
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
            <button onClick={handleFetchOwner}>Fetch Owner</button>
            {ownerAddress && <p>Owner Address: {ownerAddress}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}

export default NFTOwner
