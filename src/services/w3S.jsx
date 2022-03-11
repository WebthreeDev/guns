// w3S es un objeto accesible desde toda la aplicacion que podra ser usaso para realizar todas las
// Operaciones relacionadas con la blockchain
import Web3 from "web3"
const web3 = new Web3(window.ethereum)
const w3S = {
    requestAccounts: _ => window.ethereum.request({ method: "eth_requestAccounts" }),
    chainId: async _ => {
        const id = await window.ethereum.request({ method: 'eth_chainId' })
        return web3.utils.hexToNumber(id)
    },
    switchEthereumChain: id => {
        const chainId = web3.utils.toHex(id)
        return window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] })
    },
    etherWallet: _ => typeof window.ethereum !== 'undefined'
}

export default w3S