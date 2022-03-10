import React, { useContext, useEffect } from 'react'
import cc from '../../../img/cc.png'
import ccan from '../../../img/ccan.png'
import { DataContext } from '../../../context/DataContext'
//import Swal from "sweetalert2"
//import withReactContent from 'sweetalert2-react-content'

const Dashboard = () => {
    const { wallet } = useContext(DataContext)
  
    //const MySwal = withReactContent(Swal)
    /* const alertTest = () => { MySwal.fire({title:'Auto close alert!'})  Swal.showLoading() } */

    return (

        <div className="container-fluid p-2">


            <div className="row g-2">
                <div className="col-md-5 ">
                    <div className="">
                        <div>
                        </div>
                        <div className="row g-2">
                            <div className="col-6">
                                <div className="box text-center d-flex align-items-center">
                                    <div className="w-100">
                                        <img className="my-2" height="50px" src="https://upload.wikimedia.org/wikipedia/commons/f/fc/Binance-coin-bnb-logo.png" alt="" />
                                        <div>
                                            <h5>0.0123 BNB</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
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
                <div className="col-7 ">
                    <div className="">
                        <div className="dogFeatures">
                            Wallet: <a href="/">ddf6...d5fg4</a>
                            <hr className="hr" />
                            <div className="d-flex justify-content-around">
                                <div className="text-center">
                                    Carreras Competidas
                                    <h3>45</h3>
                                </div>
                                <div className="text-center">
                                    Numero de NFT'S
                                    <h3>3</h3>
                                </div>
                            </div>
                            <div className="row g-2 mb-2">
                                <div className="col-md-2">
                                    <div className="nftSmall d-flex align-items-center justify-content-center">
                                        <div className="text-center">
                                            <div>
                                                NFT 1
                                            </div>
                                            <div>
                                                <button className="btn btn-list btn-sm"><i className="bi-list"></i></button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="nftSmall d-flex align-items-center justify-content-center">
                                        <div className="text-center">
                                            <div>
                                                NFT 2
                                            </div>
                                            <div>
                                                <button className="btn btn-list btn-sm"><i className="bi-list"></i></button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="nftSmall d-flex align-items-center justify-content-center">
                                        <div className="text-center">
                                            <div>
                                                NFT 3
                                            </div>
                                            <div>
                                                <button className="btn btn-list btn-sm"><i className="bi-list"></i></button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="nftSmall d-flex align-items-center justify-content-center">
                                        <div className="text-center">
                                            <div>
                                                NFT 4
                                            </div>
                                            <div>
                                                <button className="btn btn-list btn-sm"><i className="bi-list"></i></button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="nftSmall d-flex align-items-center justify-content-center">
                                        <div className="text-center">
                                            <div>
                                                NFT 5
                                            </div>
                                            <div>
                                                <button className="btn btn-list btn-sm"><i className="bi-list"></i></button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="nftSmall d-flex align-items-center justify-content-center">
                                        <div className="text-center">
                                            <div>
                                                NFT 6
                                            </div>
                                            <div>
                                                <button className="btn btn-list btn-sm"><i className="bi-list"></i></button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="row g-2">
                                <div className="col-md-2">
                                    <div className="nftSmall d-flex align-items-center justify-content-center">
                                        <div className="text-center">
                                            <div>
                                                NFT 1
                                            </div>
                                            <div>
                                                <button className="btn btn-list btn-sm"><i className="bi-list"></i></button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="nftSmall d-flex align-items-center justify-content-center">
                                        <div className="text-center">
                                            <div>
                                                NFT 2
                                            </div>
                                            <div>
                                                <button className="btn btn-list btn-sm"><i className="bi-list"></i></button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="nftSmall d-flex align-items-center justify-content-center">
                                        <div className="text-center">
                                            <div>
                                                NFT 3
                                            </div>
                                            <div>
                                                <button className="btn btn-list btn-sm"><i className="bi-list"></i></button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="nftSmall d-flex align-items-center justify-content-center">
                                        <div className="text-center">
                                            <div>
                                                NFT 4
                                            </div>
                                            <div>
                                                <button className="btn btn-list btn-sm"><i className="bi-list"></i></button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="nftSmall d-flex align-items-center justify-content-center">
                                        <div className="text-center">
                                            <div>
                                                NFT 5
                                            </div>
                                            <div>
                                                <button className="btn btn-list btn-sm"><i className="bi-list"></i></button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="nftSmall d-flex align-items-center justify-content-center">
                                        <div className="text-center">
                                            <div>
                                                NFT 6
                                            </div>
                                            <div>
                                                <button className="btn btn-list btn-sm"><i className="bi-list"></i></button>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}

export default Dashboard