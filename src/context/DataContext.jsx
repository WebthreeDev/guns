import React, { createContext, useState, useEffect } from 'react'
import resumeWallet from './services/resumeWallet'
import lastForWallet from './services/lastForWallet'
import w3S, { web3 } from '../services/w3S'
import { nftContract } from '../tokens/canes/canes'
import { cctContract } from '../tokens/cct/cct'
import { poolContract } from '../tokens/pool/pool'
import connect from './services/connectS'
import axios from 'axios'
import changeStateCanInMarket from './services/changeStateCanInMarket'
import socket from '../socket';


export const DataContext = createContext()
export const DataProvider = ({ children }) => {

    const [wallet, setWallet] = useState(false)
    const [commonPackagePrice, setCommonPackagePrice] = useState(false)
    const [epicPackagePrice, setEpicPackagePrice] = useState(false)
    const [legendaryPackagePrice, setLegendaryPackagePrice] = useState(false)
    const [canodromeCommonPrice,setCanodromeCommonPrice] = useState(false)
    const [canodromeLegendaryPrice,setCanodromeLegendaryPrice] = useState(false)
    const [newPackagePrice, setNewPackagePrice] = useState(false)
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(false)
    const [cans, setCans] = useState(false)
    const [bnb, setBnb] = useState(false)
    const [race, setRaces] = useState(false)
    const [balance, setBalance] = useState(false)
    const [cct, setCCT] = useState(false)
    const [canodromes, setCanodromes] = useState(false)
    const [claimPercent, setClaimPersent] = useState(false)
    const [cansMarket, setCansMarket] = useState([]);
    const [oracule,setOracule] = useState(false)
    const [minimunToClaim,setMinimunToClaim] = useState(false)
    const [dayReset,setDayReset] = useState(false)
    const [canodromesMarket,setCanodromesMarket] = useState([])
    const gas = web3.utils.toWei("0.00015", "gwei")
    const gasPrice = web3.utils.toWei("15", "gwei")
    const ownerWallet = "0xDD4f413f98dD8Bf8cABc9877156aE2B5108f1397"

    useEffect(() => {
        fetch(process.env.REACT_APP_BASEURL + 'marketplace')
        exectConnect()
        getERC721Contract()
        //verifyClaim()
    }, [])

    // from websocket
    socket.on('data', async data => setCansMarket(data))
    socket.on('canodromesMarket', async data => setCanodromesMarket(data))

    /*  const getClaimPersent = async () => {
         const account = await w3S.requestAccounts()
         try {
             const res = await axios.get(process.env.REACT_APP_BASEURL + "claim/" + account[0])
             // console.log(res.data.response)
             setClaimPersent(res.data.response.porcent)
         } catch (error) {
             console.log(error)
         }
     } */

    /*  const verifyClaim = async () => {
         const account = await w3S.requestAccounts()
         axios.post(process.env.REACT_APP_BASEURL + "claim/" + account[0])
     } */

    /* const getUser = async () => {
        const account = await w3S.requestAccounts()
        try {
            const user = await axios.post(process.env.REACT_APP_BASEURL + "login", { wallet: account[0] })
            setBalance(user.data.response.balance)
            console.log(user.data.response)
            return user.data.response
        } catch (error) {
            console.log(error.response)
        }
    } */

    const exectConnect = async () => {

        setLoading(true)
        const storageCanId = JSON.parse(localStorage.getItem('windowsData')) || null
        if (storageCanId) {
            changeStateCanInMarket(storageCanId)
        }

        window.ethereum.request({ method: "eth_requestAccounts" })
            .then(async accounts => {
                const wallet = accounts[0]
                axios.post(process.env.REACT_APP_BASEURL + "login", { wallet })
                    .then(async (res) => {
                        const _data = res.data.response
                       /*  console.log("_data")*/
                        console.log(_data) 
                        setBalance(_data.getWallet.balance)
                        setClaimPersent(_data.claim.porcent)
                        setWallet(wallet)
                        setCans(_data.cansUser)
                        setCanodromes(_data.canodromes)
                        setOracule(_data.oracule.value)
                        setMinimunToClaim(_data.oracule.min)
                        setDayReset(_data.dayReset)

                        await getBnb(wallet)
                        await getCCT(wallet)
                        await getCanodromes(wallet, _data.canodromes)
                        setLoading(false)
                        return res.data.response
                    }).catch(error => {
                        setLoading(false)
                        if (error.response) {
                            console.log("Error Response")
                            console.log(error.response.data);
                            console.log(error.response.status);
                            console.log(error.response.headers);
                        } else if (error.request) {
                            console.log("Error Request")
                            console.log(error.request);
                        } else {
                            console.log("Error Message")
                            console.log('Error', error.message);
                        }
                        console.log(error.config);
                    })
                return wallet
            }).catch(error => {
                console.log("Metamask error:")
                console.log(error)
                setLoading(false)
            })


    }

    const getCanodromeState = async () => {
        const accounts = await w3S.requestAccounts()
        const wallet = accounts[0]
        try {
            const query = await fetch(process.env.REACT_APP_BASEURL + "canodrome?wallet=" + wallet)
            const _canodromos = await query.json()
            setCanodromes(_canodromos.response)
            return _canodromos.response
        } catch (error) {
            console.log(error)
        }
    }

    const getCanodromes = async (wallet) => {
        //await reset(wallet)
        const canes = await getCans(wallet)
        //console.log(canes)
        const _canodromes = await getCanodromeState(wallet)
        //console.log(_canodromes)
        let newCanodromes = []
        _canodromes.map(canodrome => {
            let aux = canodrome
            let newCansList = []
            canodrome.cans.map((can, index) => {
                canes.map(allCans => {
                    if (can.can.id == allCans.id) {
                        newCansList.push(allCans)
                    }
                })
                aux.cans[index].can = newCansList[index]
            })
            newCanodromes.push(aux)
        })
        setCanodromes(newCanodromes)

    }

    const getCCT = async (wallet) => {
        const _cct = await cctContract.methods.balanceOf(wallet).call()
        setCCT(web3.utils.fromWei(_cct, "ether"))
    }

    const getCans = async (_wallet) => {
        const _cans = await axios.get(process.env.REACT_APP_BASEURL + "cans/user/" + _wallet)
        setCans(_cans.data.response)
        return (_cans.data.response)
    }

    const reset = async (_wallet) => {
        if (_wallet) await axios.get(process.env.REACT_APP_BASEURL + "reset/" + _wallet)
    }

    const getBnb = async (wallet) => {
        const bnbWei = await web3.eth.getBalance(wallet)
        const bnb = web3.utils.fromWei(bnbWei, "ether")
        const bnbRounded = (Math.round(bnb * 10000)) / 10000
        setBnb(bnbRounded)
    }

    const getERC721Contract = async () => {
        console.log("agregando precios")
        nftContract.methods.nftCommonPrice().call().then(res => {
            const _price = web3.utils.fromWei(res, "ether")
            setCommonPackagePrice(_price)
        })
        nftContract.methods.nftEpicPrice().call().then(res => {
            const _price = web3.utils.fromWei(res, "ether")
            setEpicPackagePrice(_price)
        })
        nftContract.methods.nftLegendaryPrice().call().then(res => {
            const _price = web3.utils.fromWei(res, "ether")
            setLegendaryPackagePrice(_price)
        })
        nftContract.methods.canodromeCommonPrice().call().then(res => {
            const _price = web3.utils.fromWei(res, "ether")
            console.log("conodrome price : "+ _price)
            setCanodromeCommonPrice(_price)
        })
        nftContract.methods.canodromeLegendaryPrice().call().then(res => {
            const _price = web3.utils.fromWei(res, "ether")
            console.log("conodrome legendary price : "+ _price)
            setCanodromeLegendaryPrice(_price)
        })
    }

    const setRarity = (rarity) => {
        if (rarity === "1") { return "common" }
        if (rarity === "2") return "rare"
        if (rarity === "3") return "epic"
        if (rarity === "4") return "legendary"
    }

    const getRaces = async () => {
        const accounts = await w3S.requestAccounts()
        const wallet = await accounts[0]
        const _races = await axios.get(process.env.REACT_APP_BASEURL + "race/" + wallet)
        setRaces(_races.data.response)
       // console.log(_races.data.response)
    }

    const converType = (type) => {
        const _type = [0, 6, 12, 18, 24]
        return _type[type]
    }

    const _context = {
        wallet, connect,
        resumeWallet, lastForWallet,
        w3S, nftContract, cctContract,
        commonPackagePrice, setCommonPackagePrice,
        epicPackagePrice, setEpicPackagePrice,
        legendaryPackagePrice, setLegendaryPackagePrice,
        canodromeCommonPrice,setCanodromeCommonPrice,
        canodromeLegendaryPrice,setCanodromeLegendaryPrice,
        newPackagePrice, setNewPackagePrice,
        loading, setLoading,
        getCans, cans, setCans,
        bnb, setBnb,
        exectConnect, setRarity,
        getERC721Contract,
        race, setRaces, getRaces,
        balance, cct,
        alert, setAlert,
        getCanodromes, canodromes,
        gas, gasPrice,
        converType, claimPercent, getBnb,
        getCCT, ownerWallet, cansMarket,
        getCanodromeState, poolContract,
        oracule,minimunToClaim,dayReset,
        canodromesMarket
    }

    return (
        <DataContext.Provider value={_context}>
            {children}
        </DataContext.Provider>
    )
}