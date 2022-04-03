import React, { createContext, useState, useEffect } from 'react'
import resumeWallet from './services/resumeWallet'
import lastForWallet from './services/lastForWallet'
import w3S, { web3 } from '../services/w3S'
import { nftContract } from '../tokens/canes/canes'
import { cctContract } from '../tokens/cct/cct'
import connect from './services/connectS'
import axios from 'axios'
import changeStateCanInMarket from './services/changeStateCanInMarket'

export const DataContext = createContext()
export const DataProvider = ({ children }) => {

    const [wallet, setWallet] = useState(false)
    const [commonPackagePrice, setCommonPackagePrice] = useState(false)
    const [epicPackagePrice, setEpicPackagePrice] = useState(false)
    const [legendaryPackagePrice, setLegendaryPackagePrice] = useState(false)
    const [newPackagePrice, setNewPackagePrice] = useState(false)
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(false)
    const [cans, setCans] = useState(false)
    const [bnb, setBnb] = useState(false)
    const [race, setRaces] = useState(false)
    const [balance, setBalance] = useState(false)
    const [cct, setCCT] = useState(false)
    const [canodromes, setCanodromes] = useState(false)

    const gas = web3.utils.toWei("0.0001", "gwei")
    const gasPrice = web3.utils.toWei("10", "gwei")

    useEffect(() => {
        exectConnect()
    }, [])

    window.ethereum.on('accountsChanged', async _ => setWallet(await exectConnect()))
    window.ethereum.on('chainChanged', async _ => setWallet(await exectConnect()))

    const exectConnect = async () => {
        
        setLoading(true)
        const storageCanId = JSON.parse(localStorage.getItem('windowsData')) || null
        if (storageCanId) {
            changeStateCanInMarket(storageCanId)
        }

        window.ethereum.request({ method: "eth_requestAccounts" })
            .then(async accounts => {
                const wallet = accounts[0]
                console.log("antes de enviar")
                axios.post("https://cryptocans.io/api/v1/login", { wallet })
                    .then(async (res) => {
                        console.log("enviado desde el axios")
                        setBalance(res.data.response.balance)
                        setWallet(wallet)
                        await getCanodromes(wallet)
                        await getBnb(wallet)
                        await getCCT(wallet)
                        await getCans(wallet)
                        setLoading(false)
                        return res.data.response
                    }).catch(error => {
                        setLoading(false)
                        if (error.response) {
                            // La respuesta fue hecha y el servidor respondió con un código de estado
                            // que esta fuera del rango de 2xx
                            console.log("error con response")
                            console.log(error.response.data);
                            console.log(error.response.status);
                            console.log(error.response.headers);
                        } else if (error.request) {
                              console.log("error con request")
                              // La petición fue hecha pero no se recibió respuesta
                              // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
                              // http.ClientRequest en node.js
                              console.log(error.request);
                            } else {
                              console.log("error con message")
                            // Algo paso al preparar la petición que lanzo un Error
                            console.log('Error', error.message);
                          }
                          console.log(error.config);
                    })
                return wallet
            }).catch(error =>{
                console.log("Metamask error:")
                console.log(error)
                setLoading(false)
            })


    }
    //const _canodromes = await axios.get("https://cryptocans.io/api/v1/canodromes", { params: { "wallet":__wallet } })

    const getCanodromes = async (wallet) => {
        //console.log("obtener canodromos de esta wallet: " + wallet)
        fetch("https://cryptocans.io/api/v1/canodromes?wallet=" + wallet)
            .then((res) => res.json())
            .then( res => {
                // console.log(res.response)
                setCanodromes(res.response)
                //return res.response
            })
    }

    



    const getCCT = async (wallet) => {
        const _cct = await cctContract.methods.balanceOf(wallet).call()
        setCCT(web3.utils.fromWei(_cct, "ether"))
    }

    const getCans = async (_wallet) => {
        //console.log("getCans")
        const _cans = await axios.get("https://cryptocans.io/api/v1/cans/user/" + _wallet)
        setCans(_cans.data.response)
        //console.log(_cans.data.response)
    }

    const getBnb = async (wallet) => {
        const bnbWei = await web3.eth.getBalance(wallet)
        const bnb = web3.utils.fromWei(bnbWei, "ether")
        const bnbRounded = (Math.round(bnb * 10000)) / 10000
        setBnb(bnbRounded)
    }

    const getERC721Contract = async () => {
        nftContract.methods.nftCommonPrice().call().then(res => {
            const _price = web3.utils.fromWei(res, "ether")
            setCommonPackagePrice(_price)
        })
        nftContract.methods.nftEpicPrice().call().then(res => {
            const _price = web3.utils.fromWei(res, "ether")
            setEpicPackagePrice(_price)
        })
        nftContract.methods.nftLegentadyPrice().call().then(res => {
            const _price = web3.utils.fromWei(res, "ether")
            setLegendaryPackagePrice(_price)
        })
    }

    const setRarity = (rarity) => {
        if (rarity === "1") { return "common" }
        if (rarity === "2") return "rare"
        if (rarity === "3") return "epic"
        if (rarity === "4") return "legendary"
    }

    const getRaces = async (wallet) => {
        const _races = await axios.get("https://cryptocans.io/api/v1/race/"+wallet)
        //console.log(_races.data.response)
        setRaces(_races.data.response)
    }

    const _context = {
        wallet, connect,
        resumeWallet, lastForWallet,
        w3S, nftContract, cctContract,
        epicPackagePrice, setEpicPackagePrice,
        legendaryPackagePrice, setLegendaryPackagePrice,
        newPackagePrice, setNewPackagePrice,
        commonPackagePrice, setCommonPackagePrice,
        loading, setLoading,
        getCans, cans, setCans,
        bnb, setBnb,
        exectConnect, setRarity,
        getERC721Contract,
        race, setRaces, getRaces,
        balance, cct,
        alert, setAlert,
        getCanodromes, canodromes,
        gas, gasPrice
    }

    return (
        <DataContext.Provider value={_context}>
            {children}
        </DataContext.Provider>
    )
}