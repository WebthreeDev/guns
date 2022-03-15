import { createSlice } from '@reduxjs/toolkit'
//import Web3 from 'web3'
//const provider = window.ethereum
//const web3 = new Web3(provider)

export const reduxSlice = createSlice({
    name: 'reduxState',
    initialState: {
        chainId: 0,
        wallet: null,
        loading: true,
        location: ""
    },
    reducers: {
        setLocation: (state, action) => {
            state.location = action.payload
        },
        setChainId: (state, action) => {
            state.chainId = action.payload
        },
        setWallet: (state, action) => {
            state.wallet = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
    }
})

export const { setChainId, setWallet, setLoading, setLocation } = reduxSlice.actions

export default reduxSlice.reducer

export const getChainId = () => (dispatch) => {
    window.ethereum.request({ method: 'eth_chainId' }).then((chain) => {
        dispatch(setChainId(chain))
    }).catch(error => { console.log(error) })
        .finaly(() => {
            dispatch(setLoading(false))
        })
}

export const getWallet = () => (dispatch) => {
    dispatch(setLoading(true))
    window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(res => {
            dispatch(setWallet(res[0]))
        })
        .catch(error => console.log(error))
        .finally(() => dispatch(setLoading(false)))
}

export const getLocation = (loc) => (dispatch) => {
    dispatch(setLocation(loc))
}
