import w3S from "../../services/w3S"
import axios from "axios"
const connect = () => {
    return new Promise( async(resolve)=>{
        //const bsc = 56 //smart chain  
    const bsc = 97 //testnet
    console.log("ok")
    if (w3S.etherWallet()) {
        const chainId = await w3S.chainId()
        if (chainId === bsc) {
            const account = await w3S.requestAccounts()
            axios.post("https://cryptocans.io/api/v1/login", { wallet: account[0] })
                .then((res) => {
                    //console.log(res.data.response)
                    if (res.data.response) {
                        console.log("DB connected")
                        //setWallet(account[0])
                        console.log("desde connect: "+account[0])
                        resolve(account[0])
                    } else {
                        alert("Conection Failed!")
                    }
                }).catch(error => {
                    console.log(error)
                })
        } else {
            await w3S.switchEthereumChain(bsc)
            connect()
        }
    } else alert("No Metamask Installed!")
})
}

export default connect