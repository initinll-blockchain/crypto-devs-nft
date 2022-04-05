import { Contract, ethers, Signer, type ContractInterface, type ContractTransaction } from 'ethers';
import abi from '$lib/abi/CryptoDevs.json';
import { Constants } from '$lib/helpers/Constants';
import { Networks } from '$lib/helpers/Networks';

declare const window: any;

export function getContractAddress() {    
    return Constants.CONTRACT_ADDRESS_RINKEBY;
}

export async function checkIfWalletIsConnected(): Promise<string> {
    let account:string;

    try {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }

        const accounts: string[] = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
            account = accounts[0];
            console.log("Found an authorized account:", account);
            return account;            
        } else {
            console.log("No authorized account found")
        }
    } catch (error) {
        throw error;
    }
}

export async function connectWallet(): Promise<string> {
    let account:string;

    try {
        const { ethereum } = window;

        if (!ethereum) {
            alert("Make sure you have metamask!");
            return;
        }

        const accounts: string[] = await ethereum.request({ method: "eth_requestAccounts" });

        if (accounts.length !== 0) {
            account = accounts[0];
            console.log("Found an authorized account:", account);
            return account;            
        } else {
            console.log("No authorized account found")
        }     
    } catch (error) {
        throw error;
    }
}

export async function getNetwork(): Promise<string> {
    let network: string;

     try {
        const { ethereum } = window;

        if (!ethereum) {
            alert("Make sure you have metamask!");
            return;
        }

        const chainId = await ethereum.request({ method: 'eth_chainId'});        
        network = Networks[chainId];
    } catch (error) {
        throw error;
    }

    return network;
}

export async function switchNetwork(chainId: string): Promise<void> {
    try {
        const { ethereum } = window;

        if (ethereum) {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: chainId }],
            });
        }
        else {
            alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
        }
    } catch (error) {
        throw error;
    }
}

export async function startPresale() {
    try {
        const cryptoDevsContract = getContract();
        await cryptoDevsContract.startPresale();
    } catch (error) {
        throw error;
    }
}

export async function isPresaleRunning(): Promise<boolean> {
    let result:boolean;
    try {
        const cryptoDevsContract = getContract();
        result = await cryptoDevsContract.isPresaleRunning();
    } catch (error) {
        throw error;
    }
    return result;
}

export async function presaleMint() {
    try {
        const cryptoDevsContract = getContract();
        await cryptoDevsContract.presaleMint();
    } catch (error) {
        throw error;
    }
}

export async function postsaleMint() {
    try {
        const cryptoDevsContract = getContract();
        await cryptoDevsContract.postsaleMint();
    } catch (error) {
        throw error;
    }
}

export async function getTotalTokenIdsMinted(): Promise<number> {
    let result:number;
    try {
        const cryptoDevsContract = getContract();
        result = await cryptoDevsContract.getTotalTokenIdsMinted();
    } catch (error) {
        throw error;
    }
    return result;
}

function getContract(): Contract {
    let cryptoDevsContract: Contract;

    try {
        const signer: Signer = getSigner();
        let contractABI: ContractInterface = abi.abi;
        let contractAddress: string = getContractAddress();

        if (signer) {
            cryptoDevsContract = new ethers.Contract(contractAddress, contractABI, signer);
            console.log("CryptoDevsContract", cryptoDevsContract.address);
        }
    } catch (error) {
        console.log("getContract", error);
    }

    return cryptoDevsContract;
}

function getSigner(): Signer {
    let signer: Signer;

    try {
        const { ethereum } = window;

        if (ethereum) {
            const provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(ethereum);
            signer = provider.getSigner();            
        }        
    } catch (error) {
        console.log("getContract", error);
    }

    return signer;
}