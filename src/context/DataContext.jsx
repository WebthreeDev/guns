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
    const [loading,setLoading] = useState(false)
    const [cans, setCans] = useState(false)

    window.ethereum.on('accountsChanged', async () => {
        setWallet(await connect())
    })

    window.ethereum.on('chainChanged', async () => {
        setWallet(await connect())
    })

    useEffect(() => {
        exectConnect()
    }, [wallet])

    const exectConnect = async () => {
        const wallet = await connect()
        setWallet(wallet)
        getCans(wallet)
        getERC721Contract()
    }

    const getCans = async (_wallet)=>{
        setLoading(true)
        if (_wallet) {
            axios.get("https://cryptocans.io/api/v1/cans/user/" + _wallet).then(res => {
                console.log(res.data)
                setCans(res.data.response)
                setLoading(false)
            })
        }else{
            setLoading(false)

        }
    }


    const getERC721Contract = () => {
        Contract.methods.nftCommonPrice().call().then(res => {
            const _price = web3.utils.fromWei(res, "ether")
            setCommonPackagePrice(_price)
        })
        Contract.methods.nftEpicPrice().call().then(res => {
            const _price = web3.utils.fromWei(res, "ether")
            setEpicPackagePrice(_price)
        })
        Contract.methods.nftLegentadyPrice().call().then(res => {
            const _price = web3.utils.fromWei(res, "ether")
            setLegendaryPackagePrice(_price)
        })
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
        loading,setLoading,
        getCans,cans,setCans
    }
 
    return (
        <DataContext.Provider value={_context}>
            {children}
        </DataContext.Provider>
    )
}