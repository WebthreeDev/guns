import React, { useState, useContext } from "react"
import { Link } from "react-router-dom"
import rundog from '../../../img/rundog.gif'
import { DataContext } from '../../../context/DataContext'
import walletImg from '../../../img/wallet.png'

const Navbar = () => {

    const { wallet, Connect, resumeWallet } = useContext(DataContext)

    const location = "/dashboard"

    const bg1 = { backgroundColor: "rgb(19,20,25)" }
    const bg2 = { backgroundColor: "rgb(32,34,46)" }
    const [btn1, setBtn1] = useState(bg2)
    const [btn2, setBtn2] = useState(bg1)
    const [btn3, setBtn3] = useState(bg1)
    const [btn4, setBtn4] = useState(bg1)

    const changebtnStyle = () => {
        if (location === "/dashboard") { setBtn1(bg2); setBtn2(bg1); setBtn3(bg1); setBtn4(bg1) }
        if (location === "/market") { setBtn1(bg1); setBtn2(bg2); setBtn3(bg1); setBtn4(bg1) }
        if (location === "/shop") { setBtn1(bg1); setBtn2(bg1); setBtn3(bg2); setBtn4(bg1) }
        if (location === "/race") { setBtn1(bg1); setBtn2(bg1); setBtn3(bg1); setBtn4(bg2) }
    }

    return (
        <nav className="px-2 topNav">
            <div className="d-flex justify-content-between">
                <div className="d-inline-flex justify-content-between align-items-center">
                    <div>
                        <img height="30px" src={rundog} alt="" />
                        Cryptocans
                    </div>
                    <div className="mx-2 d-flex">
                        <Link to="/dashboard" className="link" >
                            <div className="buttonLink" style={btn1} onClick={() => { changebtnStyle() }}>
                                Dashboard
                            </div>
                        </Link>
                        <Link to="/market" className="link">
                            <div className="buttonLink" style={btn2} onClick={() => { changebtnStyle() }}>
                                Market
                            </div>
                        </Link>
                        <Link className="link" to="/shop">
                            <div className="buttonLink" style={btn3} onClick={() => { changebtnStyle() }}>
                                Shop
                            </div>
                        </Link>
                        <Link className="link" to="/race">
                            <div className="buttonLink" style={btn4} onClick={() => { changebtnStyle() }}>
                                Race
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    {wallet? <>
                        {
                            <div className="wallet">
                                <div className="wallet-circle">
                                    <img height="20px" src={walletImg} />
                                </div>
                                <b className="mx-2">
                                    {resumeWallet(wallet)}
                                </b>

                            </div>
                        }
                    </> : <button onClick={Connect} className="buttonLink mx-1"> Connect Wallet </button>
                    }
                </div>
            </div>
        </nav>
    )
}
export default Navbar