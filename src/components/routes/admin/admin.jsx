import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../../../context/DataContext";
import { web3 } from "../../../services/w3S";
const Admin = () => {
    const _context = useContext(DataContext)
    const [contractOwner, setContractOwner] = useState(false)
    const [loading, setLoading] = useState(false)
    const [newOwnerWallet, setNewOwnerWallet] = useState(false)
    const [balance, setBalance] = useState(false)
    const [totalSold, setTotalSold] = useState(false)

    useEffect(() => {
        getERC721Contract()
        console.log(_context.Contract.methods)
    }, [])

    const getERC721Contract = async () => {
        _context.Contract.methods.totalSold().call().then(res => {
            setTotalSold(res)
            setLoading(false)
        })
        _context.Contract.methods.contractOwner().call().then((res) => {
            setContractOwner(res)
        })
        _context.Contract.methods.getBalance().call().then(res => {
            const _balance = web3.utils.fromWei(res, "ether")
            setBalance(_balance)
        })
        
        _context.Contract.methods.nftCommonPrice().call().then(res => {
            const _price = web3.utils.fromWei(res, "ether")
            _context.setCommonPackagePrice(_price)
        })
        _context.Contract.methods.nftEpicPrice().call().then(res => {
            const _price = web3.utils.fromWei(res, "ether")
            _context.setEpicPackagePrice(_price)
        })
        _context.Contract.methods.nftLegentadyPrice().call().then(res => {
            const _price = web3.utils.fromWei(res, "ether")
            _context.setLegendaryPackagePrice(_price)
        })
    }

    const changeOwner = () => {
        _context.Contract.methods.changeOwner(newOwnerWallet).send({ from: _context.wallet }).then(res => {
            console.log(res)
            getERC721Contract()
        })
    }
    const newOwner = e => setNewOwnerWallet(e.target.value)

    const withdraw = () => {
        _context.Contract.methods.withdraw().send({ from: _context.wallet }).then(res => {
            console.log(res)
            getERC721Contract()
        })
    }

    const changePackagePrice = e => _context.setNewPackagePrice(e.target.value)
    const changeNftPrice = (id) => {
        const newPrice = web3.utils.toWei(_context.newPackagePrice, "ether")
        _context.Contract.methods.changeNftPrice(id, newPrice).send({ from: _context.wallet }).then(res => {
            console.log(res)
            getERC721Contract()
        })
    }

    return (
        <div className="container mt-4">
            {loading ? <h1> Loading... </h1> :
                <div className="row g-2">
                    <div className="col-6">
                        <h1 className="">Contrato Nft</h1><hr></hr>

                        <h4>Get Balance</h4>
                        <h1 className="d-flex align-items-center">
                            <div className="gray">
                                {balance} BNB
                            </div>
                            <div>
                                <button onClick={withdraw} className="btn btn-danger mx-2"> withdraw to owner wallet </button>
                            </div>
                        </h1><hr />
                        <h3> Minted: <text className="gray"> {totalSold} </text>  </h3><hr></hr>
                        <h4>contractOwner:</h4>
                        <text className="gray">
                            {contractOwner} <hr />
                        </text>
                        <h4>ChangeOwner:</h4>
                        <text className="gray">
                            {newOwnerWallet}
                        </text>
                        <input onChange={newOwner} className="form-control mb-2" placeholder="New Owner Wallet (Only Owner)" type="text" />
                        <button onClick={changeOwner} className="btn btn-danger "> Change </button>
                    </div>
                    <div className="col-6">
                        <h4> Packages Prices </h4>
                        <div className="packages">
                            <b> Common:</b>
                            <text className="gray mx-2">
                                {_context.commonPackagePrice} BNB
                            </text>
                            <input onChange={changePackagePrice} className="form-control" placeholder="New BNB Price" type="text" />
                            <button className="btn btn-danger my-2" onClick={() => changeNftPrice(1)}> Change Price </button>
                        </div>
                        <div className="packages">
                            <b> Epic:</b>
                            <text className="gray mx-2">
                                {_context.epicPackagePrice} BNB
                            </text>
                            <input onChange={changePackagePrice} className="form-control" placeholder="New BNB Price" type="text" />
                            <button className="btn btn-danger my-2" onClick={() => changeNftPrice(2)}> Change Price </button>
                        </div>
                        <div className="packages">
                            <b> Legendary:</b>
                            <text className="gray mx-2">
                                {_context.legendaryPackagePrice} BNB
                            </text>
                            <input onChange={changePackagePrice} className="form-control" placeholder="New BNB Price" type="text" />
                            <button className="btn btn-danger my-2" onClick={() => changeNftPrice(3)}> Change Price </button>
                        </div>

                    </div>
                </div>
            }
        </div>
    )
}
export default Admin