import axios from "axios"
import React, { useState, useContext, useEffect } from "react"
import { DataContext } from "../../context/DataContext"
import web3 from "../../tokens/canes/canes"
import Loader from "../../components/loader/loader"
import changeStateCanodrome from "../../context/services/changeStateCanodrome"
import { Link } from "react-router-dom"
import socket from '../../socket';
import canodromo from '../../img/canodrome.png'
import errorManager from '../../services/errorManager'

const MarketCanodromes = () => {

    const { nftContract,gas, gasPrice, wallet, setLoading, loading, getCanodromes } = useContext(DataContext)
    const _context = useContext(DataContext)
    const [canodrome, setCanodrome] = useState(false)
    const [renderModal, setRenderModal] = useState(false)
    const apiMarket = process.env.REACT_APP_BASEURL + 'marketplace'

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
                const apiGetCan = process.env.REACT_APP_BASEURL + "canodrome?id=" + canodrome._id
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
                        const res = await axios.patch(process.env.REACT_APP_BASEURL + "canodrome/sell/" + canodrome._id, body)//cambia a estado 3 de espera
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
        if (rarity === "1") { return "common" }
        if (rarity === "2") return "rare"
        if (rarity === "3") return "epic"
        if (rarity === "4") return "legendary"
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
                <div className="modalX">
                    <div className="modalIn">
                        <div className="w-100">
                            <div className="modalHeader">
                                <h3>
                                    Estas comprando:
                                </h3>
                                {console.log(canodrome)}
                                <div> Canodrome
                                    {canodrome.type == 1 && <div className="rarity common px-3"> Common </div>}
                                    {canodrome.type == 2 && <div className="rarity rare px-3"> Rare </div>}
                                    {canodrome.type == 3 && <div className="rarity epic px-3"> Epic </div>}
                                    {canodrome.type == 4 && <div className="rarity legendary px-3"> Legendary </div>}
                                </div>
                                <div>
                                    precio <b className="text-warning">{canodrome && canodrome.onSale.price} BNB</b>
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
                    <Link to="/market" className="secondNavButton">
                        Cans
                    </Link>
                    <Link to="/marketcanodromes" className="secondNavButton active">
                        Canodromes
                    </Link>
                    <Link to="/marketItems" className="secondNavButton">
                        Items
                    </Link>
                </div>

                <div className="row">
                    <div className="col-3">
                        <div className="sidebar-bg">
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
                                            <div key={item._id} className="col-4 p-2">
                                                <div className="canodromeCardMarket">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>#{item.id}</div>
                                                        <div>{_context.lastForWallet(item.wallet)} </div>
                                                        <div>
                                                            {item.type == 1 && <div className="rarity common px-3"> Common </div>}
                                                            {item.type == 2 && <div className="rarity rare px-3"> Rare </div>}
                                                            {item.type == 3 && <div className="rarity epic px-3"> Epic </div>}
                                                            {item.type == 4 && <div className="rarity legendary px-3"> Legendary </div>}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <img className="w-100" src={canodromo} alt="" />
                                                    </div>
                                                    <div className="price-canodrome text-warning text-center">
                                                        {item.onSale.price} BNB
                                                    </div>
                                                    <div>
                                                        <button onClick={() => { setCanodrome(item); setRenderModal(true) }} className="btn btn-primary form-control"> Buy </button>
                                                    </div>
                                                </div>
                                            </div>
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