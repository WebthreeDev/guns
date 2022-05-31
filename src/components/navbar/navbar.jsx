import React, { useContext } from "react"
import { DataContext } from '../../context/DataContext'
import walletIcon from '../../img/assets/wallet.svg'

const Navbar = () => {
    const { wallet, resumeWallet, exectConnect } = useContext(DataContext)
    return (
        <nav className="px-2 unikeNav">
            <div className="d-flex align-items-center">
                <img height="40px"
                    src="https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=1,format=auto/https%3A%2F%2F3560466799-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FvdVUvBGUcENGvjpmxl0I%252Ficon%252FsEeQ2Ok9hqgKz7s54DHm%252Flogo.png%3Falt%3Dmedia%26token%3D5aa3fb3c-cf78-4d0c-b397-c31cfd419ab9" alt=""
                    className="mx-2" />
                <div className="logo-text">Cryptocans.io</div>
            </div>
            <div className="d-none d-md-flex align-items-center ">
                {wallet ?
                    <div className="wallet">
                      <img style={{"marginTop":"-2px","marginRight":"4px"}} className="walletIcon" src={walletIcon} alt="" /> {resumeWallet(wallet)}
                    </div>
                    : 
                    <button onClick={exectConnect} className="btnConnect"> <img className="walletIcon" src={walletIcon} alt="" /> Connect Wallet </button>
                }

            </div>
        </nav>
    )
}
export default Navbar



{/* <div className="mx-2 d-flex">
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
                    </div> */}
