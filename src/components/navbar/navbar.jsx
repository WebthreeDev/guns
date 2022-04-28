import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { DataContext } from '../../context/DataContext'

const Navbar = () => {
    const {dayReset, wallet, connect, resumeWallet,exectConnect } = useContext(DataContext)
    /* const location = "/dashboard" */
    /* const bg1 = { backgroundColor: "rgb(19,20,25)" }
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
    } */
    return (
        <nav className="px-2 unikeNav">
            <div className="d-flex justify-content-between">
                <div className="d-inline-flex justify-content-between align-items-center ">
                    <div className=" d-flex align-items-center he-50px">
                        <img height="40px"
                            src="https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=1,format=auto/https%3A%2F%2F3560466799-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FvdVUvBGUcENGvjpmxl0I%252Ficon%252FsEeQ2Ok9hqgKz7s54DHm%252Flogo.png%3Falt%3Dmedia%26token%3D5aa3fb3c-cf78-4d0c-b397-c31cfd419ab9" alt=""
                            className="mx-2" />
                        <b className="logo-text">Cryptocans</b>
                    </div>
                    <div className="mx-2 d-flex">
                        <Link to="/dashboard" className="link" >
                            <div className="buttonLink" >
                                Dashboard
                            </div>
                        </Link>
                        <Link to="/market" className="link">
                            <div className="buttonLink">
                                Market
                            </div>
                        </Link>
                        <Link className="link" to="/shop">
                            <div className="buttonLink">
                                Shop
                            </div>
                        </Link>
                        <Link className="link" to="/canodromes">
                            <div className="buttonLink">
                                Canodromes
                            </div>
                        </Link>
                        <Link className="link" to="/race">
                            <div className="buttonLink">
                                Play
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="d-flex align-items-center">
                   <div className="mx-2">
                    Next reset: {dayReset&& dayReset} UTC
                   </div>
                    {wallet ?
                        <div className="wallet">
                            <div className="wallet-circle">
                                <img alt="" height="17px" src="https://cryptocans.io/public/static/media/ico-wallet.e442439e75ab448c94c85f336099647e.svg" />
                            </div>
                            <b className="mx-2">
                                {resumeWallet(wallet)}
                            </b>
                        </div>
                        : <button onClick={exectConnect} className="buttonLink btn text-light bg-primary mx-1"> Connect Wallet </button>
                    }

                </div>
            </div>
        </nav>
    )
}
export default Navbar