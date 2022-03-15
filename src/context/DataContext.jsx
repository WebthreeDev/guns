import React, { createContext, useState, useEffect } from 'react'
import gameAlert from './services/gameAlertService'
import resumeWallet from './services/resumeWallet'
import w3S, { web3 } from '../services/w3S'
import { Contract } from '../tokens/canes/canes'
import connect from './services/connectS'

export const DataContext = createContext()
export const DataProvider = ({ children }) => {

    const [wallet, setWallet] = useState(false)
    const [commonPackagePrice, setCommonPackagePrice] = useState(false)
    const [epicPackagePrice, setEpicPackagePrice] = useState(false)
    const [legendaryPackagePrice, setLegendaryPackagePrice] = useState(false)
    const [newPackagePrice, setNewPackagePrice] = useState(false)
    const [loading,setLoading] = useState(false)

    window.ethereum.on('accountsChanged', async () => {
        setWallet(await connect())
    })

    window.ethereum.on('chainChanged', async () => {
        setWallet(await connect())
    })

    useEffect(() => {
        exect()
        getERC721Contract()
    }, [wallet])

    const exect = async () => setWallet(await connect())

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
        loading,setLoading
    }

    return (
        <DataContext.Provider value={_context}>
            {children}
        </DataContext.Provider>
    )
}