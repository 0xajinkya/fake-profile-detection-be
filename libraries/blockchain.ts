import { CONTRACT_ADDRESS } from "@config/env";
import Web3, { Contract } from "web3";

const abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "string",
                name: "id",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "status",
                type: "string",
            },
        ],
        name: "PredictionUpdated",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "id",
                type: "string",
            },
        ],
        name: "getPredictionStatus",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "id",
                type: "string",
            },
        ],
        name: "predictionExists",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "id",
                type: "string",
            },
            {
                internalType: "string",
                name: "status",
                type: "string",
            },
        ],
        name: "setPredictionStatus",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];

const Loader = async () => {
    blockchain.instance = new Web3("https://eth-sepolia.g.alchemy.com/v2/tu64PgO4Ws0a1Y_ES9HM07P5qUSUHDJN");
    blockchain.contract = new blockchain.instance.eth.Contract(abi, CONTRACT_ADDRESS);
    console.log("🚀 Blockchain loaded");
};

export const blockchain = {
    instance: null as Web3 | null,
    contract: null as Contract<any> | null,
    Loader
}