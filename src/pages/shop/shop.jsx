import React, { useContext, useEffect } from "react";
import sobre1 from "../../img/sobre.png"
import common from "../../img/common.png"
import sobre2 from "../../img/sobre2.png"
import sobre3 from "../../img/sobre3.png"
import { DataContext } from "../../context/DataContext";
import Loader from "../../components/loader/loader";
import axios from "axios"
import web3 from "../../tokens/canes/canes"
import { Contract } from "../../tokens/canes/canes"
import Package from "../../components/package/package";

const Shop = () => {
    const { getERC721Contract, loading, setLoading, wallet, connect, commonPackagePrice, epicPackagePrice, legendaryPackagePrice } = useContext(DataContext)
    useEffect(_ => {
        const erc721 = async () => await getERC721Contract()
        erc721()
    }, [])

    const buyPackage = async (packageId, wallet, price) => {
        setLoading(true)
        axios.post("https://cryptocans.io/api/v1/cans/", { id: packageId, wallet }).then((res) => {
            const response = res.data.response
            console.log(response)
            const value = web3.utils.toWei(price, "ether")
            const tokenId = response.id.toString()
            const nftType = response.packageId.toString()
            Contract.methods.mint(tokenId, nftType).send({ from: wallet, value, gasPrice: '21000000000' }).then((res) => {
                console.log(res)
                //actualizo el estado del perro
                const body = {
                    can: {
                        hash: res.transactionHash,
                        status: 1
                    }
                }
                axios.patch("https://cryptocans.io/api/v1/cans/" + response.id, body).then(async (res) => {
                    alert("Minteo Exitoso: " + response.rarity)
                    setLoading(false)
                }).catch(error => {
                    setLoading(false)
                    console.log(error)
                })
            }).catch(error => {

                //delete can
                deleteCan()
                setLoading(false)
                console.log(error)
            })
        }).catch(error => {
            alert()
            setLoading(false)
            console.log(error)
        })
    }

    const deleteCan = async () => {
        await axios.delete()
    }

    return (
        <div className="bg-dogs">

            {loading && <Loader />}
            {/*  <button onClick={timer}> timer  </button> */}
            <div className="container py-4">
                <div className="neon zxc">
                    <div className="w-100 ">
                        <div className="w-100">
                            <div className="row">
                                <div className="col-12 col-sm-6 mb-3 col-md-4">
                                    <div className="nftBorder">
                                        <div className="nftBg">
                                            <div className="d-flex justify-content-between">
                                                <div className="text-warning">
                                                    <b>
                                                        <i className="logoBNB">☻</i>  {commonPackagePrice} BNB
                                                    </b>
                                                </div>
                                                <div className="">
                                                    {loading ? <div className="btn"><h4>Loading</h4></div> : <>
                                                        {wallet ?
                                                            <button onClick={() => buyPackage("1", wallet, commonPackagePrice)} className="btn-ccan w-100"> MINT </button>
                                                            :
                                                            <button onClick={connect} className="btn-ccan"> Connect </button>}
                                                    </>}
                                                    <div className="minted-text">
                                                        Minted 0 / 1000
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex">
                                                <div className="commonText">
                                                    <img className="commonImg" src={common} alt="" />
                                                </div>
                                                <div className="">
                                                    <img className="imgNft1" src={sobre1} alt="" />
                                                    <div className="d-flex p-2 justify-content-center">
                                                        <div className="p-2 ">
                                                            <div>Common</div>
                                                            <div> <h5> 60%</h5> </div>
                                                            <div>Epic</div>
                                                            <div> <h5>0.9%</h5>  </div>
                                                        </div>
                                                        <div className="p-2 ">
                                                            <div>Rare</div>
                                                            <div> <h5>30%</h5>  </div>
                                                            <div>Legendary</div>
                                                            <div> <h5>0.1%</h5> </div>
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                                {/* <div className="nft-img2">
                                                    <Package img={sobre1} />
                                                    <div className="text-right">


                                                        
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="col-12 col-sm-6 mb-3 col-md-4">
                                    <div className="nftBg">
                                        <div className="text-center">
                                            <h4 className="text-white">Minted 0 / 500 </h4>
                                        </div>
                                        <div className="d-flex justify-content-center">
                                            <div className=" nft-img2">
                                                <Package img={sobre2} />
                                                <div className="text-right">
                                                    <h3 className="text-warning"> {epicPackagePrice} BNB </h3>
                                                    {loading ? <div className="btn w-100"><h4>Loading</h4></div> : <>
                                                        {wallet ?
                                                            <button onClick={_ => buyPackage(2, wallet, epicPackagePrice)} className="btn-ccan mt-2 w-100"> Mint </button>
                                                            :
                                                            <button onClick={connect} className="btn-ccan mt-2 w-100"> Connect </button>}
                                                    </>}
                                                    <div className="percent">
                                                        30% Common<br />
                                                        60% UnCommon<br />
                                                        10% Epic<br />
                                                        3% Legendary
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-6 mb-3 col-md-4">
                                    <div className="nftBg">
                                        <div className="text-center">
                                            <h4 className="text-white">Minted 0 / 250 </h4>
                                        </div>
                                        <div className="d-flex justify-content-center">
                                            <div className=" nft-img2">

                                                <Package img={sobre3} />
                                                <div className="text-right">
                                                    <h3 className="text-warning"> {legendaryPackagePrice} BNB </h3>
                                                    {loading ? <div className="btn w-100 "><h4>Loading</h4></div> : <>
                                                        {wallet ?
                                                            <button onClick={_ => buyPackage(3, wallet, legendaryPackagePrice)} className="btn-ccan mt-2 w-100"> Mint </button>
                                                            :
                                                            <button onClick={connect} className="btn-ccan mt-2 w-100"> Connect </button>}
                                                    </>}
                                                    <div className="percent">
                                                        0% Common<br />
                                                        60% UnCommon<br />
                                                        30% Epic<br />
                                                        10% Legendary
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
            </div>
        </div>
    )
}
export default Shop