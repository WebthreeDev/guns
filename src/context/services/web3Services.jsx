import Web3 from "web3"
const web3 = new Web3(window.ethereum)
const w3S = {
    requestAccounts : async()=>{
        const account = await window.ethereum.request({ method: "eth_requestAccounts" })
        return account[0]
    },
    getChainId: async()=>{
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        return web3.utils.fromHex(chainId) 
    }
}

export default w3S