
const errorManager = (error)=>{
    if (error.response) {
        console.log("Error Response")
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        console.log("Error Request")
        console.log(error.request);
    } else {
        console.log("Error Message")
        console.log('Error', error.message);
    }
    console.log(error.config);
}

export default errorManager