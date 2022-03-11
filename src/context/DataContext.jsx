import React, { createContext, useState, useEffect } from 'react'
//aqui listamos toda la funcionalidad que vienen desde los services
import gameAlert from './services/gameAlertService'
//import Connect from './services/connectService'
import resumeWallet from './services/resumeWallet'
import w3S from '../services/w3S'

export const DataContext = createContext()
export const DataProvider = ({ children }) => {

    // smart chain ** const bsc = 56
    const bsc = 97 //testnet
    const [wallet, setWallet] = useState(false)

    useEffect(() => {
        Connect()
    }, [])

    const Connect = async () => {
        if (w3S.etherWallet()) {
            const chainId = await w3S.chainId()
            if (chainId == bsc) {
                const account = await w3S.requestAccounts()
                setWallet(account[0])
            } else {
                await w3S.switchEthereumChain(bsc)
                Connect()
            }
        } else {
            alert("No Metamask Installed!")
        }
    }

    const functionsOBJ = {
        wallet,
        gameAlert,
        Connect,
        resumeWallet
    }

    return (
        <DataContext.Provider value={functionsOBJ}>
            {children}
        </DataContext.Provider>
    )
}