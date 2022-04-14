import energyLogo from '../../img/energy.png'
import canodrome from '../../img/canodrome.png'
import { useContext, useEffect, useState } from 'react'
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
    const [takedCans, setTakedCans] = useState(false)
    const [filteredCans, setFilteredCans] = useState(false)

    const addCan = async (canodromeId) => {
        let _filteredCans = []
        const taked = await getTakedCans()
        _context.cans.map(item => {
            let suma = 0
            console.log(takedCans)
            taked.map(_item => { if (item.id == _item.can.id) suma++ })
            if (suma == 0) _filteredCans.push(item)
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
            console.log("poner un can en el canodrompo")
            const res = await axios.patch(process.env.REACT_APP_BASEURL + "canodrome/" + selectedCanodrome, body)
            //console.log(res.data.response)
            await _context.getCanodromes(_context.wallet)
            setSelectCans(false)
            getTakedCans()
            _context.setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const getTakedCans = async _ => {
        let _takedCans = []
        if (_context.wallet != false && _context.canodromes != false) {
            console.log("obteniendo taked Cans:")
            console.log(_context.wallet)
            console.log(_context.canodromes)
            _context.canodromes.map((canodrome) => {
                _takedCans = [...canodrome.cans]
            })
            setTakedCans(_takedCans)
        }
        return _takedCans
    }


    const setRenderModal = _ => { }
    const setModalText = _ => { }

    const deleteCan = async (canodromeId, canId) => {
        _context.setLoading(true)
        await axios.delete(baseUrl + "canodrome/" + canodromeId + "/" + canId)
        await _context.getCanodromes(_context.wallet)
        getTakedCans()
        _context.setLoading(false)
    }

    const canodromeItemsCommon = [0, 1, 2]
    const canodromeItemsRare = [0, 1, 2, 3, 4, 5]
    const canodromeItemsEpic = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    const canodromeItemsLegendary = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

    return <div className='container pt-50'>
        {_context.loading && <Loader />}
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
                            {canodromeItem._id}
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
                                                                    {canodromeItem.cans[index].can.energy} / 2
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
                                                                    {canodromeItem.cans[index].can.energy} / 2
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
                                                                    {canodromeItem.cans[index].can.energy} / 2
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
                                                                    {canodromeItem.cans[index].can.energy} / 2
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