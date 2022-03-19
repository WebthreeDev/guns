import React, { useState, useEffect } from "react";
import Abi from "./abi";
import Web3 from "web3";
import NftAbi from "./nftAbi";
const address = "0xB105c88bc2dA707A1eCB22910809ee9CFCf858E2"
const nftAddress = "0xC735B0593F4F4C49934675E8c66c6A6f45e45641"
const eth = window.ethereum
const web3 = new Web3(eth)
const web3Binance = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/")
const nftContract = new web3.eth.Contract(NftAbi, nftAddress)
const contract = new web3Binance.eth.Contract(Abi, address)
const CM = contract.methods

const nftMethods = nftContract.methods

const Test = () => {
    const [totalSupply, setTotal] = useState(false)
    const [name, setName] = useState(false)
    const [symbol, setSymbol] = useState(false)
    const [wallet, setWallet] = useState("")
    const [balance, setBalance] = useState(false)
    const [cm, setCM] = useState(false)
    const [user, setUser] = useState(false)
    const [hash, setHash] = useState(false)
    const [balanceNft, setBalanceNft] = useState(false)

    useEffect(() => {
        //console.log(nftMethods)
        getBalanceNft()
        setCM(CM)
        getUser()
    }, [nftMethods])

    const getBalanceNft = async () => {
        nftMethods.getBalance().call().then(res => {
            setBalanceNft(res)
        })
    }

    const getUser = async () => {

        const user = await eth.selectedAddress
        setUser(user)
       // console.log(user)
    }

    const changeWallet = (e) => {
        //console.log(e.target.value)
        setWallet(e.target.value)
    }
    //console.log()
    const getTotalSupply = _ => CM.totalSupply().call().then(res => setTotal(res))
    const getName = _ => CM.name().call().then(res => setName(res))
    const getSymbol = _ => CM.symbol().call().then(res => setSymbol(res))
    const getBalance = _ => CM.balanceOf(wallet).call().then(res => setBalance(res))
    const transfer = _ => CM.transfer(wallet, 10000000000).send({ "from": user })
        .then(res => {
            setHash(res.transactionHash)
        })

    const deposit = async () => {
        const ethers = Web3.utils.toWei("0.01", "ether")
        nftMethods.deposit().send({ "from": user, "value": ethers }).then((res1) => {
            //console.log(res1)
        })
    }

    const withdraw = () => {
        nftMethods.withdrawAll().send({ "from": user }).then(res => console.log(res))
    }


    return (
        <div className="container mt-5 text-center">
            {user ? <>
                <div className="p-5 border mb-5">
                    <button className="btn btn-primary form-control"> getBalance </button>
                    {balanceNft ? balanceNft : <>Loading</>}
                    <button onClick={deposit} className="btn btn-danger form-control my-4">Deposit</button>
                    <button onClick={withdraw} className="btn btn-warning form-control"> withdrawAll() </button>
                </div>

                <div className="border border-danger p-2">
                    wallet: {web3.eth.accounts.currentProvider.selectedAddress}
                </div>
                <div className="mb-2 border p-2">
                    <button className="btn btn-primary form-control" onClick={getTotalSupply}> TotalSuply </button>
                    {totalSupply ? totalSupply : <></>}
                </div>
                <div className="mb-2 border p-2">
                    <button onClick={getName} className="btn btn-primary form-control" > Name </button>
                    {name ? name : <></>}
                </div>
                <div className="mb-2 border p-2">
                    <button onClick={getSymbol} className="btn btn-primary form-control" > Symbol </button>
                    {symbol ? symbol : <></>}
                </div>
                <div className="mb-2 border p-2">
                    <input onChange={changeWallet} className="form-control mb-2" placeholder="Wallet" type="text" />
                    <button onClick={getBalance} className="btn btn-primary mb-2 form-control"> balanceOf </button>
                    {balance ? balance : false}
                </div>
                <div className="mb-2 border p-2">
                    <input onChange={changeWallet} className="form-control mb-2" placeholder="Wallet" type="text" />
                    <button onClick={transfer} className="btn btn-primary mb-2 form-control"> transfer </button>
                    {hash ? hash : false}
                </div>
            </> : <>loading</>}
        </div>
    )
}
export default Test