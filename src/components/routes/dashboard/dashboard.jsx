import React, { useContext, useEffect, useState } from 'react'
import cc from '../../../img/cc.png'
import ccan from '../../../img/ccan.png'
import { DataContext } from '../../../context/DataContext'
import axios from 'axios'
import perro from '../../../img/perro.png'
import aero from '../../../img/aero.png'
import Loader from '../../chunk/loader/loader'
//import Swal from "sweetalert2"
//import withReactContent from 'sweetalert2-react-content'

const Dashboard = () => {
    const { wallet, getCans, cans, setCans, bnb, loading } = useContext(DataContext)

    useEffect(() => {
        getCans()
    }, [wallet])

    //const MySwal = withReactContent(Swal)
    /* const alertTest = () => { MySwal.fire({title:'Auto close alert!'})  Swal.showLoading() } */

    return (
        <div className="container-fluid p-2">
            {loading && <Loader />}
            <div className="row g-2">
                <div className="col-md-3">
                    <div className="">
                        <div className="row g-2">
                            <div className="col-12">
                                <div className="box text-center d-flex align-items-center">
                                    <div className="w-100">
                                        <img className="my-2" height="50px" src="https://upload.wikimedia.org/wikipedia/commons/f/fc/Binance-coin-bnb-logo.png" alt="" />
                                        <div>
                                            <h5>{bnb} BNB</h5>
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
                                {cans && cans.map((i) => (
                                    <div className="col-md-2" key={i.id}>
                                        <div className="nftSmall">
                                            <div className='nftRarity'>
                                                {i.rarity === "1" ? <> Common </> : <></>}
                                                {i.rarity === "2" ? <> Rare </> : <></>}
                                                {i.rarity === "3" ? <> Épic </> : <></>}
                                                {i.rarity === "4" ? <> Legendary </> : <></>}
                                            </div>
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
                                                <div className="totalStats">
                                                    {i.resistencia + i.aceleracion + i.aerodinamica}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Dashboard