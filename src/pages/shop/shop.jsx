import React, { useContext, useEffect, useState } from "react";
import sobre1 from "../../img/perro.png"
import common from "../../img/common.png"
import sobre2 from "../../img/epic.png"
import sobre3 from "../../img/legendary.png"
import { DataContext } from "../../context/DataContext";
import Loader from "../../components/loader/loader";
import axios from "axios"
import web3 from "../../tokens/canes/canes"
import { nftContract } from "../../tokens/canes/canes"
import Package from "../../components/package/package";
import MintModal from "../../components/mintModal/mintModal";
import bnbLogo from "../../img/bnbLogo.png"
//import NftPack from "../../components/nftPack/nftPack";

const Shop = () => {
    const {gas,gasPrice, getCans, getERC721Contract, loading, setLoading, wallet, connect, commonPackagePrice, epicPackagePrice, legendaryPackagePrice } = useContext(DataContext)
    const [minted, setMinted] = useState(false)
    const [canMinted, setCanMinted] = useState(false)
    useEffect(_ => {
        const erc721 = async () => await getERC721Contract()
        erc721()
    }, [])

    const buyPackage = async (packageId, wallet, price) => {
        setLoading(true)
        //envio a la blockchain el packageId
        const value = web3.utils.toWei(price.toString(), "ether")
        try {
            const contractResponse = await nftContract.methods.mint(packageId).send({ from: wallet, value, gas, gasPrice })
            const canId = await contractResponse.events.Transfer.returnValues.tokenId
            const body = { wallet, packageId, canId }
            const mintedCan = await axios.post(process.env.REACT_APP_BASEURL+"cans/", body)
            console.log(mintedCan.data.response)
            setCanMinted(mintedCan.data.response)
            setMinted(true)
            await setLoading(false)
            getCans(wallet)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    return (
        <div className="bg1 unikeRouter">
            {minted && <MintModal getCans={getCans} wallet={wallet} canMinted={canMinted} setMinted={setMinted} />}
            {loading && <Loader />}
            <div className="container py-4">
                <div className="w-100">
                    <div className="row">
                        <div className="col-12 col-sm-6 mb-3 col-md-4">
                            <div className="nftBorder animated">
                                <div className="nftBg">
                                    <div className="d-flex justify-content-between">
                                        <div className="text-warning">
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    <img height="24px" src={bnbLogo} alt="" />
                                                </div>
                                                <div className="">
                                                    <b className="mx-1">
                                                        {commonPackagePrice} BNB
                                                    </b>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="">
                                            {commonPackagePrice == false ? <button className="btn-ccan w-100">Loading</button> : <>
                                                {wallet ?
                                                    <button onClick={() => buyPackage("1", wallet, commonPackagePrice)} className="btn-ccan w-100"> MINT </button>
                                                    :
                                                    <button onClick={connect} className="btn-ccan w-100"> Connect </button>}
                                            </>}
                                            <div className="minted-text">
                                                Minted 0/1000
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="commonText">

                                            <img className="commonImg" src={common} alt="" />
                                        </div>
                                        <div className="">
                                            <Package img={sobre1} />
                                            {/* <img className="imgNft1" src={sobre1} alt="" /> */}
                                            <div className="d-flex p-2 justify-content-center">
                                                <div className="p-2 textGray">
                                                    <div>Common</div>
                                                    <div> <h5> 60%</h5> </div>
                                                    <div>Epic</div>
                                                    <div> <h5>0.9%</h5>  </div>
                                                </div>
                                                <div className="p-2 textGray">
                                                    <div>Rare</div>
                                                    <div> <h5>30%</h5>  </div>
                                                    <div>Legendary</div>
                                                    <div> <h5>0.1%</h5> </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-12 col-sm-6 mb-3 col-md-4">
                            <div className="animated">
                                <div className="nftBg ">
                                    <div className="d-flex justify-content-between">
                                        <div className="">
                                            <div className="d-flex align-items-center">
                                                <div> 
                                                    <img height="24px" src={bnbLogo} alt="" />
                                                </div>
                                                <div className="">
                                                    <b className="mx-1">
                                                        {epicPackagePrice} BNB
                                                    </b>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="">
                                            {epicPackagePrice == false ? <button className="btn-ccan w-100">Loading</button> : <>
                                                {wallet ?
                                                    <button onClick={() => buyPackage("2", wallet, epicPackagePrice)} className="btn-ccan w-100"> MINT </button>
                                                    :
                                                    <button onClick={connect} className="btn-ccan w-100"> Connect </button>}
                                            </>}
                                            <div className="minted-text">
                                                Minted 0/500
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="commonText">

                                            <img className="commonImg" src={sobre2} alt="" />
                                        </div>
                                        <div className="">
                                            <Package img={sobre1} />
                                            {/* <img className="imgNft1" src={sobre1} alt="" /> */}
                                            <div className="d-flex p-2 justify-content-center">
                                                <div className="p-2 textGray">
                                                    <div>Common</div>
                                                    <div> <h5> 30%</h5> </div>
                                                    <div>Epic</div>
                                                    <div> <h5>10%</h5>  </div>
                                                </div>
                                                <div className="p-2 textGray">
                                                    <div>Rare</div>
                                                    <div> <h5>60%</h5>  </div>
                                                    <div>Legendary</div>
                                                    <div> <h5>3%</h5> </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 mb-3 col-md-4">
                            <div className="animated">
                                <div className="nftBg">
                                    <div className="d-flex justify-content-between">
                                        <div className="">
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    <img height="24px" src={bnbLogo} alt="" />
                                                </div>
                                                <div className="">
                                                    <b className="mx-1">
                                                        {legendaryPackagePrice} BNB
                                                    </b>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="">
                                            {legendaryPackagePrice == false ? <button className="btn-ccan w-100">Loading</button> : <>
                                                {wallet ?
                                                    <button onClick={() => buyPackage("3", wallet, legendaryPackagePrice)} className="btn-ccan w-100"> MINT </button>
                                                    :
                                                    <button onClick={connect} className="btn-ccan w-100"> Connect </button>}
                                            </>}
                                            <div className="minted-text">
                                                Minted 0/250
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="commonText">
                                            <img className="commonImg" src={sobre3} alt="" />
                                        </div>
                                        <div className="">
                                            <Package img={sobre1} />
                                            {/*  <img className="imgNft1" src={sobre1} alt="" /> */}
                                            <div className="d-flex p-2 justify-content-center">
                                                <div className="p-2 textGray">
                                                    <div>Common</div>
                                                    <div> <h5> 0%</h5> </div>
                                                    <div>Epic</div>
                                                    <div> <h5>30%</h5>  </div>
                                                </div>
                                                <div className="p-2 textGray">
                                                    <div>Rare</div>
                                                    <div> <h5>60%</h5>  </div>
                                                    <div>Legendary</div>
                                                    <div> <h5>10%</h5> </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-12 col-sm-6 mb-3 col-md-4">
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
                            */}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Shop

