import energyLogo from '../../img/energy.png'
import canodrome from '../../img/canodrome.png'
import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../context/DataContext'
import NftCard from '../../components/nftCard/nftCard'
import axios from 'axios'
import Loader from '../../components/loader/loader'
import perro from '../../img/perro.png'

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
            console.log(res.data.response)
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

    const canodromeItems = [0, 1, 2]

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
                        {filteredCans && filteredCans.map((canItem) => {
                            return !canItem.onSale.sale &&
                                <div key={canItem.id} className="col-lg-3 col-md-4 col-sm-6 col-12 p-2">
                                    <NftCard btnPrice={false} setRenderModal={setRenderModal} setModalText={setModalText} setCan={setCan} item={canItem} />
                                </div>
                        })}
                    </div>
                </div>
            </div>}
        {_context.canodromes && _context.canodromes.map((canodromeItem, index) => {
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
                    </div>
                    <div className="col-8 p-1">
                        <div className='row'>
                            <div className='col-12'>
                                <div className="container-fluid">
                                    <div className='row'>
                                        {canodromeItems.map((index) => {
                                            return <div key={index} className="col-4">
                                                {canodromeItem.cans[index] ?
                                                    <div className='cardCanodrome'>
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
                                                    <button className='btnaddcan' onClick={_ => addCan(canodromeItem._id)}>+</button>
                                                }
                                            </div>
                                        })}
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