import axios from "axios"
const changeStateCanodrome = async ({id})=>{
    console.log(id)
    console.table("tratando de actualizar el estado del canodrfomo")
    localStorage.removeItem("windowsData2")
    const res = await axios.post(process.env.REACT_APP_BASEURL+"canodrome/status/"+id+"/1")
    console.table(res)
}
export default changeStateCanodrome