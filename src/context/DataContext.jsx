import React, { createContext, useState, useEffect } from 'react'
import gameAlert from './services/gameAlertService'
import resumeWallet from './services/resumeWallet'
import w3S, { web3 } from '../services/w3S'
import { Contract } from '../tokens/canes/canes'
import connect from './services/connectS'
import axios from 'axios'

export const DataContext = createContext()
export const DataProvider = ({ children }) => {

    const [wallet, setWallet] = useState(false)
    const [commonPackagePrice, setCommonPackagePrice] = useState(false)
    const [epicPackagePrice, setEpicPackagePrice] = useState(false)
    const [legendaryPackagePrice, setLegendaryPackagePrice] = useState(false)
    const [newPackagePrice, setNewPackagePrice] = useState(false)
    const [loading, setLoading] = useState(false)
    const [cans, setCans] = useState(false)
    const [bnb, setBnb] = useState(false)

    window.ethereum.on('accountsChanged', async () => {
        setWallet(await connect())
    })

    window.ethereum.on('chainChanged', async () => {
        setWallet(await connect())
    })

    useEffect(() => {
        exectConnect()
        getBnb()
    }, [wallet])

    const exectConnect = async () => {
        await getERC721Contract()
        const wallet = await connect()
        setWallet(wallet)
        getCans(wallet)
    }

    const getCans = async (_wallet) => {
        setLoading(true)
        if (_wallet) {
            axios.get("https://cryptocans.io/api/v1/cans/user/" + _wallet).then(res => {
                // console.log(res.data)
                setCans(res.data.response)
                setLoading(false)
            })
        } else {
            setLoading(false)

        }
    }

    const getBnb = async () => {
        const wallet = await w3S.requestAccounts()
        console.log(wallet[0])
        if (wallet[0]) {
            const bnbWei = await web3.eth.getBalance(wallet[0])
            const bnb = web3.utils.fromWei(bnbWei, "ether")
            const bnbRounded = (Math.round(bnb * 10000)) / 10000
            setBnb(bnbRounded)
        }
    }



    const getERC721Contract = async () => {
        setLoading(true)
        Contract.methods.nftCommonPrice().call()
        .then(res => {
            const _price = web3.utils.fromWei(res, "ether")
            setCommonPackagePrice(_price)
        })
        Contract.methods.nftEpicPrice().call()
        .then(res => {
            const _price = web3.utils.fromWei(res, "ether")
            setEpicPackagePrice(_price)
        })

        const price = await Contract.methods.nftLegentadyPrice().call()
        const _price = web3.utils.fromWei(price, "ether")
        setLegendaryPackagePrice(_price)
        setLoading(false)
        
    }

const _context = {
    wallet, connect,
    resumeWallet,
    gameAlert,
    w3S, Contract,
    epicPackagePrice, setEpicPackagePrice,
    legendaryPackagePrice, setLegendaryPackagePrice,
    newPackagePrice, setNewPackagePrice,
    commonPackagePrice, setCommonPackagePrice,
    loading, setLoading,
    getCans, cans, setCans,
    bnb, setBnb
}

return (
    <DataContext.Provider value={_context}>
        {children}
    </DataContext.Provider>
)
}