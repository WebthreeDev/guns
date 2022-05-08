import axios from "axios"
import enviroment from "../../env"
const changeStateCanInMarket = async (canId)=>{
    console.log(canId)
    const body = {
        canId:canId.id,
        blockchainStatus: false
    }

   axios.post(enviroment().baseurl+"marketplace", body).then((res)=>{
       console.log(res.data.response)
       console.log("termino todo")
       localStorage.removeItem("windowsData")
   }).catch(error => console.log(error))
}
export default changeStateCanInMarket