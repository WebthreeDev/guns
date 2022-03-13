import React, { createContext, useState, useEffect } from 'react'
import gameAlert from './services/gameAlertService'
import resumeWallet from './services/resumeWallet'
import w3S from '../services/w3S'
import axios from 'axios'
import { Contract } from '../tokens/canes/canes'

export const DataContext = createContext()
export const DataProvider = ({ children }) => {

    
    //const bsc = 56 //smart chain  
    const bsc = 97 //testnet
    const [wallet, setWallet] = useState(false)

    useEffect(() => {
        Connect()
    }, [wallet])

    window.ethereum.on('accountsChanged', () => {
        Connect()
    })

    window.ethereum.on('chainChanged', async () => {
        Connect()
    })

    const Connect = async () => {
        if (w3S.etherWallet()) {
            const chainId = await w3S.chainId()
            if (chainId === bsc) {
                const account = await w3S.requestAccounts()
                axios.post("https://cryptocans.io/api/v1/login", { wallet: account[0] })
                    .then((res) => {
                        //console.log(res.data.response)
                        if (res.data.response) {
                            console.log("DB connected")
                            setWallet(account[0])
                        } else {
                            alert("Conection Failed!")
                        }
                    }).catch(error => {
                        console.log(error)
                    })
            } else {
                await w3S.switchEthereumChain(bsc)
                Connect()
            }
        } else alert("No Metamask Installed!")
    }

    const functionsOBJ = {
        wallet,
        gameAlert,
        Connect,
        resumeWallet,
        w3S,
        Contract
    }

    return (
        <DataContext.Provider value={functionsOBJ}>
            {children}
        </DataContext.Provider>
    )
}