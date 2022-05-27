const enviroment = ()=>{
    let obj
    if(process.env.REACT_APP_ENVIROMENT === "dev"){
         obj = {
            baseurl:"http://localhost:5000/api/v1/",
            socket:"http://localhost:5000"
        } 
        // obj = {
        //     baseurl:"https://cryptocans.io/api/v1/",
        //     socket:"https://cryptocans.io"
        // }
    }else{
        obj = {
            baseurl:"https://cryptocans.io/api/v1/",
            socket:"https://cryptocans.io"
        }
    }
    return obj
}

export default enviroment