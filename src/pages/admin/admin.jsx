import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../../context/DataContext";
import { web3 } from "../../services/w3S";
import Loader from "../../components/loader/loader";
const Admin = () => {
    const _context = useContext(DataContext)

    const [contractOwner, setContractOwner] = useState(false)
    const [newOwnerWallet, setNewOwnerWallet] = useState(false)
    const [balance, setBalance] = useState(false)
    const [totalSold, setTotalSold] = useState(false)

    useEffect(() => {
        _context.getERC721Contract()
        contractAdminSection()
        console.log(_context.nftContract.methods)
    }, [])

    const contractAdminSection = async () => {
        console.log("obtener los contratos")
        _context.nftContract.methods.totalSold().call().then(res => {
            setTotalSold(res)
            console.log("total sold")
        })

        _context.nftContract.methods.contractOwner().call().then((res) => {
            setContractOwner(res)
        })

        _context.nftContract.methods.getBalance().call().then(res => {
            const _balance = web3.utils.fromWei(res, "ether")
            setBalance(_balance)
        })
    }

    const changeOwner = () => {
        _context.nftContract.methods.changeOwner(newOwnerWallet).send({ from: _context.wallet }).then(res => {
            //console.log(res)
            contractAdminSection()
        })
    }
    const newOwner = e => setNewOwnerWallet(e.target.value)

    const withdraw = () => {
        _context.nftContract.methods.withdraw().send({ from: _context.wallet }).then(res => {
            //console.log(res)
            contractAdminSection()
        })
    }

    const changePackagePrice = e => {
        console.log(e.target.value)
        _context.setNewPackagePrice(e.target.value)
    }
    const changeNftPrice = async (id) => {
        await _context.setLoading(true)
        const newPrice = web3.utils.toWei(_context.newPackagePrice, "ether")
        _context.nftContract.methods.changeNftPrice(id, newPrice).send({ from: _context.wallet }).then(res => {
            console.log(res)
        }).finally( async ()=>{
            await contractAdminSection()
            await _context.getERC721Contract()
            await _context.setLoading(false)
        })
    }

    return (
        <div className="container  pt-5">
            {_context.loading && <Loader />}
            <div className="row g-2 mt-2">
                <div className="col-6">
                    <h1 className="">Contrato Nft</h1><hr></hr>

                    <h4>Get Balance</h4>
                    <h1 className="">
                        <div className="text-warning">
                            {balance} BNB
                        </div>
                        <div>
                            <button onClick={withdraw} className="btn btn-danger mx-2"> withdraw to owner wallet </button>
                        </div>
                    </h1><hr />
                    <h3> Minted: <div className="gray"> {totalSold} </div>  </h3><hr></hr>
                    <h4>contractOwner:</h4>
                    <div className="gray">
                        {contractOwner} <hr />
                    </div>
                    <h4>ChangeOwner:</h4>
                    <div className="gray">
                        {newOwnerWallet}
                    </div>
                    <input onChange={newOwner} className="form-control mb-2" placeholder="New Owner Wallet (Only Owner)" type="text" />
                    <button onClick={changeOwner} className="btn btn-danger "> Change </button>
                </div>
                <div className="col-6">
                    <h4> Packages Prices </h4>
                    <div className="packages">
                        <b> Common:</b>
                        <div className="gray mx-2">
                            {_context.commonPackagePrice} BNB
                        </div>
                        <input onChange={changePackagePrice} className="form-control" placeholder="New BNB Price" type="text" />
                        <button className="btn btn-danger my-2" onClick={() => changeNftPrice(1)}> Change Price </button>
                    </div>
                    <div className="packages">
                        <b> Epic:</b>
                        <div className="gray mx-2">
                            {_context.epicPackagePrice} BNB
                        </div>
                        <input onChange={changePackagePrice} className="form-control" placeholder="New BNB Price" type="text" />
                        <button className="btn btn-danger my-2" onClick={() => changeNftPrice(2)}> Change Price </button>
                    </div>
                    <div className="packages">
                        <b> Legendary:</b>
                        <div className="gray mx-2">
                            {_context.legendaryPackagePrice} BNB
                        </div>
                        <input onChange={changePackagePrice} className="form-control" placeholder="New BNB Price" type="text" />
                        <button className="btn btn-danger my-2" onClick={() => changeNftPrice(3)}> Change Price </button>
                    </div>
                    <div className="packages2">
                        <b> Canodrome Common:</b>
                        <div className="gray mx-2">
                            {_context.canodromeCommonPrice} BNB
                        </div>
                        <input onChange={changePackagePrice} className="form-control" placeholder="New BNB Price" type="text" />
                        <button className="btn btn-danger my-2" onClick={() => changeNftPrice(4)}> Change Price </button>
                    </div>
                    <div className="packages2">
                        <b> Canodrome Legendary:</b>
                        <div className="gray mx-2">
                            {_context.canodromeLegendaryPrice} BNB
                        </div>
                        <input onChange={changePackagePrice} className="form-control" placeholder="New BNB Price" type="text" />
                        <button className="btn btn-danger my-2" onClick={() => changeNftPrice(5)}> Change Price </button>
                    </div>

                </div>
            </div>

            <div className="row">

            </div>
        </div>
    )
}
export default Admin