import React, { createContext, useState, useEffect } from 'react'
//aqui listamos toda la funcionalidad que vienen desde los services
import gameAlert from './services/gameAlertService'
//import Connect from './services/connectService'
import resumeWallet from './services/resumeWallet'
import w3S from './services/web3Services'

export const DataContext = createContext()
export const DataProvider = ({ children }) => {
    const bsc = 57
    const [wallet, setWallet] = useState(false)
    
    const Connect = async() => {
        const chainId = await w3S.getChainId()
        alert(chainId)
       /*  if(window.ethereum){
            const account = await w3S.requestAccounts()
            setWallet(account)
            const chainId = await w3S.getChainId()
            if(chainId == bsc){
                //logueo la wallet en el backend
            }else{
                //switch ethereum chain
            }
            //si esta en la correcta continuo sino lo cambio de res
            //al cambiar de res le permito conectarse con sus datos
            
        }else{
            alert("No Metamask detected")
        } */
    }
    useEffect(() => {
        Connect()
    }, [])

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