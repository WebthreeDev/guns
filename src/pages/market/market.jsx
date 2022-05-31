import axios from "axios"
import React, { useEffect, useState, useContext } from "react"
import { DataContext } from "../../context/DataContext"
import web3 from "../../tokensDev/canes/canes"
import Loader from "../../components/loader/loader"
import NftCard from "../../components/nftCard/nftCard"
import changeStateCanInMarket from "../../context/services/changeStateCanInMarket"
import { Link } from "react-router-dom"
import socket from '../../socket';
import enviroment from "../../env"
import { nftContractProd } from "../../tokensProd/canes/canes"
import { testNftContract } from "../../tokensDev/canes/canes"
import '../../css/pages/market.scss'

import commonNft from '../../img/nfts/common.webp'
import rareNft from '../../img/nfts/rare.webp'
import epicNft from '../../img/nfts/epic.webp'
import legendaryNft from '../../img/nfts/legendary.webp'

import Card from '../../components/card/card'

let nftContract
if (process.env.REACT_APP_ENVIROMENT == "prod") nftContract = nftContractProd()
if (process.env.REACT_APP_ENVIROMENT == "dev") nftContract = testNftContract()

const Market = () => {


    const { wallet, setLoading, loading } = useContext(DataContext)
    const _context = useContext(DataContext)
    const apiMarket = enviroment().baseurl + 'marketplace'

    const [renderModal, setRenderModal] = useState(false)
    const [can, setCan] = useState(false)

    //market cans
    const [order, setOrder] = useState(1)
    const [rareCheck, setRareCheck] = useState(true)
    const [commonCheck, setCommonCheck] = useState(true)
    const [epicCheck, setEpicCheck] = useState(true)
    const [legendaryCheck, setLegendaryCheck] = useState(true)
    const [rangoMin, setRangoMin] = useState(200)
    const [rangoMax, setRangoMax] = useState(360)
    const [canMarket, setCanMarket] = useState([])
    const [cans, setCans] = useState([]);
    const [alert, setAlert] = useState({ status: false, title: "", btn: "" })

    const setModalText = () => { }

    useEffect(() => {
        if (cans.length == 0) fetch(apiMarket)
        console.log("socket del market", apiMarket)
        filterCans()
    }, [cans]);

    socket.on('data', async cansData => {
        setCans(cansData)
        console.log("socket del market")
    })

    const filterCans = async () => {
        const filteredCans = cans.filter(item => item.status == 1)
            .sort((price1, price2) => orderFunction(price1, price2))
            .filter(dog => filterCheckbox(dog))
            .filter(dog => filterRank(dog));
        setCanMarket(filteredCans)
    }

    const confirmBuy = async () => {
        setLoading(true)
        setRenderModal(false)

        const storage = JSON.parse(localStorage.getItem('windowsData'))
        if (!storage) {
            localStorage.setItem('windowsData', JSON.stringify({ id: can.id }));
            setTimeout(() => {
                const _storage = JSON.parse(localStorage.getItem('windowsData')) || null
                console.log(_storage)
                if (_storage) {
                    console.log("este es el timeout")
                    changeStateCanInMarket(_storage)
                }
            }, 200000);

            try {

                const canId = can.id
                const apiGetCan = enviroment().baseurl + "cans/" + canId
                const canObj = await axios.get(apiGetCan)
                if (canObj.status == 3) throw "Esta en proceso de venta"

                const res = await axios.patch(apiMarket, { canId })//cambia a estado 3 de espera
                const _can = res.data.response
                console.log(res.data.response)
                //cobro y envio a el contrato
                const from = wallet
                const price = _can.onSale.price.toString()
                console.log(price)
                const value = web3.utils.toWei(_can.onSale.price.toString(), "ether")
                const address = _can.wallet

                nftContract.methods.buyNft(address).send({ from, value }).then(async blockchainRes => {
                    localStorage.removeItem('windowsData');
                    console.log(blockchainRes);
                    //envio el hash de la compra al back
                    try {
                        await axios.post(apiMarket, {
                            canId: _can.id,
                            walletBuyer: _context.wallet,
                            hash: blockchainRes.transactionHash
                        })
                        setLoading(false)
                        // await _context.getCans(_context.wallet)
                        await filterCans()
                        // console.log(envio.data.response)
                        console.log("aqui actualizar el estado...")
                        setCans([])
                    } catch (error) {
                        console.log("error: " + error)
                        console.log(error)
                    }

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
            setLoading(false)
            handlertAlert(true, "You have a pending transaction please wait 3 minutes", "Continue")
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

    //filter checkbox
    const filterCheckbox = (dog) => {
        if (commonCheck == false && rareCheck == false && epicCheck == false && legendaryCheck == false) return dog;
        if (commonCheck == true && dog.rarity == 1) return dog;
        if (rareCheck == true && dog.rarity == 2) return dog;
        if (epicCheck == true && dog.rarity == 3) return dog;
        if (legendaryCheck == true && dog.rarity == 4) return dog;
    }

    //filter range
    const filterRank = (dog) => {
        let totalStats = dog.aerodinamica + dog.aceleracion + dog.resistencia;
        if (totalStats >= rangoMin && totalStats <= rangoMax) return dog;
    }

    const setRarity = (rarity) => {
        const r = ["common", "rare", "epic", "legendary"]
        return r[rarity]
    }

    const clear = () => {
        setOrder(1)
        setRareCheck(true)
        setCommonCheck(true)
        setEpicCheck(true)
        setLegendaryCheck(true)
        setRangoMin(200)
        setRangoMax(360)
    }
    const openCanModal = (can) => {
        setRenderModal(true)
        setCan(can)
    }


    const handlertAlert = (status = false, title = "", btn = "") => {
        setAlert({
            status,
            title,
            btn
        })
    }
    return (
        <div>
            {loading && <Loader />}
            {alert.status && <div className="modalX">
                <div className="">
                    <div className="w-100 d-flex align-items-center justify-content-center h-100">
                        <div className="text-center w-100">
                            <h5 className="">
                                {alert.title}
                            </h5>
                            <button className="btn btn-primary" onClick={() => handlertAlert(false, "", "")}> {alert.btn} </button>
                        </div>
                    </div>
                </div>
            </div>}
            {renderModal &&
                <div className='modalX'>
                    <div className='canModalIn'>
                        <div className="container-fluid">
                            <div className="row gx-2">
                                <div className="col-6">
                                    <div className='options'>
                                        <h4>You are buying:</h4>
                                    </div>
                                    <div className='canPhoto'>

                                        <div className='stats'>
                                            <div className='totalStats'>Total stats</div>
                                            <div className='statsNumber'>{can.aceleracion + can.aerodinamica + can.resistencia}</div>
                                        </div>
                                        <div className='rarity'>
                                            <p>{setRarity(Number(can.rarity) - 1)}</p>
                                        </div>
                                        <div className='nftId'>
                                            # {can.id}
                                        </div>
                                        {can.rarity == 1 && <img className='imgNft' src={commonNft} alt="" />}
                                        {can.rarity == 2 && <img className='imgNft' src={rareNft} alt="" />}
                                        {can.rarity == 3 && <img className='imgNft' src={epicNft} alt="" />}
                                        {can.rarity == 4 && <img className='imgNft' src={legendaryNft} alt="" />}

                                    </div>

                                </div>
                                <div className="col-6">
                                    <div className='canInfo'>
                                        <div className='w-energy'>
                                            <div className='energy'>
                                                <div>
                                                    Energy:
                                                </div>
                                                <div>
                                                    {can && can.energy}/4
                                                </div>
                                            </div>
                                            <div>
                                                <progress value={can.energy} min="0" max="4" className='progressEnergy'> </progress>
                                            </div>
                                        </div>
                                        <div className='energy mt-3'>
                                            <div>Aerodinamic:</div>
                                            <div>{can && can.aerodinamica}</div>
                                        </div>
                                        <div className='energy mt-3'>
                                            <div>Aceleration:</div>
                                            <div>{can && can.aceleracion}</div>
                                        </div>
                                        <div className='energy mt-3'>
                                            <div>Resistence:</div>
                                            <div>{can && can.resistencia}</div>
                                        </div>

                                        <div>
                                            {can.onSale.sale &&
                                                <div className='d-flex align-items-center justify-content-between'>
                                                    <div className='text-warning'> Price: {Number.parseFloat(can.onSale.price)} BNB </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 p-1">
                                    <div className='selectedCanHeading'>
                                        <button className='btn btn-danger btnModal' onClick={_ => { setCan(false); setRenderModal(false) }}> Cancel </button>
                                        <button className='btn btn-warning btnModal' onClick={_ => confirmBuy()}> Buy </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className="container-fluid">
                <div className="secondNav mt-50px mb-3 item-bar">
                    <Link to="/market" className="secondNavButton active btn-bar">
                        <div>
                            Cans
                        </div>
                    </Link>
                    <Link to="/marketcanodromes" className="secondNavButton btn-bar">
                        Canodromes
                    </Link>
                    <Link to="/marketItems" className="secondNavButton btn-bar">
                        Items
                    </Link>
                </div>
                <div className="row">
                    <div className="col-12 col-sm-5 col-md-3 mb-4">
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
                            <div className="">
                                <div className="">
                                    <div className="sidebarText">
                                        Stats
                                    </div>
                                    <div>
                                        <h3 className="breedCount"> min {rangoMin}</h3>
                                    </div>
                                </div>
                                <div>
                                    <input onChange={e => setRangoMin(e.target.value)} min="200" max={rangoMax} className="w-100" type="range" value={rangoMin} name="" id="" />
                                </div>
                                <div>
                                    <h3 className="breedCount"> max {rangoMax}</h3>
                                </div>
                                <div>
                                    <input onChange={e => setRangoMax(e.target.value)} min={rangoMin} max="360" className="w-100" type="range" value={rangoMax} name="" id="" />
                                </div>
                            </div>
                            <div className="mt-3">
                                <button onClick={filterCans} className="w-100 btn btn-primary text-light" type="button" name="" id="" > Find </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-7 col-md-9">
                        {canMarket.length == 0 ? <>
                            <div className="text-center mt-5">
                                {/* <button onClick={refresh} className="btn btn-primary"> Refresh Market </button> */}
                            </div>
                        </> : <>

                            <div className="mb-2">
                                <div>{canMarket.length} Cans Listed  </div>
                            </div>
                            <div className="container p-0">
                                <div className="row">
                                    {canMarket.map((item) => {
                                        return (
                                            <div key={item.id} className="col-12 col-md-6 col-lg-3">
                                                <Card openCanModal={openCanModal} sale={false} can={item} btnPrice={true} />
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
export default Market