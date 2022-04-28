import React, { useContext, useEffect, useState } from "react";
import sobre1 from "../../img/perro.png"
import common from "../../img/common.png"
import canodrome from "../../img/canodrome.png"
import sobre2 from "../../img/epic.png"
import sobre3 from "../../img/legendary.png"
import { DataContext } from "../../context/DataContext";
import Loader from "../../components/loader/loader";
import axios from "axios"
import web3 from "../../tokens/canes/canes"
import { nftContract } from "../../tokens/canes/canes"
import { cctContract } from "../../tokens/cct/cct"
import { ticketsContract, _ticketsContract } from "../../tokens/buyTickets/buyTickets"
import Package from "../../components/package/package";
import MintModal from "../../components/mintModal/mintModal";
import bnbLogo from "../../img/bnbLogo.png"
//import NftPack from "../../components/nftPack/nftPack";

const Shop = () => {
    const {
        gas, gasPrice, getCans, getERC721Contract, loading, setLoading, wallet,
        connect, commonPackagePrice, epicPackagePrice, legendaryPackagePrice,
        canodromeCommonPrice, canodromeLegendaryPrice, getCanodromes,exectConnect
    } = useContext(DataContext)

    const [minted, setMinted] = useState(false)
    const [canMinted, setCanMinted] = useState(false)

    const [canodromeMintedData, setCanodromeMintedData] = useState(false)
    const [canodromeMinted, setCanodromeMinted] = useState(false)

    const [ticketModal, setTicketModal] = useState(false)
    const [ticketAmmount, setTicketAmmount] = useState(false)
    const [ticketPrice, setTicketPrice] = useState(false)

    useEffect(_ => {
        erc721()
        getTicketPrice()
    }, [])

    const getTicketPrice = async () => {
        const price = await ticketsContract.methods.ticketPrice().call()
        setTicketPrice(price)
    }

    const erc721 = async () => await getERC721Contract()

    const buyPackage = async (packageId, wallet, price) => {
        console.log(packageId)
        setLoading(true)
        //envio a la blockchain el packageId
        const value = web3.utils.toWei(price.toString(), "ether")
        console.log(price)
        try {
            const contractResponse = await nftContract.methods.mint(packageId).send({ from: wallet, value, gas, gasPrice })

            //Get hash 
            const hash = contractResponse.events.Transfer.transactionHash;

            if (packageId <= 3) {
                const canId = await contractResponse.events.Transfer.returnValues.tokenId
                const body = { wallet, packageId, canId, hash }
                const mintedCan = await axios.post(process.env.REACT_APP_BASEURL + "cans/", body)
                console.log(mintedCan.data.response)
                setCanMinted(mintedCan.data.response)
                setMinted(true)
                await getCans(wallet)
                await setLoading(false)
            } else if (packageId >= 4) {
                const canodromeId = await contractResponse.events.Transfer.returnValues.tokenId
                const body = { wallet, packageId, canodromeId, hash }
                const mintedCanodrome = await axios.post(process.env.REACT_APP_BASEURL + "canodrome/mint", body)
                console.log(mintedCanodrome.data.response)
                setCanodromeMintedData(mintedCanodrome.data.response)
                setCanodromeMinted(true)
                await getCanodromes(wallet)
                await setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            if (error.response) {
                console.log("Error Response")
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log("Error Request")
                console.log(error.request);
            } else {
                console.log("Error Message")
                console.log('Error', error.message);
            }
            console.log(error.config);
        }
    }


    const buyTicket = async () => {
        //approve ammout in the cct contract
        setTicketModal(false)
        setLoading(true)
        const address = _ticketsContract.address
        const total = ticketAmmount * ticketPrice
        const ammount = web3.utils.toWei(total.toString(), "ether")
        const from = wallet
        console.log(cctContract.methods)
        try {
            const cctRes = await cctContract.methods.approve(address, ammount).send({ from })
            if (cctRes.status) {
                const ticketRes = await ticketsContract.methods.buyTicket(ticketAmmount).send({ from })
                if (ticketRes.status) {
                    const body = { 
                         wallet,amount:ticketAmmount
                    }
                    const res = await axios.post(process.env.REACT_APP_BASEURL + "ticket",body)
                    console.log(res.data.response)
                    await exectConnect(wallet)
                    setLoading(false)
                }
            }

        } catch (error) {
            alert("Error")
            console.log(error)
        }
        //save the hash
        //send ammout tiket for this user
    }

    return (
        <div className="bg1 unikeRouter">
            {ticketModal && <div className="modalX">
                <div className="modalIn">
                    <div>
                        <h5> 1 ticket = {ticketPrice && ticketPrice} CCT</h5>
                        <h3>Ammount to buy</h3>
                        <input className="form-control" onChange={(e) => { setTicketAmmount(e.target.value) }} type="text" />
                        {wallet && <button className="btn btn-primary form-control" onClick={buyTicket}> Confirm </button>}
                        <button onClick={() => setTicketModal(false)} className="btn btn-danger"> Cancel </button>
                    </div>
                </div>
            </div>}
            {canodromeMinted && <>
                <div className='modalX'>
                    <div className='modalIn'>
                        <h5>Congratulations!</h5>
                        <button onClick={() => setCanodromeMinted(false)} className="btn btn-primary"> Continue </button>
                    </div>
                </div>
            </>
            }
            {minted && <MintModal getCans={getCans} wallet={wallet} canMinted={canMinted} setMinted={setMinted} />}
            {loading && <Loader />}
            <div className="container py-4">
                <div className="border p-4 bg-primary mb-4">
                    <h1 className="text-warning"> Need Ticket for the minigame? </h1>
                    <p> In this section you will buy the ticket to play in the ticket search minigame </p>
                    <h3 className="text-warning">Price: {ticketPrice && ticketPrice} CCT</h3>
                    <button onClick={() => setTicketModal(true)} className="btn btn-danger"> Buy </button>
                </div>
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
                                                    <div> <h5> 65%</h5> </div>
                                                    <div>Epic</div>
                                                    <div> <h5>4.9%</h5>  </div>
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
                                                    <div> <h5> 40%</h5> </div>
                                                    <div>Epic</div>
                                                    <div> <h5>19%</h5>  </div>
                                                </div>
                                                <div className="p-2 textGray">
                                                    <div>Rare</div>
                                                    <div> <h5>40%</h5>  </div>
                                                    <div>Legendary</div>
                                                    <div> <h5>1%</h5> </div>
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
                                                    <div> <h5>60%</h5>  </div>
                                                </div>
                                                <div className="p-2 textGray">
                                                    <div>Rare</div>
                                                    <div> <h5>35%</h5>  </div>
                                                    <div>Legendary</div>
                                                    <div> <h5>5%</h5> </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-2"></div>
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
                                                        {canodromeCommonPrice} BNB
                                                    </b>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="">
                                            {canodromeCommonPrice === false ? <button className="btn-ccan w-100">Loading</button> : <>
                                                {wallet ?
                                                    <button onClick={() => buyPackage("4", wallet, canodromeCommonPrice)} className="btn-ccan w-100"> MINT </button>
                                                    :
                                                    <button onClick={connect} className="btn-ccan w-100"> Connect </button>}
                                            </>}
                                            <div className="minted-text">
                                                Minted 0/300
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="commonText">
                                            <img className="commonImg" src={common} alt="" />
                                        </div>
                                        <div className="">
                                            <Package img={canodrome} />
                                            {/* <img className="imgNft1" src={canodrome} alt="" /> */}
                                            <div className="d-flex p-2 justify-content-center">
                                                <div className="p-2 textGray">
                                                    <div>Common</div>
                                                    <div> <h5> 65%</h5> </div>
                                                    <div>Epic</div>
                                                    <div> <h5>4.9%</h5>  </div>
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
                                <div className="nftBg">
                                    <div className="d-flex justify-content-between">
                                        <div className="">
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    <img height="24px" src={bnbLogo} alt="" />
                                                </div>
                                                <div className="">
                                                    <b className="mx-1">
                                                        {canodromeLegendaryPrice} BNB
                                                    </b>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="">
                                            {canodromeLegendaryPrice == false ? <button className="btn-ccan w-100">Loading</button> : <>
                                                {wallet ?
                                                    <button onClick={() => buyPackage("5", wallet, canodromeLegendaryPrice)} className="btn-ccan w-100"> MINT </button>
                                                    :
                                                    <button onClick={connect} className="btn-ccan w-100"> Connect </button>}
                                            </>}
                                            <div className="minted-text">
                                                Minted 0/100
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="commonText">
                                            <img className="commonImg" src={sobre3} alt="" />
                                        </div>
                                        <div className="">
                                            <Package img={canodrome} />
                                            {/*  <img className="imgNft1" src={sobre1} alt="" /> */}
                                            <div className="d-flex p-2 justify-content-center">
                                                <div className="p-2 textGray">
                                                    <div>Common</div>
                                                    <div> <h5> 0%</h5> </div>
                                                    <div>Epic</div>
                                                    <div> <h5>60%</h5>  </div>
                                                </div>
                                                <div className="p-2 textGray">
                                                    <div>Rare</div>
                                                    <div> <h5>35%</h5>  </div>
                                                    <div>Legendary</div>
                                                    <div> <h5>5%</h5> </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-2"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Shop

