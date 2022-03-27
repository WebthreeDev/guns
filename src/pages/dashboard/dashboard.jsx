import React, { useContext, useState, useEffect } from 'react'
import cc from '../../img/cc.png'
import ccan from '../../img/ccan.png'
import { DataContext } from '../../context/DataContext'
import axios from 'axios'
import perro from '../../img/perro.png'
import aero from '../../img/aero.png'
import Loader from '../../components/loader/loader'
import web3, { Contract } from '../../tokens/canes/canes'
import ClaimModal from '../../components/claimModal/claimModal'

const Dashboard = () => {
    const { cct,balance,getRaces, race, cans, bnb, loading, setLoading, exectConnect, wallet } = useContext(DataContext)

    const [price, setPrice] = useState(0)
    const [id, setId] = useState(false)
    const [remove, setRemove] = useState(false)
    const [selling, setSelling] = useState(false)
    const [claiming, setClaiming] = useState(false)
    const [ammountToClaim,setAmmountToClaim] = useState(false)

    useEffect(() => {
        getRaces(wallet)
        console.log(race)
    }, [])

    const sell = async (_id) => {
        setLoading(true)
        setSelling(false)
        let body = { can: { onSale: { sale: true, price: price }, } }
        const value = web3.utils.toWei((price / 100).toString(), "ether")
        Contract.methods.onSale().send({ from: wallet, value }).then(async (res) => {
            await sendTransaction(_id, body)
            setLoading(false)
        }).catch(error => {
            console.log(error)
            setLoading(false)
        })
    }

    const _remove = async (_id) => {
        setLoading(true)
        setRemove(false)
        let body = { can: { onSale: { sale: false, price: 0 }, } }
        await sendTransaction(_id, body)
        setLoading(false)
    }

    const sendTransaction = async (_id, body) => {
        try {
            await axios.patch("https://cryptocans.io/api/v1/cans/" + _id, body)
            setSelling(false)
            setRemove(false)
            setPrice(0)
            exectConnect()
        } catch (error) {
            console.log(error)
            setSelling(false)
            setRemove(false)
            setPrice(0)
        }
    }

    const claim = async ()=>{
        const body = {
            "wallet": wallet,
            "amount": ammountToClaim
        }
        try {
            const res = await axios.patch("https://cryptocans.io/api/v1/claim",body)
            //console.log(res.data.response)
            console.log(Contract.methods)
            const ownerWallet = "0x20a4DaBC7C80C1139Ffc84C291aF4d80397413Da"
            Contract.methods.transferFrom(ownerWallet,wallet,"10000000000000000").call({from:wallet})
            .then(res => console.log(res))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="container-fluid p-2">
            {loading && <Loader />}
            {claiming && <ClaimModal claim={claim} ammountToClaim={ammountToClaim} setAmmountToClaim={setAmmountToClaim}/>}
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
            {selling &&
                <div className='modalX'>
                    <div className='modalIn'>
                        <div className=' w-100'>
                            <div className=''>

                                Selling  #{id && id} can
                                <h3 className='text-warning'>{price} BNB</h3>
                                <p className='text-warning'> Sales fee: {price / 100} BNB </p>
                                <input className='form-control' type="number" onChange={e => setPrice(e.target.value)} />
                            </div>
                            <div className='mt-3'>
                                <div className="row gx-2">
                                    <button onClick={_ => { setSelling(false); setPrice(0) }} className='btn mx-1 col btn-danger'> Cancel </button>
                                    <button onClick={_ => sell(id)} className='btn mx-1 col btn-primary'> Continue </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className="row g-2">
                <div className="col-md-3">
                    <div className="">
                        <div className="row g-2">
                            <div className="col-12">
                                <div className="box text-center d-flex align-items-center">
                                    <div className="w-100">
                                        <img className="my-2" height="50px" src="https://upload.wikimedia.org/wikipedia/commons/f/fc/Binance-coin-bnb-logo.png" alt="" />
                                        <div>
                                            <h5>{bnb} BNB
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="box text-center d-flex align-items-center">
                                    <div className="w-100">
                                        <img className="my-2" height="50px" src={ccan} alt="" />
                                        <div>
                                            <h5>{cct} CCT</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="box text-center justify-content-around d-flex align-items-center">
                                    <div className="">
                                        <img className="my-2" height="50px" src={cc} alt="" />
                                        <div>
                                            <h5>{balance?<> {Math.round((balance*100))/100}</>:<>0</>} Credits</h5>
                                        </div>
                                        1000 cc = 1 ccan
                                    </div>
                                    <div className="">
                                        <h5>Current fee 75%</h5>
                                        <button onClick={()=> setClaiming(true) } className="form-control btn btn-primary"> Claim </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-9 ">
                    <div className="">
                        <div className="dogFeatures">
                            <div className="d-flex justify-content-around">
                                <div className="text-center">
                                    Carreras
                                    <h3>0</h3>
                                </div>
                                <div className="text-center">
                                    Numero de NFT'S
                                    <h3>{cans.length} </h3>
                                </div>
                                <div className="text-center">
                                    Win Rate
                                    <h3>{cans.length}/10 </h3>
                                </div>
                            </div>
                            <div className="row g-2 mb-2">

                                {cans && cans.map((i) => {
                                    return (
                                        <div className="col-md-2" key={i.id}>
                                            <div className="nftSmall">

                                                {i.rarity === "1" && <div className='nftRarity common'> Common </div>}
                                                {i.rarity === "2" && <div className='nftRarity rare'> Rare </div>}
                                                {i.rarity === "3" && <div className='nftRarity epic'> Épic </div>}
                                                {i.rarity === "4" && <div className='nftRarity legendary'> Legendary </div>}

                                                <b className='text-white'> #{i.id} </b>
                                                <div className="nftImg">
                                                    <img className='imgNft' src={perro} alt="" />
                                                </div>
                                                <div className='nftName'>
                                                    {i.name} - {i.status}

                                                </div>
                                                <div className='nftStats'>
                                                    <div className="stats">
                                                        <div className="">
                                                            <div className='logoNft'>
                                                                <img className='logoImg' src={aero} alt="" />
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            {i.aerodinamica}
                                                        </div>
                                                        <div className="">
                                                            <div className='logoNft'> <img className='logoImg' src={aero} alt="" /></div>
                                                        </div>
                                                        <div className="">
                                                            {i.aceleracion}
                                                        </div>
                                                        <div className="">
                                                            <div className='logoNft'> <img className='logoImg' src={aero} alt="" /></div>
                                                        </div>
                                                        <div className="">
                                                            {i.resistencia}
                                                        </div>
                                                    </div>
                                                    <div>
                                                    </div>
                                                    <div className="totalStats">
                                                        <div>
                                                            {i.onSale.sale ?
                                                                <button onClick={_ => { setRemove(true); setId(i.id) }} className='btn btn-sm btn-warning'> Remove </button>
                                                                :
                                                                <button onClick={_ => { setSelling(true); setId(i.id) }} className='btn btn-sm btn-primary mx-2'> Sell </button>
                                                            }
                                                        </div>
                                                        <div>
                                                            {i.resistencia + i.aceleracion + i.aerodinamica}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>)
                                })}
                            </div>
                        </div>
                        <div className='p-2 border mt-2'>
                            {race && race.map(({ gainToken, canId, _id }, index) => {
                                return <div key={_id} className="border p-1">
                                    Race {index + 1} - canId: {canId} - {gainToken == 0 ? <>Lose</> : <>Win: +{gainToken}</>}
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Dashboard