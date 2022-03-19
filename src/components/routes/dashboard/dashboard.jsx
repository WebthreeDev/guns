import React, { useContext, useEffect, useState } from 'react'
import cc from '../../../img/cc.png'
import ccan from '../../../img/ccan.png'
import { DataContext } from '../../../context/DataContext'
import axios from 'axios'
import perro from '../../../img/perro.png'
import aero from '../../../img/aero.png'
import Loader from '../../chunk/loader/loader'
import web3, { Contract } from '../../../tokens/canes/canes'

const Dashboard = () => {
    const { cans, bnb, loading, setLoading, exectConnect, wallet } = useContext(DataContext)
    const [price, setPrice] = useState(0)
    const [id, setId] = useState(false)
    const [remove, setRemove] = useState(false)
    const [selling, setSelling] = useState(false)

    useEffect(() => {
        exectConnect()
    }, [])

    const sell = async (_id) => {
        setLoading(true)
        let body = { can: { onSale: { sale: true, price: price }, } }
        const value = web3.utils.toWei((price / 100 * 3).toString(), "ether")
        Contract.methods.onSale().send({ from: wallet, value }).then(async (res) => {
            sendTransaction(_id,body)
        }).catch(error => console.log(error))
    }

    const _price = (e) => setPrice(e.target.value)

    const _remove = async (_id) => {
        setLoading(true)
        setRemove(false)
        let body = { can: { onSale: { sale: false, price: 0 }, } }
        sendTransaction(_id,body)
    }

    const sendTransaction = async(_id,body)=>{
        try {
            const res = await axios.patch("https://cryptocans.io/api/v1/cans/" + _id, body)
            setSelling(false)
            setRemove(false)
            setPrice(0)
            await exectConnect()
        } catch (error) {
            console.log(error)
            setSelling(false)
            setRemove(false)
            setPrice(0)
            await exectConnect()
        }
    }

    return (
        <div className="container-fluid p-2">
            {loading && <Loader />}
            {remove &&
                <div className='modalX'>
                    <div className='modalIn'>
                        <h5>¿Esta seguro que desea remover este can del mercado?</h5>
                        <div className='d-flex justify-content-center'>
                            <button onClick={_ => setRemove(false)} className='btn btn-danger'>Cancelar</button>
                            <button onClick={_ => _remove(id)} className='btn btn-primary mx-2'>Remover</button>
                        </div>
                    </div>
                </div>}
            {selling &&
                <div className='modalX'>
                    <div className='modalIn'>
                        <div>
                            <p>Nft Price</p>
                            #{id && id}
                            <h3 className='text-warning'>{price} BNB</h3>
                            <p className='text-warning'> Sales fee: {price / 100 * 3} BNB </p>
                            <input className='form-control' type="number" onChange={_price} />
                        </div>
                        <div className='mt-3'>
                            <div className="row gx-2">
                                <button onClick={_ => { setSelling(false); setPrice(0) }} className='btn mx-1 col btn-danger'> Cancel </button>
                                <button onClick={_ => sell(id)} className='btn mx-1 col btn-primary'> Sell </button>
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
                                            <h5>105 CCAN</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="box text-center justify-content-around d-flex align-items-center">
                                    <div className="">
                                        <img className="my-2" height="50px" src={cc} alt="" />
                                        <div>
                                            <h5>550 CC</h5>
                                        </div>
                                        1000 cc = 1 ccan
                                    </div>
                                    <div className="">
                                        <h5>Current fee 75%</h5>
                                        <button className="form-control btn btn-primary"> Claim </button>
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
                                {console.log(cans)}
                                {cans && cans.map((i) => {
                                    return (i.status === 1 &&
                                        <div className="col-md-2" key={i.id}>
                                            <div className="nftSmall">
                                                <div className='nftRarity'>
                                                    {i.rarity === "1" ? <> Common </> : <></>}
                                                    {i.rarity === "2" ? <> Rare </> : <></>}
                                                    {i.rarity === "3" ? <> Épic </> : <></>}
                                                    {i.rarity === "4" ? <> Legendary </> : <></>}
                                                </div>
                                                <b className='text-dark'> #{i.id} </b>
                                                <div className="nftImg">
                                                    <img className='imgNft' src={perro} alt="" />
                                                </div>
                                                <div className='nftName'>
                                                    {i.name}
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
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Dashboard