import axios from "axios"
import web3,{ Contract } from "../../../tokens/canes/canes"
const buyPackage = (packageId, wallet) => {

    axios.post("https://cryptocans.io/api/v1/cans/", { id: packageId, wallet }).then((res) => {
        const response = res.data.response
        console.log(response)
        const addressTo = wallet
        const tokenId = response.id
        const nftType = response.packageId

        // ** PRECIOS DE LOS SOBRES ** //
        let value
        if (packageId === 1) value = web3.utils.toWei("0.01", "ether")
        if (packageId === 2) value = web3.utils.toWei("0.02", "ether")
        if (packageId === 3) value = web3.utils.toWei("0.03", "ether")

        console.log(value)

        Contract.methods.mint(addressTo, tokenId, nftType).send({ from: wallet, value }).then((res) => {
            console.log(res)
        }).catch(error => console.log(error))

    })
}

export default buyPackage
