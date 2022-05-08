import { Link } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import socket from '../../socket';
import passTicket from "../../img/tikets/pass.png"
import { DataContext } from "../../context/DataContext";
import axios from "axios";
import Loader from '../../components/loader/loader'
import lastForWallet from "../../context/services/lastForWallet";
import errorManager from "../../services/errorManager";
import enviroment from "../../env";
const MarketItems = () => {
    const _context = useContext(DataContext)

    const [pass, setPass] = useState([])
    const [passMarket, setPassMarket] = useState([])
    const [confirmModal, setConfirmModal] = useState(false)
    const [passId, setPassId] = useState(false)

    //filters
    const [order, setOrder] = useState(1)
    const [rangoMin, setRangoMin] = useState(1)
    const [rangoMax, setRangoMax] = useState(200)

    useEffect(() => {
        if (pass.length == 0) fetch(enviroment().baseurl + "pass")
        filterPass()
    }, [pass]);

    socket.on('passData', async passData => {
        setPass(passData)
    })

    const filterPass = () => {
        const filteredPass = pass.sort((price1, price2) => orderFunction(price1, price2))
            .filter(p => filterRank(p));
        setPassMarket(filteredPass)
    }

    const filterRank = (pass) => {
        if (pass.amount >= rangoMin && pass.amount <= rangoMax) return pass;
    }

    const orderFunction = (price1, price2) => {
        let orderAux;
        (order == 1) ? orderAux = -1 : orderAux = 1;
        if (price1.price > price2.price) return order;
        if (price1.price < price2.price) return orderAux;
        return 0;
    }




    const buyTicket = async () => {
        _context.setLoading(true)
        setConfirmModal(false)
        const body = {
            wallet: _context.wallet,
            passId
        }
        try {
            const res = await axios.post(enviroment().baseurl + "pass/buy", body)
            console.log(res)
            await _context.exectConnect()
            _context.setLoading(false)
            alert("Yo have a new pass")
        } catch (error) {
            _context.setLoading(false)
            errorManager(error)
            alert(error.response.data.error)
        }
    }

    return (<div>
        {_context.loading && <Loader />}
        {confirmModal && <div className="modalX">
            <div className="modalIn">
                <div className="w-100">
                    Esta seguro de comprar estos tickets
                    <button className="btn btn-primary" onClick={buyTicket}> Confirm </button>
                    <button className="btn btn-danger" onClick={() => setConfirmModal(false)}> Cancel </button>
                </div>
            </div>
        </div>}
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
                                    Order by price: {order == 1 ? "Ask" : "Desc"}
                                </div>
                                <select onChange={e => setOrder(e.target.value)} className="select" name="" id="">
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
                                        <h3 className="breedCount"> min {rangoMin}</h3>
                                    </div>
                                </div>
                                <div>
                                    <input onChange={e => setRangoMin(e.target.value)} min="1" max={rangoMax} className="w-100" type="range" value={rangoMin} name="" id="" />
                                </div>
                                <div>
                                    <h3 className="breedCount"> max {rangoMax}</h3>
                                </div>
                                <div>
                                    <input onChange={e => setRangoMax(e.target.value)} min={rangoMin} max="200" className="w-100" type="range" value={rangoMax} name="" id="" />
                                </div>
                            </div>
                            <div className="mt-3">
                                <button onClick={filterPass} className="w-100 btn btn-primary text-light" type="button" name="" id="" > Find </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-9">
                        <div className="container-fluid">
                            <div className="row">
                                {passMarket.length > 0 && <>
                                    {passMarket.map((item, index) => <div className="col-2" key={index}>
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
                                                <button onClick={() => { setPassId(item._id); setConfirmModal(true) }} className="btn btn-primary w-100"> Buy </button>
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