import { _nftContract } from '../tokens/canes/canes'
import { testNftContract } from '../testTokens/canes/canes'

let nftContract

if (process.env.REACT_APP_ENVIROMENT == "dev") {
    nftContract = nftContract
}

if (process.env.REACT_APP_ENVIROMENT == "prod") {
    nftContract = testNftContract
}

export default nftContract


