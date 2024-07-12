import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
    chain: mainnet,
    // mode: 'anvil',
    transport: http(),
});

export default client;
