import axios from "axios"
import React, { useEffect, useState, useContext } from "react"
import { DataContext } from "../../context/DataContext"
import web3, { nftContract } from "../../tokens/canes/canes"
import Loader from "../../components/loader/loader"
import NftCard from "../../components/nftCard/nftCard"
import changeStateCanInMarket from "../../context/services/changeStateCanInMarket"
import { Link } from "react-router-dom"

const MarketCanodromes = () => {
    const _context = useContext(DataContext)
    const [canodromesList, setcanodromesList] = useState(false)
    const [commonCheck, setCommonCheck] = useState(false)
    const [rareCheck, setRareCheck] = useState(false)
    const [epicCheck, setEpicCheck] = useState(false)
    const [legendaryCheck, setLegendaryCheck] = useState(false)
    const [order, setOrder] = useState(1)
    /*   
  
      const [renderModal, setRenderModal] = useState(false)
      const [modalText, setModalText] = useState(false)
      const [can, setCan] = useState(false)
      //filter checkbox
      
      const apiMarket = process.env.REACT_APP_BASEURL + 'marketplace' */

    //useEffect(() => {
    //getcanodromesOnSell()
    //console.log(_context.canodromesMarket)
    //fetch(process.env.REACT_APP_BASEURL + 'marketplace')
    //}, [])

    /* const getcanodromesOnSell = async () => {
        _context.setLoading(true)
        const filteredCanodromes = await _context.canodromesMarket.filter(item => item.status == 1)
            .sort((price1, price2) => orderFunction(price1, price2))
            .filter(dog => filterCheckbox(dog))
        setcanodromesList(filteredCanodromes)
        await _context.setLoading(false)
    } */

    /* const filterCheckbox = (dog) => {
        if (commonCheck == false && rareCheck == false && epicCheck == false && legendaryCheck == false) return dog;
        if (commonCheck == true && dog.rarity == 1) return dog;
        if (rareCheck == true && dog.rarity == 2) return dog;
        if (epicCheck == true && dog.rarity == 3) return dog;
        if (legendaryCheck == true && dog.rarity == 4) return dog;
    } */

    //order form filter
    /* const orderFunction = (price1, price2, orderAux) => {
        (order == 1) ? orderAux = -1 : orderAux = 1;
        if (price1.onSale.price > price2.onSale.price) return order;
        if (price1.onSale.price < price2.onSale.price) return orderAux;
        return 0;
    } */

    /*

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
                    await getCanodromesOnSell()
                    await _context.getCanodromes(_context.wallet)
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

    

    //filter checkbox
    

    //filter range
    const filterRank = (dog) => {
        let totalStats = dog.aerodinamica + dog.aceleracion + dog.resistencia;
        if (totalStats >= rangoMin && totalStats <= rangoMax) return dog;
    }

    const find = async () => {
        const newList = dogList.sort((price1, price2) => {
            orderFunction(price1, price2)
        })
            .filter(dog => filterCheckbox(dog))
            .filter(dog => filterRank(dog));
        setdogList(newList);
        getCanodromesOnSell();
    } */

    return (
        <div>
            {_context.loading && <Loader />}
            {/* {renderModal &&
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
                    <div className="col-3 sidebar">
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
                            
                        </div>
        </div>*/}
            <div className="col-9 listItems pt-5 border">

                <div className="justify-content-between d-flex align-items-center">
                    <h3> {canodromesList ? <> {canodromesList.length} Canodromes Listed </> : <> 0 Canodromes Listed</>}</h3> 

                </div>
                <div>
                 {_context.canodromesMarket.lenght != 0 && <>
                    {_context.canodromesMarket.map((item)=>{
                        return <div key={item._id} className="bortder p-2 m-2"> {item._id} </div>
                    })}
                 </>}
                </div>
                {/* <div className="row gx-2 gy-2 pb-5">
                            {dogList &&
                                dogList.map((item) => {
                                    return (
                                        <div key={item.id} className="col-4">
                                            {item.id}
                                        </div>
                                    )
                                })
                            }
                        </div> */}
            </div>
        </div>
        /* </div> 
    </div> */
    )
}
export default MarketCanodromes