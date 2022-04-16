import axios from "axios"
import React, { useState, useContext, useEffect } from "react"
import { DataContext } from "../../context/DataContext"
import web3, { nftContract } from "../../tokens/canes/canes"
import Loader from "../../components/loader/loader"
import changeStateCanInMarket from "../../context/services/changeStateCanInMarket"
import { Link } from "react-router-dom"
import socket from '../../socket';

const MarketCanodromes = () => {

    const { _context, canodromeMarket, setLoading, loading } = useContext(DataContext)

    const [canodrome, setCanodrome] = useState(false)
    const [renderModal, setRenderModal] = useState(false)
    const apiMarket = process.env.REACT_APP_BASEURL + 'marketplace'

    //market canodromes
    const [order, setOrder] = useState(1)
    const [canodromesMarket, setCanodromesMarket] = useState([])
    const [canodromes, setCanodromes] = useState([])
    const [orderCanodromes, setOrderCanodromes] = useState(1)
    const [commonCheck, setCommonCheck] = useState(true)
    const [rareCheck, setRareCheck] = useState(true)
    const [epicCheck, setEpicCheck] = useState(true)
    const [legendaryCheck, setLegendaryCheck] = useState(true)

    // const refresh = async () => {
    //     await fetch(process.env.REACT_APP_BASEURL + 'marketplace')
    // }
    useEffect(() => {
        if(canodromes.length == 0)fetch(apiMarket);
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
        const storage = JSON.parse(localStorage.getItem('windowsData'))
        if (!storage) {
            localStorage.setItem('windowsData', JSON.stringify({ id: canodrome.id }));
            setLoading(true)
            setRenderModal(false)
            const canId = canodrome.id

            setTimeout(() => {
                const _storage = JSON.parse(localStorage.getItem('windowsData')) || null
                console.log(_storage)
                if (_storage) {
                    console.log("este es el timeout")
                    changeStateCanInMarket(_storage)
                }
            }, 200000);

            try {

                console.log("comprando bien aki")
                const apiGetCan = process.env.REACT_APP_BASEURL + "Canodromes/" + canId
                const canObj = await axios.get(apiGetCan)
                if (canObj.status == 3) throw "Esta en proceso de venta"

                const res = await axios.patch(apiMarket, { canId })//cambia a estado 3 de espera
                const _can = res.data.response
                console.log(res.data.response)
                //cobro y envio a el contrato
                const from = _context.wallet
                const price = _can.onSale.price.toString()
                console.log(price)
                const value = web3.utils.toWei(_can.onSale.price.toString(), "ether")
                const address = _can.wallet

                nftContract.methods.buyNft(address).send({ from: _context.wallet, value, gas: _context.gas, gassPrice: _context.gassPrice }).then(async blockchainRes => {
                    localStorage.removeItem('windowsData');
                    console.log(blockchainRes);
                    //envio el hash de la compra al back
                    try {
                        await axios.post(apiMarket, {
                            canId: _can.id,
                            walletBuyer: _context.wallet,
                            hash: blockchainRes.transactionHash
                        })
                    } catch (error) {
                        console.log("error: " + error)
                        console.log(error)
                    }
                    // await refresh()
                    //await _context.getCanodromes(_context.wallet)
                    //console.log(envio.data.response)
                }).catch(async error => {
                    console.log("Rechazo la transaccion")
                    console.log(error)
                    const trans = await axios.post(apiMarket, { "blockchainStatus": false, canId })
                    console.log(trans)
                    await setLoading(false)
                })
            } catch (error) {
                console.log(error)
            }
        } else {
            alert("Usted tiene una transaccion pendiente por favor espere 3 minutos")
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
        if (rarity === "1") { return "common" }
        if (rarity === "2") return "rare"
        if (rarity === "3") return "epic"
        if (rarity === "4") return "legendary"
    }

    return (
        <div>
            {loading && <Loader />}
            {renderModal &&
                <div className="modalX">
                    <div className="modalIn">
                        <div className="w-100">
                            <div className="modalHeader">
                                <h3>
                                    Estas comprando:
                                </h3>
                                {canodrome.name}
                                <div>Rarity: {setRarity(canodrome.rarity)}</div>
                                <div>
                                    precio <b className="text-warning">{canodrome.onSale.price} BNB</b>
                                </div>
                            </div>
                            <div className="w-50 d-flex justify-content-around">
                                <button onClick={_ => { setCanodrome(false); setRenderModal(false) }} className="btn btn-danger mx-1"> Cancel </button>
                                <button onClick={_ => confirmBuy()} className="btn btn-primary mx-1"> Confirm </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className="container-fluid">
                <div className="secondNav mt-50px mb-3 ">
                    <Link to="/market" className="secondNavButton active">
                        Cans
                    </Link>
                    <Link to="/marketcanodromes" className="secondNavButton">
                        Canodromes
                    </Link>
                    <button className="secondNavButton">
                        Items
                    </button>
                </div>

                <div className="row">
                    <div className="col-3">
                        <div className="sidebar-bg">
                            <div className="d-flex justify-content-between align-items-center">
                                <b>Filter</b>
                                <button className="btn btn-primary btn-sm" href="">Clear filter</button>
                            </div>
                            <div className="mt-3">
                                <div className="sidebarText mb-1">
                                    Order by price: {orderCanodromes == 1 ? "Ask" : "Desc"}
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
                    <div className="col-9">
                        {canodromesMarket.length == 0 ? <>
                            <div className="text-center mt-5">
                                {/* <button onClick={refresh} className="btn btn-primary"> Refresh Market </button> */}
                            </div>
                        </> : <>

                            <div className="mb-2">
                                <div>{canodromesMarket.length} Canodromes Listed  </div>
                            </div>
                             <div className="row">
                             {canodromesMarket.length != 0 && canodromesMarket.map((item) => {
                                    return (
                                        <div key={item._id} className="col-4 border">
                                          <div>id: {item.id}</div>  
                                          <div>price: {item.onSale.price}</div>  
                                          <div>type: {item.type}</div>  
                                          <div> <button className="btn btn-primary"> Buy </button> </div>
                                          
                                        </div>
                                    )
                                })
                                }
                            </div> 
                        </>}
                    </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MarketCanodromes