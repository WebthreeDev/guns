import energyLogo from '../../img/energy.png'
import canodrome from '../../img/canodrome.png'
import { useContext, useState } from 'react'
import { DataContext } from '../../context/DataContext'
import NftCard from '../../components/nftCard/nftCard'
import axios from 'axios'
import Loader from '../../components/loader/loader'
import perro from '../../img/perro.png'
import { Link } from 'react-router-dom'

const Canodromes = () => {
    const baseUrl = process.env.REACT_APP_BASEURL
    const _context = useContext(DataContext)
    const [selectCans, setSelectCans] = useState(false)
    const [selectedCanodrome, setSelectedCanodrome] = useState(false)
    // const [takedCans, setTakedCans] = useState(false)
    const [filteredCans, setFilteredCans] = useState([])
    const [sellingCanodrome, setSellingCanodrome] = useState(false)
    const [canodromeOnSell, setCanodromeOnSell] = useState(false)
    const [canodromePrice, setCanodromePrice] = useState(false)

    const addCan = async (canodromeId) => {

        let _filteredCans = []
        const canodromesAll = _context.canodromes.map((canodrome) => canodrome.cans);
        const canodromesAllFlat = canodromesAll.flat();
        const arrayCanInCanodromes = canodromesAllFlat.map(can => can.can.id);
        
        _context.cans.map(item => {
            let suma = 0
            arrayCanInCanodromes.map(_item => { if (item.id == _item) suma++ })
            if (suma == 0 && item.onSale.sale == false) _filteredCans.push(item)
        })

        setFilteredCans(_filteredCans)
        setSelectedCanodrome(canodromeId)
        setSelectCans(true)
        _context.setLoading(false)
    }

    const setCan = async (can) => {
        _context.setLoading(true)
        const body = { can }
        try {
            console.log("poner un can en el canodromo")
            const res = await axios.patch(process.env.REACT_APP_BASEURL + "canodrome/" + selectedCanodrome, body)
            //console.log(res.data.response)
            await _context.getCanodromes(_context.wallet)
            setSelectCans(false)
            // getTakedCans()
            _context.setLoading(false)
        } catch (error) {
            _context.setLoading(false)
            if (error.response) {
                console.log("Error Response")
                console.log(error.response.data)
                alert(error.response.data.error)
            } else if (error.request) {
                console.log("Error Request")
                console.log(error.request);
            } else {
                console.log("Error Message")
                console.log('Error', error.message);
            }
        }
    }

    // const getTakedCans = async _ => {
    //     let _takedCans = []
    //     if (_context.wallet != false && _context.canodromes != false) {
    //         console.log("obteniendo taked Cans:")
    //         console.log(_context.wallet)
    //         console.log(_context.canodromes)
    //         _context.canodromes.map((canodrome) => {
    //             _takedCans = [...canodrome.cans]
    //         })
    //         setTakedCans(_takedCans)
    //     }
    //     return _takedCans
    // }


    const setRenderModal = _ => { }
    const setModalText = _ => { }

    const deleteCan = async (canodromeId, canId) => {
        _context.setLoading(true)
        await axios.delete(baseUrl + "canodrome/" + canodromeId + "/" + canId)
        await _context.getCanodromes(_context.wallet)
        // getTakedCans()
        _context.setLoading(false)
    }

    const canodromeItemsCommon = [0, 1, 2]
    const canodromeItemsRare = [0, 1, 2, 3, 4, 5]
    const canodromeItemsEpic = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    const canodromeItemsLegendary = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

    const sellCanodrome = (canodrome) => {
        setCanodromeOnSell(canodrome)
        setSellingCanodrome(true)
        console.log(canodrome)
    }

    const sendSell = async () => {
        const body = {
            "canodrome": {
                "onSale": {
                    "sale": true,
                    "price": canodromePrice
                }
            }
        }
        try {
            console.log("sellin canodrome")
            const res = await axios.patch(process.env.REACT_APP_BASEURL + "canodrome/sell/" + canodromeOnSell._id, body)
            console.log(res.data.response)
            setSellingCanodrome(false)
            _context.getCanodromes(_context.wallet)
        } catch (error) {
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

    const removeCanodrome = async (_id) => {
        try {
            const res = await axios.patch(process.env.REACT_APP_BASEURL + "canodrome/remove/" + _id)
            console.log(res.data.response)
            _context.getCanodromes(_context.wallet)
        } catch (error) {
            console.log(error)
        }
    }

    return <div className='container pt-50'>
        {_context.loading && <Loader />}
        {sellingCanodrome && <div className='modalX'>
            <div className='modalIn'>
                <div>
                    <h1>Selling Canodrome</h1>
                    ID: {canodromeOnSell && canodromeOnSell._id}
                    <div className='text-warning'>
                        {canodromePrice && <>{canodromePrice}BNB</>}
                    </div>
                    <input onChange={(e) => setCanodromePrice(e.target.value)} className='form-control mt-3' type="text" />
                    <button onClick={sendSell} className='btn btn-primary form-control mt-3'>Sell</button>
                    <button onClick={()=>setSellingCanodrome(false)} className='btn btn-danger mt-3'> Cancel </button>
                </div>
            </div>
        </div>}

        {selectCans &&
            <div className='cansSelection'>
                <div className='selectTittle'>
                    <div className='tittle'> Select your can </div>
                    <button onClick={_ => setSelectCans(false)}> X </button>
                </div>
                <div className='container-fluid px-5 containerSelectCans'>
                    <div className="row gx-4 px-5">
                        {filteredCans.length == 0 && <div className='p-5'>
                            <h1>
                                No cans in your dashboard
                            </h1>
                            <Link to='/shop' className='btn btn-primary'> Buy Cans </Link>
                        </div>}
                        {filteredCans && filteredCans.map((canItem) => {
                            return !canItem.onSale.sale &&
                                <div key={canItem.id} className="col-lg-3 col-md-4 col-sm-6 col-12 p-2">
                                    <NftCard btnPrice={false} setRenderModal={setRenderModal} setModalText={setModalText} setCan={setCan} item={canItem} />
                                </div>
                        })}
                    </div>
                </div>
            </div>}
        {_context.canodromes && _context.canodromes.map((canodromeItem) => {
            return (
                <div key={canodromeItem._id} className='row canodromeCard mt-4'>
                    <div className='col-md-4 col-12 text-center p-3 imgCanodromeBg'>
                        <div className='text-center mb-2'>
                          #{canodromeItem.id} - {canodromeItem._id}
                        </div>
                        <div>
                            {canodromeItem.onSale.sale && <>
                                <div className='justify-content-between align-items-center d-flex p-2 w-100 text-center bg-warning text-dark '>
                                    <div className='text-dark'>
                                        On sale
                                    </div>
                                    <button onClick={() => removeCanodrome(canodromeItem._id)} className='btn btn-danger'> Remove </button>
                                </div>
                            </>}
                        </div>
                        <img className='img-fluid' src={canodrome} alt="" />
                        <div className='d-flex justify-content-center align-items-center'>
                            <img height={"20px"} src={energyLogo} className="mx-2" alt="" />
                            <div className='energy'> {canodromeItem.energy} / {_context.converType(canodromeItem.type)} </div>
                        </div>
                        <div>
                            {canodromeItem.type === 1 && <div className="rarity common w-100">Common </div>}
                            {canodromeItem.type === 2 && <div className="rarity rare w-100">Rare </div>}
                            {canodromeItem.type === 3 && <div className="rarity epic w-100">Epic </div>}
                            {canodromeItem.type === 4 && <div className="rarity legendary w-100">Legendary </div>}
                        </div>
                        <div> <button onClick={() => sellCanodrome(canodromeItem)} className='btn btn-danger form-control mt-2'> Sell </button> </div>
                    </div>
                    <div className="col-8 p-1">
                        <div className='row'>
                            <div className='col-12'>
                                <div className="container-fluid">
                                    <div className='row'>
                                        {canodromeItem.type == 1 && <>
                                            {canodromeItemsCommon.map((index) => {
                                                return <div key={index} className="col-4">
                                                    {canodromeItem.cans[index] ?
                                                        <div className='cardCanodrome mb-3'>
                                                            <div className='d-flex justify-content-between'>
                                                                <div>
                                                                    # {canodromeItem.cans[index].can.id}
                                                                </div>
                                                                <div>
                                                                    {canodromeItem.cans[index].can.energy} / 4
                                                                </div>
                                                            </div>
                                                            <div className='text-center'>
                                                                <img height={"60px"} src={perro} alt="" />
                                                            </div>
                                                            <div>
                                                                <button onClick={_ => deleteCan(canodromeItem._id, canodromeItem.cans[0].can.id)} className='btn btn-sm btn-danger form-control'>
                                                                    Remove Can
                                                                </button>
                                                            </div>
                                                        </div>
                                                        :
                                                        <button className='btnaddcan mb-3' onClick={_ => addCan(canodromeItem._id)}> Add Can +</button>
                                                    }
                                                </div>
                                            })}</>}

                                        {canodromeItem.type == 2 && <>
                                            {canodromeItemsRare.map((index) => {
                                                return <div key={index} className="col-4">
                                                    {canodromeItem.cans[index] ?
                                                        <div className='cardCanodrome mb-3'>
                                                            <div className='d-flex justify-content-between'>
                                                                <div>
                                                                    # {canodromeItem.cans[index].can.id}
                                                                </div>
                                                                <div>
                                                                    {canodromeItem.cans[index].can.energy} / 4
                                                                </div>
                                                            </div>
                                                            <div className='text-center'>
                                                                <img height={"60px"} src={perro} alt="" />
                                                            </div>
                                                            <div>
                                                                <button onClick={_ => deleteCan(canodromeItem._id, canodromeItem.cans[0].can.id)} className='btn btn-sm btn-danger form-control'>
                                                                    Remove Can
                                                                </button>
                                                            </div>
                                                        </div>
                                                        :
                                                        <button className='btnaddcan mb-3' onClick={_ => addCan(canodromeItem._id)}> Add Can +</button>
                                                    }
                                                </div>
                                            })}</>}

                                        {canodromeItem.type == 3 && <>
                                            {canodromeItemsEpic.map((index) => {
                                                return <div key={index} className="col-4">
                                                    {canodromeItem.cans[index] ?
                                                        <div className='cardCanodrome mb-3'>
                                                            <div className='d-flex justify-content-between'>
                                                                <div>

                                                                    # {canodromeItem.cans[index].can.id}
                                                                </div>
                                                                <div>
                                                                    {canodromeItem.cans[index].can.energy} / 4
                                                                </div>
                                                            </div>
                                                            <div className='text-center'>
                                                                <img height={"60px"} src={perro} alt="" />
                                                            </div>
                                                            <div>
                                                                <button onClick={_ => deleteCan(canodromeItem._id, canodromeItem.cans[0].can.id)} className='btn btn-sm btn-danger form-control'>
                                                                    Remove Can
                                                                </button>
                                                            </div>
                                                        </div>
                                                        :
                                                        <button className='btnaddcan mb-3' onClick={_ => addCan(canodromeItem._id)}> Add Can +</button>
                                                    }
                                                </div>
                                            })}</>}

                                        {canodromeItem.type == 4 && <>
                                            {canodromeItemsLegendary.map((index) => {
                                                return <div key={index} className="col-4">
                                                    {canodromeItem.cans[index] ?
                                                        <div className='cardCanodrome mb-3'>
                                                            <div className='d-flex justify-content-between'>
                                                                <div>

                                                                    # {canodromeItem.cans[index].can.id}
                                                                </div>
                                                                <div>
                                                                    {canodromeItem.cans[index].can.energy} / 4
                                                                </div>
                                                            </div>
                                                            <div className='text-center'>
                                                                <img height={"60px"} src={perro} alt="" />
                                                            </div>
                                                            <div>
                                                                <button onClick={_ => deleteCan(canodromeItem._id, canodromeItem.cans[0].can.id)} className='btn btn-sm btn-danger form-control'>
                                                                    Remove Can
                                                                </button>
                                                            </div>
                                                        </div>
                                                        :
                                                        <button className='btnaddcan mb-3' onClick={_ => addCan(canodromeItem._id)}> Add Can +</button>
                                                    }
                                                </div>
                                            })}</>}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )
        })}

    </ div>
}
export default Canodromes