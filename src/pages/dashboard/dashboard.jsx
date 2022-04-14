import React, { useContext, useState, useEffect } from 'react'
import cc from '../../img/cc.png'
import ccan from '../../img/ccan.png'
import { DataContext } from '../../context/DataContext'
import axios from 'axios'
import Loader from '../../components/loader/loader'
import web3 from '../../tokens/canes/canes'
import ClaimModal from '../../components/claimModal/claimModal'
import Alert from '../../components/alert/alert'
import NftCard from '../../components/nftCard/nftCard'
const Dashboard = () => {
    const { minimunToClaim, oracule, exectConnect, ownerWallet, gas, gasPrice, getBnb, getCCT, claimPercent, cctContract, poolContract, nftContract, cct, balance, getRaces, race, cans, bnb, loading, setLoading, getCans, wallet } = useContext(DataContext)

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

    useEffect(() => {
        getRaces()
        getApproved()
    }, [wallet])

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
            const approved = await cctContract.methods.allowance(ownerWallet, recipient).call()
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

        const res = await axios.get(process.env.REACT_APP_BASEURL + "cans/validate/" + _id)
        if (!res.data.response) {
            let body = { can: { onSale: { sale: true, price: price }, } }
            const _value = Number.parseFloat(price / 100).toFixed(6)
            const value = web3.utils.toWei(_value.toString(), "ether")
            nftContract.methods.onSale().send({ from: wallet, value, gas, gasPrice }).then(async (res) => {
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
            await axios.patch(process.env.REACT_APP_BASEURL + "cans/" + _id, body)
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
        setLoading(true)
        setClaiming(false)
        const amount = ammountToClaim
        const body = { wallet, amount }
        try {
            console.log(body)
            axios.patch(process.env.REACT_APP_BASEURL + "claim", body).then((res) => {
                console.log("claime")
                console.log(res.data.response)
                setTimeout(() => {
                    console.log("transfiriendo fondos")
                    const discountAmount = ((Math.floor(res.data.response.discountAmount * 1000)) / 1000).toString()
                    const claiming = web3.utils.toWei(discountAmount, "ether")

                    cctContract.methods.transferFrom(ownerWallet, wallet, claiming).send({ from: wallet, gas, gasPrice })
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
                    console.log(error.response.data.error);
                    alert(error.response.data.error)
                } else if (error.request) {
                    console.log("Error request: ", error.request)
                } else {
                    console.log('Error message:', error.message);
                }
            })

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const claimExcect = async () => {
        setLoading(true)
        const claiming = web3.utils.toWei(approved, "ether")
        cctContract.methods.transferFrom(ownerWallet, wallet, claiming).send({ from: wallet, gas, gasPrice })
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
    return (
        <div className="">
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
                                
                                {selectedCan && <>
                                    {selectedCan.rarity == 1 && <i className="rarity common px-2">Common </i>}
                                    {selectedCan.rarity == 2 && <i className="rarity rare px-2">Rare </i>}
                                    {selectedCan.rarity == 3 && <i className="rarity epic px-2">Epic </i>}
                                    {selectedCan.rarity == 4 && <i className="rarity legendary px-2">Legendary </i>}
                                </>}
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
                    <div className="col-md-2 h100vh">
                        <div className='boxMenuDark'>
                            <div className="menuSectionDshboard separator">
                                <div className="text-center h-100 d-flex align-items-center">
                                    <div className="w-100">
                                        <img className="my-2" height="50px" src="https://upload.wikimedia.org/wikipedia/commons/f/fc/Binance-coin-bnb-logo.png" alt="" />
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

                    </div>
                    <div className="col-md-10 dashBody">
                        <div className="dogFeatures">

                            <div className="row g-2 mb-2">
                                <div className='col-12 dashboardOptions'>
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
                                        <button onClick={() => setRaceModal(true)} className='mx-2 btn btn-primary'> Races History </button>
                                        <button className='btn btn-primary'> Activities </button>
                                    </div>
                                </div>

                                {cans && cans.map((i) => {
                                    return (
                                        <div key={i.id} className='col-md-3'>
                                            <NftCard
                                                setRenderModal={setRenderModal}
                                                setModalText={setModalText}
                                                setCan={setCan}
                                                item={i}
                                                btnPrice={i.onSale.price}
                                            />
                                        </div>
                                    )
                                })}

                            </div>
                        </div>
                        <div className='p-2 mt-2'>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard