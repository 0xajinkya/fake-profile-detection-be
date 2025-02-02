import { PRIVATE_KEY } from "@config/env";
import { blockchain } from "libraries";

async function setPredictionStatus(id: string, status: "Real" | "Fake") {
    const account = blockchain.instance?.eth.accounts.privateKeyToAccount(PRIVATE_KEY!);
    if (!account) {
        throw new Error("❌ Account not found");
    }
    blockchain.instance?.eth.accounts.wallet.add(account);

    // Estimate gas needed for the transaction
    const gas = await blockchain.contract?.methods
        .setPredictionStatus(id, status)
        .estimateGas({ from: account.address });
    if (typeof gas === undefined) {
        throw new Error("❌ Gas not found");
    }
    // Send the transaction
    const tx = await blockchain.contract?.methods.setPredictionStatus(id, status).send({
        from: account.address,
        gas: `${gas}`,
        gasPrice: `${await blockchain.instance?.eth.getGasPrice()}`
    });
    if (!tx) {

    }
    return tx;
}

async function getPredictionStatus(id: string) {
    const account = blockchain.instance?.eth.accounts.privateKeyToAccount(PRIVATE_KEY!);
    if (!account) {
        throw new Error("❌ Account not found");
    }
    blockchain.instance?.eth.accounts.wallet.add(account);
    const tx = await blockchain.contract?.methods.getPredictionStatus(id).call();
    return tx;
}

export const BlockchainService = {
    setPredictionStatus,
    getPredictionStatus
}