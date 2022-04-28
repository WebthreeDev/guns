import { Link } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import socket from '../../socket';
import passTicket from "../../img/tikets/pass.png"
import { DataContext } from "../../context/DataContext";
import axios from "axios";
import Loader from '../../components/loader/loader'
import lastForWallet from "../../context/services/lastForWallet";
const MarketItems = () => {
    const _context = useContext(DataContext)

    const [pass, setPass] = useState([])

    useEffect(() => {
        if (pass.length == 0) fetch(process.env.REACT_APP_BASEURL + "pass")
        filterPass()
    }, [pass]);

    socket.on('passData', async passData => {
        setPass(passData)
    })

    const filterPass = () => {

    }

    const buyTicket = async ({ _id }) => {
        _context.setLoading(true)
        const body = {
            wallet: _context.wallet,
            passId: _id
        }
        try {
            const res = await axios.post(process.env.REACT_APP_BASEURL + "pass/buy", body)
            console.log(res)
            await _context.exectConnect()
            _context.setLoading(false)
            alert("Yo have a new pass")
        } catch (error) {
            _context.setLoading(false)
            console.log(error)
        }
    }

    return (<div>
        {_context.loading && <Loader />}
        <div className="container-fluid">
            <div className="secondNav mt-50px mb-3">
                <Link to="/market" className="secondNavButton">
                    <div>
                        Cans
                    </div>
                </Link>
                <Link to="/marketcanodromes" className="secondNavButton">
                    Canodromes
                </Link>
                <Link to="/marketItems" className="secondNavButton active">
                    Items
                </Link>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-3 sidebarx">
                        <div className="sidebar-bg">
                            <div className="d-flex justify-content-between align-items-center">
                                <b>Filter</b>
                                <button className="btn btn-primary btn-sm" href="">Clear filter</button>
                            </div>
                            <div className="mt-3">
                                <div className="sidebarText mb-1">
                                    Order by price: 1
                                </div>
                                <select className="select" name="" id="">
                                    <option className="optionFilter" value={1}>Price Ask</option>
                                    <option className="optionFilter" value={-1}>Price Desk</option>
                                </select>
                            </div>

                            <div className="mt-3">
                                <div className=" mb-1 d-flex align-items-center justify-content-between">
                                    <div className="sidebarText">
                                        Ammount
                                    </div>
                                    <div>
                                        <h3 className="breedCount"> min</h3>
                                    </div>
                                </div>
                                <div>
                                    <input min="200" className="w-100" type="range" name="" id="" />
                                </div>
                                <div>
                                    <h3 className="breedCount"> max </h3>
                                </div>
                                <div>
                                    <input max="360" className="w-100" type="range" name="" id="" />
                                </div>
                            </div>
                            <div className="mt-3">
                                <button className="w-100 btn btn-primary text-light" type="button" name="" id="" > Find </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-9">
                        <div className="container-fluid">
                            <div className="row">
                                {pass.length > 0 && <>
                                    {pass.map((item, index) => <div className="col-2" key={index}>
                                        <div className="pass mb-2">
                                            <div className="w-100 p-2">
                                                <div className="wall">
                                                    {lastForWallet(item.wallet)}
                                                </div>
                                                <div>
                                                    <img className="img-fluid" src={passTicket} alt="" />
                                                </div>
                                                <div>
                                                    <div>
                                                        Amount: {item.amount}
                                                    </div>
                                                    <div className="text-warning">
                                                        {item.price} Credits
                                                    </div>
                                                </div>
                                                <button onClick={() => buyTicket(item)} className="btn btn-primary w-100"> Buy </button>
                                            </div>
                                        </div>
                                    </div>)
                                    }
                                </>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>)
}
export default MarketItems