import React, { useContext, useState, useEffect } from 'react'
import { DataContext } from '../../context/DataContext'
import axios from 'axios'
import Loader from '../../components/loader/loader'
import web3 from '../../tokensDev/canes/canes'
import ClaimModal from '../../components/claimModal/claimModal'
import Alert from '../../components/alert/alert'
import ticketImg from '../../img/tikets/ticket.png'
import passTicket from '../../img/tikets/pass.png'
import errorManager from '../../services/errorManager'
import socket from '../../socket';
import enviroment from '../../env'
import { nftContractProd } from "../../tokensProd/canes/canes";
import { testNftContract } from "../../tokensDev/canes/canes";
import { cctContractDev } from "../../tokensDev/cct/cct"
import { cctContractProd } from "../../tokensProd/cct/cct"
import burguer from '../../img/assets/icons/burguer.png'
import playIcon from '../../img/assets/icons/play.png'
import logoCCT from '../../img/assets/icons/logoCCT.png'
import logoCredit from '../../img/assets/icons/credit.png'
import { Link } from 'react-router-dom'
/* import NftCard from '../../components/nftCard/nftCard' */

import commonNft from '../../img/nfts/common.png'
import rareNft from '../../img/nfts/rare.png'
import epicNft from '../../img/nfts/epic.png'
import legendaryNft from '../../img/nfts/legendary.png'

import commonCanodrome from '../../img/canodromes/common.png'
import rareCanodrome from '../../img/canodromes/rare.png'
import epicCanodrome from '../../img/canodromes/epic.png'
import legendaryCanodrome from '../../img/canodromes/legendary.png'

import canodrome from '../../img/1.png'
import energyLogo from '../../img/energy.png'


let nftContract
if (process.env.REACT_APP_ENVIROMENT == "prod") nftContract = nftContractProd()
if (process.env.REACT_APP_ENVIROMENT == "dev") nftContract = testNftContract()
let cctContract
if (process.env.REACT_APP_ENVIROMENT == "prod") cctContract = cctContractProd()
if (process.env.REACT_APP_ENVIROMENT == "dev") cctContract = cctContractDev()

const Dashboard = () => {
    const { dayReset, cctAddress, tiket, pass, minimunToClaim, oracule, exectConnect, ownerWallet, gas, gasPrice,
        getBnb, getCCT, claimPercent, poolContract, cct, balance, getRaces, race,
        cans, bnb, loading, setLoading, getCans, wallet } = useContext(DataContext)
    const _context = useContext(DataContext)

    const [price, setPrice] = useState(0)
    const [id, setId] = useState(false)
    const [remove, setRemove] = useState(false)
    const [claiming, setClaiming] = useState(false)
    const [ammountToClaim, setAmmountToClaim] = useState(false)
    const [selectedCan, setSelectedCan] = useState(false)
    const [renderModal, setRenderModal] = useState(false)//viene true
    const [modalText, setModalText] = useState(false)////viene texto confirm
    const [raceModal, setRaceModal] = useState(false)
    const [approved, setApproved] = useState(false)

    const [modalSellTicket, setModalSellTicket] = useState(false)
    const [ticketAmmount, setTicketAmmount] = useState(0)
    const [ticketPrice, setTicketPrice] = useState(0)

    const [passOnSell, setPassOnSell] = useState([])
    const [myPass, setMyPass] = useState([])
    const [reguard, setReguard] = useState(0)
    const reguardWallet = "0x9cc9cddf2ffaa5df08cf8ea2b7aaebaf40161b98"

    const [canModal, setCanModal] = useState(false)

    const [menu, setMenu] = useState(false)

    const baseUrl = enviroment().baseurl
    const { nftContract } = useContext(DataContext)
    const [selectCans, setSelectCans] = useState(false)
    const [selectedCanodrome, setSelectedCanodrome] = useState(false)
    const [filteredCans, setFilteredCans] = useState([])
    const [sellingCanodrome, setSellingCanodrome] = useState(false)
    const [canodromeOnSell, setCanodromeOnSell] = useState(false)
    const [canodromePrice, setCanodromePrice] = useState(false)

    useEffect(() => {
        getRaces()
        getApproved()
        getClaimPercent()
        getReguard()
    }, [wallet, pass])

    useEffect(() => {
        filterPass()
        if (passOnSell.length == 0) fetch(enviroment().baseurl + "pass")
    }, [passOnSell]);

    socket.on('passData', async passData => {
        setPassOnSell(passData)
    })

    const getReguard = async () => {
        const _balance = await cctContract.methods.balanceOf(reguardWallet).call()
        setReguard(web3.utils.fromWei(_balance, "ether"))
    }

    const filterPass = () => {
        const filteredPass = passOnSell.filter(p => onlyUserPass(p))
        setMyPass(filteredPass)
        console.log(filteredPass)
    }

    const onlyUserPass = (pass) => {
        if (pass.wallet == wallet) return pass
    }

    const getClaimPercent = () => {
        if (wallet) {
            axios.post(enviroment().baseurl + "claim/" + wallet)
        }
    }

    const _setPrice = (ammount) => {
        const _ammount = Number.parseFloat(ammount).toFixed(6);
        setPrice(_ammount)
    }

    const _setAmmountToClaim = (ammount) => {
        const _ammount = Number.parseFloat(ammount).toFixed(6);
        setAmmountToClaim(_ammount)
    }

    const getApproved = async () => {
        if (wallet) {
            const recipient = wallet
            let approved = await cctContract.methods.allowance(ownerWallet, recipient).call()
            const _approved = web3.utils.fromWei(approved, "ether")
            setApproved(_approved)
        }
    }

    const sell = async (_id) => {
        setLoading(true)
        setRenderModal(false)
        setCanModal(false)

        const res = await axios.get(enviroment().baseurl + "cans/validate/" + _id)
        if (!res.data.response) {
            let body = { can: { onSale: { sale: true, price: price }, } }
            const _value = Number.parseFloat(price / 100).toFixed(6)
            const value = web3.utils.toWei(_value.toString(), "ether")
            nftContract.methods.onSale().send({ from: wallet, value }).then(async (res) => {
                await sendCanOnSellToDB(_id, body)
                setLoading(false)
            }).catch(error => {
                console.log(error)
                setLoading(false)
            })
        } else {
            alert("No puede vender un can agregado a un canodromo")
            setLoading(false)
        }
        console.log(res.data.response)
    }

    const _remove = async (_id) => {
        setLoading(true)
        setRemove(false)
        let body = { can: { onSale: { sale: false, price: 0 }, } }
        await sendCanOnSellToDB(_id, body)
        setLoading(false)
        setRenderModal(false)
        setCanModal(false)
    }

    const sendCanOnSellToDB = async (_id, body) => {

        try {
            await axios.patch(enviroment().baseurl + "cans/" + _id, body)
            setRemove(false)
            setPrice(0)
            await getCans(wallet)
        } catch (error) {
            if (error.response) {
                console.log(error.response)
            } else if (error.request) {
                console.log("error con request")
            } else {
                console.log(error.message)
            }
            console.log(error)
            setRemove(false)
            setPrice(0)
        }

    }

    const claim = async () => {
        if (balance < ammountToClaim) return alert("You don't have enough credit")

        setLoading(true)
        setClaiming(false)
        const amount = ammountToClaim
        const body = { wallet, amount }
        try {
            console.log(body)
            axios.patch(enviroment().baseurl + "claim", body).then((res) => {
                console.log("claime")
                console.log(res.data.response)
                setTimeout(() => {
                    console.log("transfiriendo fondos")
                    const discountAmount = res.data.response.value.toString()
                    console.log(discountAmount)
                    const claiming = web3.utils.toWei(discountAmount, "ether")

                    cctContract.methods.transferFrom(ownerWallet, wallet, claiming).send({ from: wallet })
                        .then(async res => {
                            console.log(res)
                            await getApproved()
                            await exectConnect()
                            setLoading(false)
                        }).catch(async error => {
                            console.log(error)
                            await getApproved()
                            await exectConnect()
                            setLoading(false)
                        })
                }, 20000)

            }).catch(error => {
                setLoading(false)
                if (error.response) {
                    console.log(error.response);
                    alert(error.response)
                } else if (error.request) {
                    console.log("Error request: ", error.request)
                } else {
                    console.log('Error message:', error.message);
                }
            }).finally(() => {
                setLoading(false)
            })

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const claimExcect = async () => {
        setLoading(true)
        const claiming = web3.utils.toWei(approved, "ether")
        cctContract.methods.transferFrom(ownerWallet, wallet, claiming).send({ from: wallet, gas })
            .then(async res => {
                console.log(res)
                await getBnb(wallet)
                await getCCT(wallet)
                getApproved()
                setLoading(false)
            }).catch(error => {
                console.log(error)
                getApproved()
                setLoading(false)
            })
    }

    const cansRarity = [
        <i className="rarity common px-2">Common </i>,
        <i className="rarity rare px-2">Rare </i>,
        <i className="rarity epic px-2">Epic </i>,
        <i className="rarity legendary px-2">Legendary </i>
    ]

    const sellTicket = async () => {
        if (ticketAmmount <= 0) return alert("Incorrect Amount")
        if (ticketPrice <= 0) return alert("Incorrect Price")
        setLoading(true)
        setModalSellTicket(false)
        const body = {
            wallet,
            price: ticketPrice,
            amount: ticketAmmount
        }
        try {
            console.log(body)
            const res = await axios.post(enviroment().baseurl + "pass/sell", body)
            console.log(res)
            await exectConnect()
            setLoading(false)
            alert("Your pass is on sell")
        } catch (error) {
            setLoading(false)
            errorManager(error)
            alert(error.response.data.error)
        }
    }

    const removePass = async (passId) => {
        setLoading(true)
        try {
            fetch(enviroment().baseurl + "pass/" + wallet + "/" + passId, {
                method: 'delete',
            })
                .then(res => res.json()) // or res.json()
                .then(res => {
                    console.log(res)
                    setLoading(false)
                    alert("Removed Pass")
                }
                )
        } catch (error) {
            errorManager(error)
            setLoading(false)
            alert("Error")
        }
    }

    const rarity = (r) => {
        const rarityObj = {
            1: <div className='rarityText'>Common</div>,
            2: <div className='rarityText'>Rare</div>,
            3: <div className='rarityText'>Epic</div>,
            4: <div className='rarityText'>Legendary</div>
        }
        return rarityObj[r]
    }

    const openCanModal = (can) => {
        setSelectedCan(can)
        setId(can.id)

        setCanModal(true)


    }
    /********************************************** */
    const addCan = async (canodromeId) => {

        let _filteredCans = []
        const canodromesAll = _context.canodromes.map((canodrome) => canodrome.cans);
        const canodromesAllFlat = canodromesAll.flat();
        const arrayCanInCanodromes = canodromesAllFlat.map(can => can.can.id);

        _context.cans.map(item => {
            let suma = 0
            arrayCanInCanodromes.map(_item => { if (item.id == _item) suma++ })
            if (suma == 0 && item.onSale.sale == false) _filteredCans.push(item)
        })

        setFilteredCans(_filteredCans)
        setSelectedCanodrome(canodromeId)
        setSelectCans(true)
        _context.setLoading(false)
    }

    const setCan = async (can) => {
        _context.setLoading(true)
        const body = { can }
        try {
            console.log("poner un can en el canodromo")
            const res = await axios.patch(enviroment().baseurl + "canodrome/" + selectedCanodrome, body)
            //console.log(res.data.response)
            await _context.getCanodromes(_context.wallet)
            setSelectCans(false)
            // getTakedCans()
            _context.setLoading(false)
        } catch (error) {
            _context.setLoading(false)
            if (error.response) {
                console.log("Error Response")
                console.log(error.response.data)
                alert(error.response.data.error)
            } else if (error.request) {
                console.log("Error Request")
                console.log(error.request);
            } else {
                console.log("Error Message")
                console.log('Error', error.message);
            }
        }
    }

    const deleteCan = async (canodromeId, canId) => {
        _context.setLoading(true)
        await axios.delete(baseUrl + "canodrome/" + canodromeId + "/" + canId)
        await _context.getCanodromes(_context.wallet)
        // getTakedCans()
        _context.setLoading(false)
    }

    const canodromeItemsAndButtons = [
        [0, 1, 2],
        [0, 1, 2, 3, 4, 5],
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    ]

    const sellCanodrome = (canodrome) => {
        setCanodromeOnSell(canodrome)
        setSellingCanodrome(true)
        console.log(canodrome)
    }

    const sendSell = async () => {
        _context.setLoading(true)
        setSellingCanodrome(false)
        const _value = Number.parseFloat(canodromePrice / 100).toFixed(6)
        const value = web3.utils.toWei(_value.toString(), "ether")
        nftContract.methods.onSale().send({ from: _context.wallet, value, gas: _context.gas, gasPrice: _context.gasPrice }).then(async (res) => {
            await sendCanodromeOnSellToDB()

            _context.setLoading(false)
        }).catch(error => {
            console.log(error)
            alert(error.message)
            _context.setLoading(false)
        })


    }

    const sendCanodromeOnSellToDB = async () => {
        const body = { "canodrome": { "onSale": { "sale": true, "price": canodromePrice } } }
        try {
            console.log("sellin canodrome")
            const res = await axios.patch(enviroment().baseurl + "canodrome/sell/" + canodromeOnSell._id, body)
            console.log(res.data.response)
            setSellingCanodrome(false)
            _context.getCanodromes(_context.wallet)
        } catch (error) {
            errorManager(error)
        }
    }

    const removeCanodrome = async (_id) => {
        try {
            const res = await axios.patch(enviroment().baseurl + "canodrome/remove/" + _id)
            console.log(res.data.response)
            _context.getCanodromes(_context.wallet)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="">
            {sellingCanodrome && <div className='modalX'>
                <div className='modalInCanodrome'>
                    <div className="p-2">
                        <div className="d-flex justify-content-between">
                            <div>
                                <p>Selling Canodrome</p>
                                # {canodromeOnSell && canodromeOnSell.id}<br />
                                {canodromeOnSell && rarity(canodromeOnSell.type)}
                            </div>
                            <div>
                                {canodromeOnSell.type == 1 && <img height="100px" src={commonCanodrome} />}
                                {canodromeOnSell.type == 2 && <img height="100px" src={rareCanodrome} />}
                                {canodromeOnSell.type == 3 && <img height="100px" src={epicCanodrome} />}
                                {canodromeOnSell.type == 4 && <img height="100px" src={legendaryCanodrome} />}
                            </div>
                        </div>
                        <div className='text-warning'>
                            {canodromePrice && <>{canodromePrice}BNB</>}
                        </div>
                        <input onChange={(e) => setCanodromePrice(e.target.value)} className='mt-3 inputClaim' type="text" />
                        <button onClick={sendSell} className='btn btn-primary form-control mt-3'>Sell</button>
                        <button onClick={() => setSellingCanodrome(false)} className='btn btn-danger mt-3'> Cancel </button>
                    </div>
                </div>
            </div>}

            {selectCans &&
                <div className='modalX'>
                    <div className='selectCansCanodrome'>
                        <div className='selectTittle'>
                            <div className='tittle'> Select your can </div>
                            <button className='btn btn-danger' onClick={_ => setSelectCans(false)}> X </button>
                        </div>

                        <div className='container-fluid px-5 containerSelectCans'>
                            <div className="row gx-4 px-5">
                                {filteredCans.length == 0 && <div className='p-5'>
                                    <h1>
                                        No cans in your dashboard
                                    </h1>
                                    <Link to='/shop' className='btn btn-primary'> Buy Cans </Link>
                                </div>}
                                {filteredCans && filteredCans.map((canItem) => {
                                    return !canItem.onSale.sale &&
                                        <div key={canItem.id} className="col-lg-3 col-md-4 col-sm-6 col-12 p-2">

                                            <div onClick={() => setCan(canItem)} className='bgNft'>
                                                <div className='imgSection'>
                                                    {canItem.rarity == 1 && <img className='imgNft' src={commonNft} alt="" />}
                                                    {canItem.rarity == 2 && <img className='imgNft' src={rareNft} alt="" />}
                                                    {canItem.rarity == 3 && <img className='imgNft' src={epicNft} alt="" />}
                                                    {canItem.rarity == 4 && <img className='imgNft' src={legendaryNft} alt="" />}

                                                    <div className='stats'>
                                                        <div className='totalStats'>Total stats</div>
                                                        <div className='statsNumber'>{canItem.resistencia + canItem.aceleracion + canItem.aerodinamica}</div>
                                                    </div>
                                                    <div className='rarity'>
                                                        {rarity(canItem.rarity)}
                                                    </div>
                                                    <div className='nftId'>
                                                        # {canItem.id}
                                                    </div>
                                                </div>
                                                <div className='W-options'>
                                                    <div className='options'>
                                                        <div>
                                                            Spot A340
                                                        </div>
                                                        <div>
                                                            <img height={"16px"} src={burguer} alt="" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <NftCard btnPrice={false} setRenderModal={setRenderModal} setModalText={setModalText} setCan={setCan} item={canItem} /> */}
                                        </div>
                                })}
                            </div>
                        </div>
                    </div>
                </div>}

            {canModal && <>
                <div className='modalX'>
                    <div className='canModalIn'>
                        <div className="container-fluid">
                            <div className="row gx-2">
                                <div className="col-6">
                                    <div className='canPhoto'>

                                        <div className='stats'>
                                            <div className='totalStats'>Total stats</div>
                                            <div className='statsNumber'>{selectedCan.resistencia + selectedCan.aceleracion + selectedCan.aerodinamica}</div>
                                        </div>
                                        <div className='rarity'>
                                            {rarity(selectedCan.rarity)}
                                        </div>
                                        <div className='nftId'>
                                            # {selectedCan.id}
                                        </div>
                                        {selectedCan.rarity == 1 && <img className='imgNft' src={commonNft} alt="" />}
                                        {selectedCan.rarity == 2 && <img className='imgNft' src={rareNft} alt="" />}
                                        {selectedCan.rarity == 3 && <img className='imgNft' src={epicNft} alt="" />}
                                        {selectedCan.rarity == 4 && <img className='imgNft' src={legendaryNft} alt="" />}

                                    </div>
                                    <div className='options'>
                                        {selectedCan.name}
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
                                                    {selectedCan && selectedCan.energy}/4
                                                </div>
                                            </div>
                                            <div>
                                                <progress value={selectedCan.energy - 1} min="0" max="4" className='progressEnergy'> </progress>
                                            </div>
                                        </div>
                                        <div className='energy mt-3'>
                                            <div>Aerodinamic:</div>
                                            <div>{selectedCan && selectedCan.aerodinamica}</div>
                                        </div>
                                        <div className='energy mt-3'>
                                            <div>Aceleration:</div>
                                            <div>{selectedCan && selectedCan.aceleracion}</div>
                                        </div>
                                        <div className='energy mt-3'>
                                            <div>Resistence:</div>
                                            <div>{selectedCan && selectedCan.resistencia}</div>
                                        </div>

                                        <div>
                                            {selectedCan.onSale.sale &&
                                                <div className='d-flex align-items-center justify-content-between'>
                                                    <div className='text-warning'> Price: {Number.parseFloat(selectedCan.onSale.price)} BNB </div>
                                                    <button onClick={() => _remove(selectedCan.id)} className='btn btn-danger'> Remove </button>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 p-1">
                                    <div className='selectedCanHeading'>
                                        <button className='btn btn-danger btnModal' onClick={() => setCanModal(false)}> Cancel </button>
                                        {!selectedCan.onSale.sale && <button className='btn btn-warning btnModal' onClick={() => setRenderModal(true)}> Sell </button>}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>}
            {modalSellTicket && <div className='modalX'>
                <div className='modalInPass'>
                    <div className='container-fluid'>
                        <div className="row">
                            <div className="col-md-4 col-12">
                                <div className=' mb-3 d-flex justify-content-between align-items-center'>
                                    <div className='textClaim'> Sell Pass </div>
                                    <button className='btn btn-danger btn-sm' onClick={_ => setModalSellTicket(false)}> X </button>
                                </div>
                                <span className='textClaim'> Pass Price </span>
                                <input onChange={(e) => setTicketPrice(e.target.value)} className='inputClaim w-100 mb-3' type="text" />
                                <span className='textClaim'> Amount </span>
                                <input className='inputClaim' onChange={(e) => setTicketAmmount(e.target.value)} type="text" />
                                <button className='w-100 btn btn-primary mt-4' onClick={sellTicket}> Sell </button>
                            </div>
                            <div className="col-md-8 col-12 max80">
                                {myPass.length > 0 && myPass.map((item, index) => {
                                    return <div key={index} className="d-flex justify-content-between mb-1 p-1 align-items-center ticketsOnSell">
                                        <div>
                                            Selling <i className="passText"> {item.amount} Pass </i> in <i className="ticketText"> {item.price} Credits </i>
                                        </div>
                                        <button onClick={() => removePass(item._id)} className='btn btn-danger'> Remove </button>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
            {raceModal && <>
                <div className='modalX'>
                    <div className="modalRaceIn">
                        <div className='headerHistory px-5 mb-3'>
                            <div className='tittle'> Races History </div>
                            <button className='btn btn-danger' onClick={_ => setRaceModal(false)}> X </button>
                        </div>
                        <div className='container-fluid px-5 pt-2 containerRaceHistory'>
                            <div className="row">
                                <table className='table text-light'>
                                    <thead>
                                        <tr>
                                            <td> Race </td>
                                            <td> Place </td>
                                            <td> CanId </td>
                                            <td> Tokens Earned </td>
                                            <td> Balance </td>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {race && race.map((item, index) => {
                                            return <tr key={item._id} >

                                                <th scope="row">{index + 1}</th>
                                                <td> {item.place} </td>
                                                <td> # {item.canId} </td>
                                                <td> {item.gainToken == 0 ? <div className='text-danger'>Lose</div> : <div className='text-success' >Win: +{item.gainToken}</div>} </td>
                                                <td> {item.balancePrev} | {item.balanceAfter} </td>
                                            </tr>
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </>}
            <Alert text="Alert Text" />
            {loading && <Loader />}
            {claiming && <ClaimModal minimunToClaim={minimunToClaim} claimPercent={claimPercent} oracule={oracule} setClaiming={setClaiming} claim={claim} ammountToClaim={ammountToClaim} _setAmmountToClaim={_setAmmountToClaim} />}
            {remove &&
                <div className='modalX'>
                    <div className='modalIn'>
                        <h5>¿Esta seguro que desea remover este can del mercado?</h5>
                        <div className='d-flex justify-content-center'>
                            <button onClick={_ => setRemove(false)} className='btn btn-danger'>Cancelar</button>
                            <button onClick={_ => _remove(id)} className='btn btn-primary mx-2'>Remove</button>
                        </div>
                    </div>
                </div>}
            {renderModal &&
                <div className='modalX'>
                    <div className='modalInClaim'>
                        <div className='wSellinCan'>
                            <div>
                                Selling #{selectedCan && selectedCan.id}
                            </div>
                            <div className=''>
                                {selectedCan.onSale.sale &&
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <div className='text-warning'> Price: {Number.parseFloat(selectedCan.onSale.price)} BNB </div>
                                        <button onClick={() => _remove(selectedCan.id)} className='btn btn-danger'> Remove </button>
                                    </div>
                                }
                                <h3 className='text-warning'>{price} BNB</h3>
                                <p className='text-warning'> Sales fee: {Number.parseFloat(price / 100).toFixed(6)} BNB </p>
                                <input className='form-control' type="number" onChange={e => _setPrice(e.target.value)} />
                            </div>
                            <div className='modalButtons w-100'>
                                <div className="w-50 p-1">
                                    <button onClick={_ => { setRenderModal(false); setPrice(0) }} className='btn mx-1 col btn-danger w-100'> Cancel </button>
                                </div>
                                <div className="w-50 p-1">
                                    <button onClick={_ => sell(id)} className='btn mx-1 col btn-primary w-100'> Continue </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            }
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="dogFeatures">
                            <div className="row g-2 mb-2">
                                <div className="col-md-8 col-12">
                                    <h6>CCT {cctAddress && cctAddress}</h6>
                                    <h1 className='welcome'>
                                        WELCOME TO CRYPTOCANS.IO
                                    </h1>
                                </div>
                                <div className="col-md-4 col-12">
                                    <div className='wplay'>
                                        <div className="bnbBalance">
                                            <img className="m-2" height="20px" src='https://upload.wikimedia.org/wikipedia/commons/f/fc/Binance-coin-bnb-logo.png' alt="" />
                                            <div className=''>
                                                {bnb ? bnb : 0} BNB
                                            </div>
                                        </div>
                                        <Link to="/race" className='playBTN mt-4'>
                                            <div>
                                                Play Games
                                            </div>
                                            <div>
                                                <img className='imgPlay' src={playIcon} alt="" />
                                            </div>
                                        </Link >
                                    </div>
                                </div>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-md-6 col-12">
                                            <div className='item-bar'>
                                                <button className='btn-bar'> Items </button>
                                            </div>
                                            <div className='containet-fluid pt-4'>
                                                <div className='row'>
                                                    <div className='col-6'>
                                                        <div className='itemSection'>
                                                            <div className='inItem'>
                                                                <img height={"40px"} src={passTicket} alt="" />
                                                                <div className='numberItem'> {myPass & myPass} </div>
                                                                <button onClick={() => { setModalSellTicket(true); fetch(enviroment().baseurl + "pass") }} className='btn btn-warning mx-2'> <b>Sell</b> </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-6'>
                                                        <div className='itemSection'>
                                                            <div className='inItem'>
                                                                <img height={"40px"} src={ticketImg} alt="" />
                                                                <div className='numberItem'> {tiket & tiket} </div>

                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='col-6'>
                                                        <div className='itemSection mt-3'>
                                                            <div className='inItem'>
                                                                <img height={"50px"} src={logoCCT} alt="" />
                                                                <div className='numberItem2'> {cct ? cct : 0}<br />CCT </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-6'>
                                                        <div className='itemSection mt-3'>
                                                            <div className='inItem'>
                                                                <img height={"50px"} src={logoCredit} alt="" />
                                                                <div className='numberItem2'> {balance ? Math.floor(balance) : 0} <br /> credits </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='mt-3'>
                                                        <div className='regurd'>
                                                            Reguard Pool: {reguard} CCT
                                                        </div>
                                                        <div className='reset'>
                                                            <div className="mx-2">
                                                                Next reset: {dayReset && dayReset} UTC
                                                            </div>
                                                        </div>
                                                        <div className='cliamSection'>
                                                            <div className='percent'>
                                                                <div>
                                                                    Current fee
                                                                </div>
                                                                <div className='fee'>
                                                                    {claimPercent && claimPercent}%
                                                                </div>
                                                            </div>
                                                            <div>
                                                                {approved && <>
                                                                    {approved > 0 && <> {approved} CCT Approved</>}
                                                                </>}
                                                            </div>
                                                            <div>
                                                                {approved == 0 ? <>
                                                                    <button onClick={() => setClaiming(true)} className="btn btn-danger"> Claim </button>
                                                                </> : <>
                                                                    <button onClick={() => claimExcect()} className="claimBTN"> Claim </button>
                                                                </>}
                                                            </div>
                                                        </div>
                                                        <div className='d-flex mt-4'>
                                                            <div className='w-50 px-2'>
                                                                <button onClick={() => setRaceModal(true)} className='playBTN w-100'> Races History </button>
                                                            </div>
                                                            <div className='w-50 px-2'>
                                                                <button onClick={() => setRaceModal(true)} className='playBTN w-100'> Blockchain Activity </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-12">
                                            <div className='item-bar'>
                                                <button onClick={() => setMenu(true)} className='btn-bar'> Cans </button>
                                                <button onClick={() => setMenu(false)} className='btn-bar'> Canodomes </button>
                                            </div>
                                            <div className='container-fluid px-0 pt-0'>
                                                {menu ?
                                                    <div className="row gx-2">
                                                        <div className="col-12">
                                                            {cans.length == 0 && <>
                                                                You do not have dogs in your inventory please buy it in the store
                                                            </>}
                                                        </div>
                                                        {cans && cans.map((i) => {
                                                            return (
                                                                <div key={i.id} className='col-md-4 col-6'>
                                                                    {/* <NftCard setRenderModal={setRenderModal}setModalText={setModalText}setCan={setCan}item={i}btnPrice={i.onSale.price}/> */}
                                                                    <div onClick={() => openCanModal(i)} className='bgNft'>
                                                                        <div className='imgSection'>
                                                                            {i.onSale.sale && <div className='onSale'>On sale</div>}
                                                                            {i.rarity == 1 && <img className='imgNft' src={commonNft} alt="" />}
                                                                            {i.rarity == 2 && <img className='imgNft' src={rareNft} alt="" />}
                                                                            {i.rarity == 3 && <img className='imgNft' src={epicNft} alt="" />}
                                                                            {i.rarity == 4 && <img className='imgNft' src={legendaryNft} alt="" />}

                                                                            <div className='stats'>
                                                                                <div className='totalStats'>Total stats</div>
                                                                                <div className='statsNumber'>{i.resistencia + i.aceleracion + i.aerodinamica}</div>
                                                                            </div>
                                                                            <div className='rarity'>
                                                                                {rarity(i.rarity)}
                                                                            </div>
                                                                            <div className='nftId'>
                                                                                # {i.id}
                                                                            </div>
                                                                        </div>
                                                                        <div className='W-options'>
                                                                            <div className='options'>
                                                                                <div>
                                                                                    Spot A340
                                                                                </div>
                                                                                <div>
                                                                                    <img height={"16px"} src={burguer} alt="" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    :
                                                    <div className='row gx-2'>

                                                        {_context.canodromes && <div className="col-12">
                                                            {_context.canodromes.length == 0 && <div className=''>
                                                                <h1> Todavia no posees un canodromo</h1>
                                                                <Link className='btn btn-primary' to='/shop'> Go to Shop </Link>
                                                            </div>}
                                                        </div>}

                                                        <div className="col-12">
                                                            {_context.canodromes && _context.canodromes.map((canodromeItem) => {
                                                                return (
                                                                    <div key={canodromeItem._id} className='row canodromeCard mt-4'>
                                                                        <div className='col-md-5 col-12 bgBlackTrans'>
                                                                            <div className='imgCanodromeBg'>
                                                                                {canodromeItem.type == 1 && <img className="img-fluid" src={commonCanodrome} />}
                                                                                {canodromeItem.type == 2 && <img className="img-fluid" src={rareCanodrome} />}
                                                                                {canodromeItem.type == 3 && <img className="img-fluid" src={epicCanodrome} />}
                                                                                {canodromeItem.type == 4 && <img className="img-fluid" src={legendaryCanodrome} />}
                                                                                <div className='canodromeId'>
                                                                                    #{canodromeItem.id}
                                                                                </div>
                                                                                <div className='rarity'>
                                                                                    {rarity(canodromeItem.type)}
                                                                                </div>
                                                                                {canodromeItem.onSale.sale && <>
                                                                                    <div className='justify-content-between align-items-center d-flex p-2 w-100 text-center bg-warning text-dark '>
                                                                                        <div className='text-dark'>
                                                                                            On sale
                                                                                        </div>
                                                                                        <button onClick={() => removeCanodrome(canodromeItem._id)} className='btn btn-danger'> Remove </button>
                                                                                    </div>
                                                                                </>}
                                                                                <div className='d-flex justify-content-center align-items-center energyCanodrome' >
                                                                                    <img height={"20px"} src={energyLogo} className="mx-2" alt="" />
                                                                                    <div className='energyCanodromeText'> {canodromeItem.energy} / {_context.converType(canodromeItem.type)} </div>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <button onClick={() => sellCanodrome(canodromeItem)} className='btn btn-danger form-control mt-2'> Sell </button>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-7 p-1">
                                                                            <div className="container-fluid">
                                                                                <div className='mb-2'>
                                                                                    Add can in your canodrome
                                                                                </div>
                                                                                <div className='row'>
                                                                                    {canodromeItem.onSale.sale == false && <>
                                                                                        {canodromeItemsAndButtons[canodromeItem.type - 1].map((index) => {
                                                                                            return <div key={index} className="col-4">
                                                                                                {canodromeItem.cans[index] ?
                                                                                                    <div className='cardCanodrome mb-3'>
                                                                                                        <div className='d-flex justify-content-between'>
                                                                                                            <div className="idSmall">
                                                                                                                # {canodromeItem.cans[index].can.id}
                                                                                                            </div>
                                                                                                            <div className="energySmall">
                                                                                                                {canodromeItem.cans[index].can.energy} / 4
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className='text-center'>
                                                                                                            {canodromeItem.cans[index].can.rarity == 1 && <img className='imgNft' src={commonNft} alt="" />}
                                                                                                            {canodromeItem.cans[index].can.rarity == 2 && <img className='imgNft' src={rareNft} alt="" />}
                                                                                                            {canodromeItem.cans[index].can.rarity == 3 && <img className='imgNft' src={epicNft} alt="" />}
                                                                                                            {canodromeItem.cans[index].can.rarity == 4 && <img className='imgNft' src={legendaryNft} alt="" />}
                                                                                                            {/*  <img height={"60px"} src={perro} alt="" /> */}
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <button onClick={_ => deleteCan(canodromeItem._id, canodromeItem.cans[0].can.id)} className='btn btn-sm btn-danger form-control'>
                                                                                                                Remove Can
                                                                                                            </button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    :
                                                                                                    <button className='btnAddCan mb-3' onClick={_ => addCan(canodromeItem._id)}> + </button>
                                                                                                }
                                                                                            </div>
                                                                                        })}</>}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className='col-12 dashboardOptions'>
                                    <div>
                                        {cans && <>
                                            {cans.length > 0 ? <>
                                                You Have {cans.length} cans
                                            </> : <>
                                                No cans in your dashboard
                                            </>}
                                        </>}
                                    </div>
                                    <div>
                                        CCT Contract: {cctAddress && cctAddress}
                                    </div>
                                    <div>
                                        
                                        <button className='btn btn-primary mx-2'> Activities </button>
                                        
                                        <button className='btn btn-primary mx-2'>  <img src={ticketImg} height="20px" alt="" /> {tiket} </button>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Dashboard