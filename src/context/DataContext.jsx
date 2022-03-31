import React, { createContext, useState, useEffect } from 'react'
import resumeWallet from './services/resumeWallet'
import lastForWallet from './services/lastForWallet'
import w3S, { web3 } from '../services/w3S'
import { nftContract } from '../tokens/canes/canes'
import { cctContract } from '../tokens/cct/cct'
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
    const [alert, setAlert] = useState(false)
    const [cans, setCans] = useState(false)
    const [bnb, setBnb] = useState(false)
    const [race, setRaces] = useState(false)
    const [balance, setBalance] = useState(false)
    const [cct, setCCT] = useState(false)
    const [canodromes, setCanodromes] = useState(false)

    useEffect(() => {
        exectConnect()
    }, [wallet])

    window.ethereum.on('accountsChanged', async _ => setWallet(await exectConnect()))
    window.ethereum.on('chainChanged', async _ => setWallet(await exectConnect()))

    const exectConnect = async () => {
        setLoading(true)
        /* const accounts = await */
            window.ethereum.request({ method: "eth_requestAccounts" })
                .then(async accounts => {
                    //const connection = await connect(accounts[0])
                    const wallet = accounts[0]
                    //console.log(connection)
                    //setBalance(connection.balance)
                    setWallet(wallet)
                    await getCanodromes(wallet)
                    await getBnb(wallet)
                    await getCCT(wallet)
                    await getCans(wallet)
                    setLoading(false)
                    await getRaces(wallet)
                    return wallet
                })

    }
    //const _canodromes = await axios.get("https://cryptocans.io/api/v1/canodromes", { params: { "wallet":__wallet } })

    const getCanodromes = async (wallet) => {
        console.log("obtener canodromos de esta wallet: " + wallet)
        fetch("https://cryptocans.io/api/v1/canodromes?wallet=" + wallet)
            .then((res) => res.json())
            .then(res => {
               // console.log(res.response)
                setCanodromes(res.response)
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
        const _price = 1
        setCommonPackagePrice(_price)
        setEpicPackagePrice(_price)
        setLegendaryPackagePrice(_price)
        console.log(nftContract.methods)

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
        const _races = await axios.get("https://cryptocans.io/api/v1/race/0x7daF5a75C7B3f6d8c5c2b53117850a5d09006168")
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
        getCanodromes, canodromes
    }

    return (
        <DataContext.Provider value={_context}>
            {children}
        </DataContext.Provider>
    )
}