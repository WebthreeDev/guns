const Connect = () => {
    /* try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        const account = accounts[0]
        return { error:false,account }
    } catch (error) {
        return { error:true,message:error.message }
    } */
    window.ethereum.request({ method: "eth_requestAccounts" }).then(res=>res[0])
    .catch((error)=> error)

}
export default Connect