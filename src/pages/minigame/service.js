import axios from "axios"
import w3S from "../../services/w3S"
const account = w3S.requestAccounts()
const wallet = account[0]
const service = {
    find: async (item) => {
        const body = { wallet, code: item }
        try {
            const res = await axios.post(process.env.REACT_APP_BASEURL + "codes", body)
            const validate = res.data.response
            if (validate.result) {
                if (validate.key == "a") {
                    return 1
                } else if (validate.key == "b") {
                    return 2
                } else if (validate.key == "c") {
                    return 3
                } else if (validate.key == "d") {
                    return 4
                }
            } else {
                return 0
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default service
