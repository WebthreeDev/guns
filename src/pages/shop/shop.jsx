import React, { useContext, useEffect, useState } from "react";
import sobre1 from "../../img/perro.png"
import common from "../../img/common.png"
import canodrome from "../../img/1.png"
import canodromeLegendary from "../../img/4.png"
import sobre2 from "../../img/rare.png"
import sobre3 from "../../img/legendary.png"
import { DataContext } from "../../context/DataContext";
import Loader from "../../components/loader/loader";
import axios from "axios"
import web3 from "../../tokensDev/canes/canes"
import { ticketsContract, _ticketsContract } from "../../tokensDev/buyTickets/buyTickets"
import Package from "../../components/package/package";
import MintModal from "../../components/mintModal/mintModal";
import bnbLogo from "../../img/bnbLogo.png"
import enviroment from "../../env";
import { nftContractProd } from "../../tokensProd/canes/canes"
import { testNftContract } from "../../tokensDev/canes/canes"
import { cctContractDev } from "../../tokensDev/cct/cct"
import { cctContractProd } from "../../tokensProd/cct/cct"
import '../../css/pages/shop.scss';
import ticket from '../../img/tikets/ticket.png'
import logoCCT from '../../img/assets/icons/logoCCT.png'

let cctContract
if (process.env.REACT_APP_ENVIROMENT == "prod") cctContract = cctContractProd()
if (process.env.REACT_APP_ENVIROMENT == "dev") cctContract = cctContractDev()
let nftContract
if (process.env.REACT_APP_ENVIROMENT == "prod") nftContract = nftContractProd()
if (process.env.REACT_APP_ENVIROMENT == "dev") nftContract = testNftContract()

const Shop = () => {


    const {
        gas, gasPrice, getCans, getERC721Contract, loading, setLoading, wallet,
        commonPackagePrice, epicPackagePrice, legendaryPackagePrice,
        canodromeCommonPrice, canodromeLegendaryPrice, getCanodromes, exectConnect
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

        console.log(nftContract.methods)
        setLoading(true)
        //envio a la blockchain el packageId
        const value = web3.utils.toWei(price.toString(), "ether")
        console.log(price)
        try {
            const contractResponse = await nftContract.methods.mint(packageId).send({ from: wallet, value })

            //Get hash
            const hash = contractResponse.events.Transfer.transactionHash;

            if (packageId <= 3) {
                const canId = await contractResponse.events.Transfer.returnValues.tokenId
                const body = { wallet, packageId, canId, hash }
                const mintedCan = await axios.post(enviroment().baseurl + "cans", body)
                console.log(mintedCan.data.response)
                setCanMinted(mintedCan.data.response)
                setMinted(true)
                await getCans(wallet)
                await setLoading(false)
            } else if (packageId >= 4) {
                const canodromeId = await contractResponse.events.Transfer.returnValues.tokenId
                const body = { wallet, packageId, canodromeId, hash }
                const mintedCanodrome = await axios.post(enviroment().baseurl + "canodrome/mint", body)
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
                        wallet, amount: ticketAmmount
                    }
                    const res = await axios.post(enviroment().baseurl + "ticket", body)
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
            {ticketModal && <div className='modalX'>
            <div className="modalInClaim">
                <div>
                    <div className=" mb-3 d-flex justify-content-between align-items-center">
                        <div className="textClaim">Buy Ticket</div>
                        <div>
                            <div className="w-50 p-2 ">
                                <button className="btn btn-danger btn-sm" onClick={() => setTicketModal(false)}> X </button>
                            </div>
                        </div>
                    </div>
                    <div className="textClaim">1 ticket = {ticketPrice && ticketPrice} CCT </div>
                    <div className='textClaim2'>
                        Amount to buy
                    </div>
                    <div className='container-fluid p-0 mt-3'>
                        <div className="row gx-0">
                            <div className='col-2'>
                                <img className='logoClaim' src={logoCCT} alt=""  />
                            </div>
                            <div className='col-10'>
                                <input className="inputClaim" onChange={(e) => { setTicketAmmount(e.target.value) }} type="text" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 mb-2 text-center">
                        ↑↓
                    </div>
                    <div className='container-fluid p-0'>
                        <div className="row">
                            <div className='col-2'>
                                <img className='logoClaim' src={ticket} alt="" />
                            </div>
                            <div className='col-10'>
                                <div className="inputClaim">
                                    {ticketAmmount && <input className="inputClaim" value={ticketAmmount} type="text" />}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-100 d-flex mt-5 px-4">
                        <div className="w-100">
                            <button className="btn btn-primary w-100" onClick={buyTicket}> Confirm </button>
                        </div>
                    </div>
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
                <div>
                    <h1> Need Ticket for the minigame? </h1>
                    <p> In this section you will buy the ticket to play in the ticket search minigame </p>
                    <div className="ticket-buy">
                        <h3 className="text-warning">Price: {ticketPrice && ticketPrice} CCT</h3>
                        {ticketPrice ? <button onClick={() => setTicketModal(true)} className="btn btn-danger"> Buy </button> :
                            <button className="btn btn-secondary" disabled> Loading </button>
                        }
                    </div>   
                </div>
                <div className="w-100">
                    <div className="row card-container">
                        <div className="card mb-3 col-3">
                            <div className="card-header">
                                <div>
                                    <img height="24px" src={bnbLogo} alt="" />
                                    <b className="mx-1">
                                        {commonPackagePrice} BNB
                                    </b>
                                </div>
                                <div className="card-mint">
                                    {commonPackagePrice == false ? <button>Loading</button> : <>
                                        {wallet ?
                                            <button onClick={() => buyPackage("1", wallet, commonPackagePrice)} className="btn-mint btn btn btn-warning"> MINT </button>
                                            :
                                            <button onClick={exectConnect} className="btn-mint btn btn btn-warning"> Connect </button>}
                                    </>}
                                </div>
                            </div>
                            <div className="card-body">
                                <Package className="nft-img" img={sobre1} />
                                <div className="card-text-footer">
                                    <div>
                                        <div className="card-text-item">
                                            <p>Common</p>
                                            <h6> 65%</h6>
                                        </div>
                                        <div className="card-text-item">
                                            <p>Epic</p>
                                            <h6>4.9%</h6>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="card-text-item">
                                            <p>Rare</p>
                                            <h6>30%</h6>
                                        </div>
                                        <div className="card-text-item">
                                            <p>Legendary</p>
                                            <h6>0.1%</h6>
                                        </div>
                                    </div>                    
                                </div>
                            </div>
                        </div>
                        <div className="card mb-3 col-3">
                            <div className="card-header">
                                <div>
                                    <img height="24px" src={bnbLogo} alt="" />
                                    <b className="mx-1">
                                        {epicPackagePrice} BNB
                                    </b>
                                </div>
                                <div className="card-mint">
                                    {epicPackagePrice == false ? <button>Loading</button> : <>
                                        {wallet ?
                                            <button onClick={() => buyPackage("2", wallet, epicPackagePrice)} className="btn-mint btn btn btn-warning"> MINT </button>
                                            :
                                            <button onClick={exectConnect} className="btn-mint btn btn btn-warning"> Connect </button>}
                                    </>}
                                </div>
                            </div>
                            <div className="card-body">
                                <Package className="nft-img" img={sobre2} />
                                <div className="card-text-footer">
                                    <div>
                                        <div className="card-text-item">
                                            <p>Common</p>
                                            <h6>40%</h6>
                                        </div>
                                        <div className="card-text-item">
                                            <p>Epic</p>
                                            <h6>19%</h6>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="card-text-item">
                                            <p>Rare</p>
                                            <h6>40%</h6>
                                        </div>
                                        <div className="card-text-item">
                                            <p>Legendary</p>
                                            <h6>1%</h6>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div className="card mb-3 col-3">
                            <div className="card-header">
                                <div>
                                    <img height="24px" src={bnbLogo} alt="" />
                                    <b className="mx-1">
                                    {legendaryPackagePrice} BNB
                                    </b>
                                </div>
                                <div className="card-mint">
                                    {legendaryPackagePrice == false ? <button className="btn-mint">Loading</button> : <>
                                        {wallet ?
                                            <button onClick={() => buyPackage("3", wallet, legendaryPackagePrice)}  className="btn-mint btn btn btn-warning"> MINT </button>
                                            :
                                            <button onClick={exectConnect}  className="btn-mint btn btn btn-warning"> Connect </button>}
                                    </>}
                                </div>
                            </div>
                            <div className="card-body">
                                <Package className="nft-img" img={sobre3} />
                                <div className="card-text-footer">
                                    <div>
                                        <div className="card-text-item">
                                            <p>Common</p>
                                            <h6> 0%</h6>
                                        </div>
                                        <div className="card-text-item">
                                            <p>Epic</p>
                                            <h6>60%</h6>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="card-text-item">
                                            <p>Rare</p>
                                            <h6>35%</h6>
                                        </div>
                                        <div className="card-text-item">
                                            <p>Legendary</p>
                                            <h6>5%</h6>
                                        </div>
                                    </div>                    
                                </div>
                            </div>
                        </div>
                    </div>
                        
                    <div className="row card-container">
                        <div className="card mb-3 col-3">
                            <div className="card-header">
                                <div>
                                    <img height="24px" src={bnbLogo} alt="" />
                                    <b className="mx-1">
                                    {canodromeCommonPrice} BNB
                                    </b>
                                </div>
                                <div className="card-mint">
                                    {canodromeCommonPrice === false ? <button>Loading</button> : <>
                                        {wallet ?
                                            <button onClick={() => buyPackage("4", wallet, canodromeCommonPrice)} className="btn-mint btn btn btn-warning"> MINT </button>
                                            :
                                            <button onClick={exectConnect} className="btn-mint btn btn btn-warning"> Connect </button>}
                                    </>}
                                </div>
                            </div>
                            <div className="card-body">
                                <Package className="nft-img" img={canodrome} />
                                <div className="card-text-footer">
                                    <div>
                                        <div className="card-text-item">
                                            <p>Common</p>
                                            <h6> 65%</h6>
                                        </div>
                                        <div className="card-text-item">
                                            <p>Epic</p>
                                            <h6>4.9%</h6>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="card-text-item">
                                            <p>Rare</p>
                                            <h6>30%</h6>
                                        </div>
                                        <div className="card-text-item">
                                            <p>Legendary</p>
                                            <h6>0.1%</h6>
                                        </div>
                                    </div>                    
                                </div>
                            </div>
                        </div>
                        <div className="card mb-3 col-3">
                            <div className="card-header">
                                <div>
                                    <img height="24px" src={bnbLogo} alt="" />
                                    <b className="mx-1">
                                    {canodromeLegendaryPrice} BNB
                                    </b>
                                </div>
                                <div className="card-mint">
                                    {canodromeLegendaryPrice == false ? <button>Loading</button> : <>
                                        {wallet ?
                                            <button onClick={() => buyPackage("5", wallet, canodromeLegendaryPrice)} className="btn-mint btn btn btn-warning"> MINT </button>
                                            :
                                            <button onClick={exectConnect} className="btn-mint btn btn btn-warning"> Connect </button>}
                                    </>}
                                </div>
                            </div>
                            <div className="card-body">
                                <Package className="nft-img" img={canodromeLegendary}/>
                                <div className="card-text-footer">
                                    <div>
                                        <div className="card-text-item">
                                            <p>Common</p>
                                            <h6> 0%</h6>
                                        </div>
                                        <div className="card-text-item">
                                            <p>Epic</p>
                                            <h6>60%</h6>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="card-text-item">
                                            <p>Rare</p>
                                            <h6>35%</h6>
                                        </div>
                                        <div className="card-text-item">
                                            <p>Legendary</p>
                                            <h6>5%</h6>
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

