const env = ()=>{
    let obj
    if(process.env.REACT_APP_ENVIROMENT == "dev"){
        obj = {
            baseurl:"http://localhost:3000/api/v1/",
            socket:"http://localhost:3000"
        }
    }else{
        obj = {
            baseurl:"https://cryptocans.io/api/v1/",
            socket:"https://cryptocans.io"
        }
    }
    return obj
}

export default env