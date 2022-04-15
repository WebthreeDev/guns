import axios from "axios"
import React, { useEffect, useState, useContext } from "react"
import perro from '../../img/perro.png'
import { DataContext } from "../../context/DataContext"
import web3, { nftContract } from "../../tokens/canes/canes"
import Loader from "../../components/loader/loader"
import NftCard from "../../components/nftCard/nftCard"
import changeStateCanInMarket from "../../context/services/changeStateCanInMarket"
import { Link } from "react-router-dom"
const Market = () => {
    const _context = useContext(DataContext)
    const {order, setOrder,commonCheck, setCommonCheck,
        rareCheck, setRareCheck,epicCheck, setEpicCheck,
        legendaryCheck, setLegendaryCheck,rangoMin, setRangoMin,
        rangoMax, setRangoMax
    } = useContext(DataContext)
    const apiMarket = process.env.REACT_APP_BASEURL + 'marketplace'

    const [renderModal, setRenderModal] = useState(false)
    const [can, setCan] = useState(false)
    
    const setModalText =()=>{}

    const refresh = async () => {
        await fetch(process.env.REACT_APP_BASEURL + 'marketplace')
    }

    const filterCans = async () => {
       await fetch(process.env.REACT_APP_BASEURL + 'marketplace')  
    }

    const confirmBuy = async () => {
        const storage = JSON.parse(localStorage.getItem('windowsData'))
        if (!storage) {
            localStorage.setItem('windowsData', JSON.stringify({ id: can.id }));
            _context.setLoading(true)
            setRenderModal(false)
            const canId = can.id

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
                const apiGetCan = process.env.REACT_APP_BASEURL + "cans/" + canId
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
                    await filterCans()
                    await _context.getCans(_context.wallet)
                    //console.log(envio.data.response)
                }).catch(async error => {
                    console.log("Rechazo la transaccion")
                    console.log(error)
                    const trans = await axios.post(apiMarket, { "blockchainStatus": false, canId })
                    console.log(trans)
                    await _context.setLoading(false)
                })
            } catch (error) {
                console.log(error)
            }
        } else {
            alert("Usted tiene una transaccion pendiente por favor espere 3 minutos")
        }

    }

    return (
        <div>
            {_context.loading && <Loader />}
            {renderModal &&
                <div className="modalX">
                    <div className="modalIn">
                        <div className="w-100">
                            <div className="modalHeader">
                                <h3>
                                    Estas comprando:
                                </h3>
                                {can.name}
                                <div>Rarity: {_context.setRarity(can.rarity)}</div>
                                <div>
                                    precio <b className="text-warning">{can.onSale.price} BNB</b>
                                </div>
                            </div>
                            <div className="w-50 d-flex justify-content-around">
                                <button onClick={_ => { setCan(false); setRenderModal(false) }} className="btn btn-danger mx-1"> Cancel </button>
                                <button onClick={_ => confirmBuy()} className="btn btn-primary mx-1"> Confirm </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className="container-fluid">
                <div className="secondNav mt-50px mb-3">
                    <Link to="/market" className="secondNavButton active">
                        <div>
                            Cans

                        </div>
                    </Link>
                    <Link to="/marketcanodromes" className="secondNavButton">
                        Canodromes
                    </Link>
                    <button className="secondNavButton">
                        Items
                    </button>
                </div>
                <div className="row">
                    <div className="col-3 sidebarx">
                        <div className="sidebar-bg">
                            <div className="d-flex justify-content-between align-items-center">
                                <b>Filter</b>
                                <button className="btn btn-primary btn-sm" href="">Clear filter</button>
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
                                <div className=" mb-1 d-flex align-items-center justify-content-between">
                                    <div className="sidebarText">
                                        Stats
                                    </div>
                                    <div>
                                        <h3 className="breedCount"> min {rangoMin} max {rangoMax}</h3>
                                    </div>
                                </div>
                                <div>
                                    <input onChange={e => setRangoMin(e.target.value)} min="200" max={rangoMax} className="w-100" type="range" value={rangoMin} name="" id="" />
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
                    <div className="col-9">
                        {_context.cansMarket.length == 0 ? <>
                            <div className="text-center mt-5">
                                <button onClick={refresh} className="btn btn-primary"> Refresh Market </button>
                            </div>
                        </> : <>

                            <div className="mb-2">
                                <div>{_context.cansMarket.length} Cans Listed  </div>
                            </div>
                            <div className="row gx-2 gy-2 pb-5">
                                {_context.cansMarket.map((item) => {
                                    return (
                                        <div key={item.id} className="col-4">
                                            <NftCard
                                                setRenderModal={setRenderModal}
                                                setModalText={setModalText}
                                                setCan={setCan}
                                                item={item}
                                                btnPrice={true}
                                            />
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
    )
}
export default Market