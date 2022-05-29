import axios from "axios"
import React, { useState, useContext, useEffect } from "react"
import { DataContext } from "../../context/DataContext"
import web3 from "../../tokensDev/canes/canes"
import Loader from "../../components/loader/loader"
import changeStateCanodrome from "../../context/services/changeStateCanodrome"
import { Link } from "react-router-dom"
import socket from '../../socket';
import errorManager from '../../services/errorManager'
import enviroment from "../../env"
import { nftContractProd } from "../../tokensProd/canes/canes"
import { testNftContract } from "../../tokensDev/canes/canes"

import commonCanodrome from '../../img/canodromes/common.webp'
import rareCanodrome from '../../img/canodromes/rare.webp'
import epicCanodrome from '../../img/canodromes/epic.webp'
import legendaryCanodrome from '../../img/canodromes/legendary.webp'
import '../../css/pages/marketCanodrome.scss'

let nftContract
if (process.env.REACT_APP_ENVIROMENT == "prod") nftContract = nftContractProd()
if (process.env.REACT_APP_ENVIROMENT == "dev") nftContract = testNftContract()

const MarketCanodromes = () => {

    const { gas, gasPrice, wallet, setLoading, loading, getCanodromes } = useContext(DataContext)
    const _context = useContext(DataContext)
    const [canodrome, setCanodrome] = useState(false)
    const [renderModal, setRenderModal] = useState(false)
    const apiMarket = enviroment().baseurl + 'marketplace'

    //market canodromes
    const [order, setOrder] = useState(1)
    const [canodromesMarket, setCanodromesMarket] = useState([])
    const [canodromes, setCanodromes] = useState([])
    const [commonCheck, setCommonCheck] = useState(true)
    const [rareCheck, setRareCheck] = useState(true)
    const [epicCheck, setEpicCheck] = useState(true)
    const [legendaryCheck, setLegendaryCheck] = useState(true)

    useEffect(() => {
        if (canodromes.length == 0) fetch(apiMarket)
        filterCanodromes()
    }, [canodromes]);

    // from websocket
    socket.on('canodromesMarket', async canodromesData => {
        setCanodromes(canodromesData)
        console.log("socket del market Canodromed")
    })

    const filterCanodromes = async () => {
        const filteredCanodromes = canodromes.filter(item => item.status == 1)
            .sort((price1, price2) => orderFunction(price1, price2))
            .filter(canodrmeX => filterCheckboxCanodrome(canodrmeX))
        setCanodromesMarket(filteredCanodromes)
    }

    const confirmBuy = async () => {
        setLoading(true)
        setRenderModal(false)
        const storage = JSON.parse(localStorage.getItem('windowsData2'))
        console.table(storage)
        if (!storage) {

            localStorage.setItem('windowsData2', JSON.stringify({ id: canodrome._id }));
            setTimeout(() => {
                const _storage = JSON.parse(localStorage.getItem('windowsData2')) || null
                console.log(_storage)
                if (_storage) {
                    changeStateCanodrome(_storage)
                }
            }, 200000);

            try {

                console.log("comprando bien aki")
                const apiGetCan = enviroment().baseurl + "canodrome?id=" + canodrome._id
                const canObj = await axios.get(apiGetCan)
                console.table("obtener un canodromo:", canObj)
                if (canObj.status == 3) throw "Esta en proceso de venta"

                //cobro y envio a el contrato
                const from = wallet
                const price = canodrome.onSale.price.toString()
                console.log(price)
                const value = web3.utils.toWei(canodrome.onSale.price.toString(), "ether")
                const address = canodrome.wallet

                nftContract.methods.buyNft(address).send({ from, value, gas, gasPrice }).then(async blockchainRes => {
                    localStorage.removeItem('windowsData2');
                    console.log(blockchainRes);
                    //envio el hash de la compra al back
                    try {
                        const body = {
                            canodrome: {
                                onSale: {
                                    sale: false,
                                    price: 0
                                },
                                wallet
                            }
                        }
                        const res = await axios.patch(enviroment().baseurl + "canodrome/sell/" + canodrome._id, body)//cambia a estado 3 de espera
                        const _can = res.data.response
                        console.log("este es el can: ", _can)
                        await getCanodromes(wallet)
                        setLoading(false)
                        alert("Congratulation!! you have a new canodrome, go to canodrome section")
                    } catch (error) {
                        errorManager(error)
                        setLoading(false)
                    }
                    //console.log(envio.data.response)
                }).catch(error => {
                    setLoading(false)
                    errorManager(error)
                    /* const trans = await axios.post(apiMarket, { "blockchainStatus": false, canId })
                    console.log(trans) */
                })
            } catch (error) {
                setLoading(false)
                errorManager(error)
            }
        } else {
            setLoading(false)
            window.location.reload()

        }
    }

    //order form filter
    const orderFunction = (price1, price2) => {
        let orderAux;
        (order == 1) ? orderAux = -1 : orderAux = 1;
        if (price1.onSale.price > price2.onSale.price) return order;
        if (price1.onSale.price < price2.onSale.price) return orderAux;
        return 0;
    }

    const filterCheckboxCanodrome = (canodrmeX) => {
        if (commonCheck == false && rareCheck == false && epicCheck == false && legendaryCheck == false) return canodrmeX;
        if (commonCheck == true && canodrmeX.type == 1) return canodrmeX;
        if (rareCheck == true && canodrmeX.type == 2) return canodrmeX;
        if (epicCheck == true && canodrmeX.type == 3) return canodrmeX;
        if (legendaryCheck == true && canodrmeX.type == 4) return canodrmeX;
    }

    const setRarity = (rarity) => {
        const r = ["commonCanodrome", "rareCanodrome", "epicCanodrome", "legendaryCanodrome"]
        return r[rarity]
    }

    const clear = () => {
        setCommonCheck(true)
        setRareCheck(true)
        setEpicCheck(true)
        setLegendaryCheck(true)
        setOrder(1)
    }

    return (
        <div>
            {loading && <Loader />}
            {renderModal &&
            <div className='modalX canodrome'>
                <div className='canModalIn'>
                    <div className="container-fluid">
                        <div className="row gx-2">
                            <div className="modal-canodrome col-6">
                                <div className='options'>
                                    <h4>You are buying:</h4>
                                </div>
                                <div className="price">
                                    <div className='canInfo'>  
                                        <span># {canodrome.id}</span>                                
                                        {canodrome.type == 1 && <div className="common px-3"> Common </div>}
                                        {canodrome.type == 2 && <div className="rare px-3"> Rare </div>}
                                        {canodrome.type == 3 && <div className="epic px-3"> Epic </div>}
                                        {canodrome.type == 4 && <div className="legendary px-3"> Legendary </div>}
                                    </div>
                                    <div className='text-warning'> Price: {canodrome && canodrome.onSale.price} BNB </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className='canPhoto'> 
                                    <div className='nftId'>
                                        {canodrome.type == 1 && <img className='imgNft' src={commonCanodrome} alt="" />}
                                        {canodrome.type == 2 && <img className='imgNft' src={rareCanodrome} alt="" />}
                                        {canodrome.type == 3 && <img className='imgNft' src={epicCanodrome} alt="" />}
                                        {canodrome.type == 4 && <img className='imgNft' src={legendaryCanodrome} alt="" />}
                                    </div>
                                   
                                </div>
                                
                            </div>
                            <div className="d-flex col-12 pt-2">
                                {/* <div className='selectedCanHeading'>  */}
                                    <button className='btn btn-danger form-control btnModal' onClick={_ => { setCanodrome(false); setRenderModal(false) }}> Cancel </button>
                                    <button className='btn btn-warning form-control  btnModal' onClick={_ => confirmBuy()} > Buy </button>
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
            <div className="container-fluid">
                <div className="secondNav mt-50px mb-3 item-bar">
                    <Link to="/market" className="secondNavButton btn-bar">
                        Cans
                    </Link>
                    <Link to="/marketcanodromes" className="secondNavButton active btn-bar">
                        Canodromes
                    </Link>
                    <Link to="/marketItems" className="secondNavButton btn-bar">
                        Items
                    </Link>
                </div>

                <div className="row">
                    <div className="col-3">
                        <div className="filter">
                            <div className="d-flex justify-content-between align-items-center">
                                <b>Filter</b>
                                <button onClick={clear} className="btn btn-primary btn-sm" href="">Clear filter</button>
                            </div>
                            <div className="mt-3">
                                <div className="sidebarText mb-1">
                                    Order by price: {order == 1 ? "Ask" : "Desc"}
                                </div>
                                <select onChange={e => setOrder(e.target.value)} className="select" name="" id="">
                                    <option className="optionFilter" value={1}>Price Ask</option>
                                    <option className="optionFilter" value={-1}>Price Desk</option>
                                </select>
                            </div>
                            <div className="mt-3">
                                <div className="sidebarText mb-1">
                                    Rarity
                                </div>
                                <div>
                                    <div className="row">
                                        <div className="col-6 textRaza">
                                            <div>
                                                <input onChange={e => setCommonCheck(e.target.checked)} type="checkbox" name="commonCheck" id="1" checked={commonCheck} /> Common
                                            </div>
                                            <div>
                                                <input onChange={e => setRareCheck(e.target.checked)} type="checkbox" name="" id="" checked={rareCheck} /> Rare
                                            </div>
                                        </div>
                                        <div className="col-6 textRaza">
                                            <div>
                                                <input onChange={e => setEpicCheck(e.target.checked)} type="checkbox" name="" id="" checked={epicCheck} /> Épic
                                            </div>
                                            <div>
                                                <input onChange={e => setLegendaryCheck(e.target.checked)} type="checkbox" name="" id="" checked={legendaryCheck} /> Legendary
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <button onClick={filterCanodromes} className="w-100 btn btn-primary text-light" type="button" name="" id="" > Find </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-9 ">

                        {canodromesMarket.length != 0 && <>

                            <div className="mb-2">
                                <div>{canodromesMarket.length} Canodromes Listed  </div>
                            </div>
                            <div className="container">
                                <div className="row">
                                    {canodromesMarket.length != 0 && canodromesMarket.map((item) => {
                                        return (
                                            <div key={item._id}  className="col-3 p-1">
                                                <div className="nftCard p-2 w-100 mb-1" onClick={() => { setCanodrome(item); setRenderModal(true) }}>

                                                <div className="canodromeCardMarket">
                                                    <div className="">
                                                        <div className="nftCard-header">
                                                            <div>{item.onSale.price}<br/> BNB </div>                
                                                            <div className="button-market px-1 lb-color item-id">#{item.id}<br/> {_context.lastForWallet(item.wallet)}</div>
                                                        </div>
                                                    </div>
                                                    <div>    
                                                        {item.type == 1 && <img className="w-100" src={commonCanodrome} alt="" />}
                                                        {item.type == 2 && <img className="w-100" src={rareCanodrome} alt="" />}
                                                        {item.type == 3 && <img className="w-100" src={epicCanodrome} alt="" />}
                                                        {item.type == 4 && <img className="w-100" src={legendaryCanodrome} alt="" />}
                                                    </div>
                                                    <div className=''>
                                                        <div className="lb-color"> 
                                                            {item.type == 1 && <div className="rarity common px-3"> Common </div>}
                                                            {item.type == 2 && <div className="rarity rare px-3"> Rare </div>}
                                                            {item.type == 3 && <div className="rarity epic px-3"> Epic </div>}
                                                            {item.type == 4 && <div className="rarity legendary px-3"> Legendary </div>}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {/* <button onClick={() => { setCanodrome(item); setRenderModal(true) }} className="btn btn-primary form-control"> Buy </button> */}
                                                    </div>
                                                </div>
                                            </div></div>
                                        )
                                    })
                                    }
                                </div>
                            </div>
                        </>}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MarketCanodromes