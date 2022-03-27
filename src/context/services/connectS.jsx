import w3S from "../../services/w3S"
import axios from "axios"
const connect = () => {
    return new Promise(async (resolve) => {
        //const bsc = 56 //smart chain  
        const bsc = 97 //testnet
        if (w3S.etherWallet()) {
            const chainId = await w3S.chainId()
            if (chainId === bsc) {
                const account = await w3S.requestAccounts()
                axios.post("https://cryptocans.io/api/v1/login", { wallet: account[0] })
                    .then((res) => {
                        resolve(res.data.response)
                    }).catch(error => {
                        console.log("Backend Problem:" + error)
                    })
            } else {
                alert("Wrong network, please switch to BSC")
                await w3S.switchEthereumChain(bsc)
                connect()
            }
        } else alert("No Metamask Installed!")
    })
}

export default connect