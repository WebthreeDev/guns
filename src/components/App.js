import React, { useState, useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import Router from "./router"
import Navbar from "./chunk/navbar/navbar"

function App() {

  /*const [wallet, setWallet] = useState("")
    const [chain, setChain] = useState("")
    const [saldo, setSaldo] = useState(0)
    const [ammount, setAmmount] = useState(0)
    const [connected, setConnected] = useState(false)
    const [symbol, setSymbol] = useState("")*/
  /* const addressContract = "0x78f959923Ed10Af70729fa020C16Bd66AEE10083"
  const web3 = new Web3(window.ethereum)
  const mycontract = new web3.eth.Contract(Abi, addressContract)

  const bscNode = "https://bsc-dataseed.binance.org/"
  const utilsProvider = new Web3(bscNode)

  const chainIdhex = async () => {
    const chain = await window.ethereum.request({ method: 'eth_chainId' })
    setChain(chain)
    console.log(chain)
  } */
  /*   const connect = async () => {
  
      if (typeof window.ethereum !== 'undefined') {
  
        const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' })
        if (accounts) {
          setWallet(accounts[0])
          setConnected(true)
          //console.log(accounts)
        }
  
        mycontract.methods.balanceOf(accounts[0]).call().then((r) => {
          const saldoWallet = Math.round(web3.utils.fromWei(r, 'ether'))
          setSaldo(saldoWallet)
        })
  
        mycontract.methods.symbol().call().then((sym) => {
          setSymbol(sym)
        })
  
      } else {
        alert("No metamask installed")
      }
    } */
  /*
  const num = utilsProvider.utils.toWei("45", "ether")
  console.log("Este es el numero esperado de utils: " + num)
  const transferir = async () => {
    let monto = web3.utils.toWei("45", "ether")
    mycontract.methods.transfer("0x20a4DaBC7C80C1139Ffc84C291aF4d80397413Da", monto).send({ from: wallet })
    .on('transactionHash', (hash)=> {
      console.log(hash);
    })
  }
  const setAmmountFunction = (e) => {
    setAmmount(e.target.value)
  } */

  return (
    <BrowserRouter>
      <Navbar />
      <Router />
    </BrowserRouter>
  )
}

export default App;
