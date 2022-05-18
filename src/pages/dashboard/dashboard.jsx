import React, { useContext, useState, useEffect } from 'react'
import cc from '../../img/cc.png'
import ccan from '../../img/ccan.png'
import { DataContext } from '../../context/DataContext'
import axios from 'axios'
import Loader from '../../components/loader/loader'
import web3 from '../../tokensDev/canes/canes'
import ClaimModal from '../../components/claimModal/claimModal'
import Alert from '../../components/alert/alert'
import NftCard from '../../components/nftCard/nftCard'
import ticketImg from '../../img/tikets/ticket.png'
import passTicket from '../../img/tikets/pass.png'
import errorManager from '../../services/errorManager'
import socket from '../../socket';
import lastForWallet from '../../context/services/lastForWallet'
import enviroment from '../../env'
import { nftContractProd } from "../../tokensProd/canes/canes";
import { testNftContract } from "../../tokensDev/canes/canes";
import { cctContractDev } from "../../tokensDev/cct/cct"
import { cctContractProd } from "../../tokensProd/cct/cct"
import perro from '../../img/perro.png'
import burguer from '../../img/assets/icons/burguer.png'

let nftContract
if (process.env.REACT_APP_ENVIROMENT == "prod") nftContract = nftContractProd()
if (process.env.REACT_APP_ENVIROMENT == "dev") nftContract = testNftContract()
let cctContract
if (process.env.REACT_APP_ENVIROMENT == "prod") cctContract = cctContractProd()
if (process.env.REACT_APP_ENVIROMENT == "dev") cctContract = cctContractDev()

const Dashboard = () => {
    const { cctAddress, tiket, pass, minimunToClaim, oracule, exectConnect, ownerWallet, gas, gasPrice,
        getBnb, getCCT, claimPercent, poolContract, cct, balance, getRaces, race,
        cans, bnb, loading, setLoading, getCans, wallet } = useContext(DataContext)

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

    useEffect(() => {
        getRaces()
        getApproved()
        getClaimPercent()
    }, [wallet, pass])

    useEffect(() => {
        filterPass()
        if (passOnSell.length == 0) fetch(enviroment().baseurl + "pass")
    }, [passOnSell]);

    socket.on('passData', async passData => {
        setPassOnSell(passData)
    })

    const filterPass = () => {
        const filteredPass = passOnSell.filter(p => onlyUserPass(p))
        setMyPass(filteredPass)
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

    const setCan = (can) => {
        setSelectedCan(can)
        setId(can.id)
    }

    const sell = async (_id) => {
        setLoading(true)
        setRenderModal(false)

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

    return (
        <div className="">
            {modalSellTicket && <div className='cansSelection overflow'>
                <div className='selectTittle'>
                    <div className='tittle'> Sell Pass </div>
                    <button onClick={_ => setModalSellTicket(false)}> X </button>
                </div>
                <div className='container pt-2'>
                    <div className="row">
                        <div className="col-4">
                            <h2>Sell Pass</h2>
                            <span> Pass Price </span>
                            <input onChange={(e) => setTicketPrice(e.target.value)} className='form-control mb-2' type="text" />
                            <span> Amount </span>
                            <input className='form-control mb-2' onChange={(e) => setTicketAmmount(e.target.value)} type="text" />
                            <button onClick={sellTicket}> Sell </button>
                            <button onClick={() => setModalSellTicket(false)}> Cancel </button>
                        </div>
                        <div className='col-8'>
                            {myPass.length > 0 && myPass.map((item, index) => {
                                return <div key={index} className="d-flex justify-content-between mb-1 border p-1 align-items-center">
                                    <div>
                                        {item._id} - {item.price} Credits {lastForWallet(item.wallet)}
                                    </div>
                                    <button onClick={() => removePass(item._id)} className='btn btn-danger'> Remove </button>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>}
            {raceModal && <>
                <div className='cansSelection'>
                    <div className='selectTittle'>
                        <div className='tittle'> Races History </div>
                        <button onClick={_ => setRaceModal(false)}> X </button>
                    </div>
                    <div className='container-fluid px-5 pt-2 containerSelectCans'>
                        <div className="row">
                            <table className='table table-dark'>
                                <thead>
                                    <tr>
                                        <td> Race </td>
                                        <td> Place </td>
                                        <td> CanId </td>
                                        <td> GainToken </td>
                                        <td> Balance </td>
                                    </tr>
                                </thead>
                                <tbody>

                                    {race && race.map((item, index) => {
                                        return <tr key={item._id} >

                                            <th scope="row">{index + 1}</th>
                                            <td> {item.place} </td>
                                            <td> {item.canId} </td>
                                            <td> {item.gainToken == 0 ? <div className='text-danger'>Lose</div> : <div className='text-success' >Win: +{item.gainToken}</div>} </td>
                                            <td> {item.balancePrev} | {item.balanceAfter} </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
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
                    <div className='modalIn'>
                        <div className=' w-100'>
                            <div className=''>
                                {selectedCan.onSale.sale &&
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <div className='text-warning'> Price: {Number.parseFloat(selectedCan.onSale.price)} BNB </div>
                                        <button onClick={() => _remove(selectedCan.id)} className='btn btn-danger'> Remove </button>
                                    </div>
                                }
                                <div>
                                    Selling canId: #{selectedCan && selectedCan.id}
                                </div>
                                Rarity:

                                {selectedCan && cansRarity[selectedCan.rarity - 1]}

                                <h3 className='text-warning'>{price} BNB</h3>
                                <p className='text-warning'> Sales fee: {Number.parseFloat(price / 100).toFixed(6)} BNB </p>
                                <input className='form-control' type="number" onChange={e => _setPrice(e.target.value)} />
                            </div>
                            <div className='mt-3'>
                                <div className="row gx-2">
                                    <button onClick={_ => { setRenderModal(false); setPrice(0) }} className='btn mx-1 col btn-danger'> Cancel </button>
                                    <button onClick={_ => sell(id)} className='btn mx-1 col btn-primary'> Continue </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            }
            <div className="container-fluid">
                <div className="row">
                    {/* <div className="col-md-2">
                        <div className='boxMenuDark'>
                            <div className="menuSectionDshboard separator">
                                <div className="text-center h-100 d-flex align-items-center">
                                    <div className="w-100">
                                        <img className="my-2" height="50px" src='https://upload.wikimedia.org/wikipedia/commons/f/fc/Binance-coin-bnb-logo.png' alt="" />
                                        <div>
                                            <h5>{bnb ? bnb : 0} BNB
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12 col-3 menuSectionDshboard separator">
                                <div className="text-center h-100 justify-content-center d-flex align-items-center">
                                    <div className="">
                                        <img className="my-2" height="50px" src={cc} alt="" />
                                        <div>
                                            <h5>{balance ? <> {Math.round((balance * 100)) / 100}</> : <>0</>} Credits</h5>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12 col-3 menuSectionDshboard separator">
                                <div className="text-center h-100 d-flex align-items-center">
                                    <div className="w-100">
                                        <img className="my-2" height="50px" src={ccan} alt="" />
                                        <div>
                                            <h5>{cct ? cct : 0} CCT</h5>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12 col-3 menuSectionDshboard ">
                                <div className="d-flex justify-content-center align-items-center  h-100">
                                    <div className="text-center">
                                        <div>
                                            {approved && <>
                                                {approved > 0 && <> {approved} CCT Approved</>}
                                            </>}
                                        </div>
                                        <div>Current fee {claimPercent && claimPercent}%</div>
                                        {approved == 0 ? <>
                                            <button onClick={() => setClaiming(true)} className="form-control btn btn-primary mt-2"> Approve </button>
                                        </> : <>
                                            <button onClick={() => claimExcect()} className="form-control btn btn-danger mt-2"> Claim </button>
                                        </>}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div> */}
                    <div className="col-12">
                        <div className="dogFeatures">
                            <div className="row g-2 mb-2">
                                <h1 className='welcome'>
                                    WELCOME TO CRYPTOCANS.IO
                                </h1>
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
                                                                <div className='numberItem'> 25 </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-6'>
                                                        <div className='itemSection'>
                                                            <div className='inItem'>
                                                                <img height={"40px"} src={ticketImg} alt="" />
                                                                <div className='numberItem'> 45 </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-12">
                                            <div className='item-bar'>
                                                <button className='btn-bar'> Cans </button>
                                                <button className='btn-bar'> Canodomes </button>
                                            </div>
                                            <div className='container-fluid px-0 pt-3'>
                                                <div className="row gx-2">
                                                    {cans && cans.map((i) => {
                                                        return (
                                                            <div key={i.id} className='col-md-4 col-6'>
                                                                {/* <NftCard
                                                                setRenderModal={setRenderModal}
                                                                setModalText={setModalText}
                                                                setCan={setCan}
                                                                item={i}
                                                                btnPrice={i.onSale.price}
                                                            /> */}
                                                                <div className='bgNft'>
                                                                    <div className='imgSection'>
                                                                        <img className='imgNft' src={perro} alt="" />
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
                                        <button onClick={() => setRaceModal(true)} className='mx-2 btn btn-primary'> Races History </button>
                                        <button className='btn btn-primary mx-2'> Activities </button>
                                        <button onClick={() => { setModalSellTicket(true); fetch(enviroment().baseurl + "pass") }} className='btn btn-warning mx-2'> <img src={passTicket} height="20px" alt="" /> <b>{pass}</b> </button>
                                        <button className='btn btn-primary mx-2'>  <img src={ticketImg} height="20px" alt="" /> {tiket} </button>
                                    </div>
                                </div> */}



                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard