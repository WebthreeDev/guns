import energyLogo from '../../img/energy.png'
import canodrome from '../../img/canodrome.png'
import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../context/DataContext'
import NftCard from '../../components/nftCard/nftCard'
import axios from 'axios'
import Loader from '../../components/loader/loader'

const Canodromes = () => {
    const _context = useContext(DataContext)
    const [selectCans, setSelectCans] = useState(false)
    const [selectedCanodrome, setSelectedCanodrome] = useState(false)
    const [takedCans, setTakedCans] = useState(false)
    const [filteredCans, setFilteredCans] = useState(false)

    useEffect(() => {
        getTakedCans()
    }, [_context.wallet, _context.canodromes])

    const addCan = async (canodromeId) => {
        console.log(takedCans)
        let _filteredCans = []

        _context.cans.map(item => {
            let suma = 0
            takedCans.map(_item =>{
                if(item.id == _item.can.id){
                    suma++
                }
            })
            if(suma == 0){
                _filteredCans.push(item)
            }
        })

        console.log(_filteredCans)
        setFilteredCans(_filteredCans)
        setSelectedCanodrome(canodromeId) 
        setSelectCans(true) 
        _context.setLoading(false)
    }
    const setCan = async (can) => {
        _context.setLoading(true)
        const body = { can }
        try {
            await axios.patch("https://cryptocans.io/api/v1/canodromes/" + selectedCanodrome, body)
            //console.log(res.data.response)
        } catch (error) {
            console.log(error)
        }
        setSelectCans(false)
        await _context.getCanodromes(_context.wallet)
        getTakedCans()
        _context.setLoading(false)
    }
    const getTakedCans = async _ => {
        if (_context.wallet) {
            if (_context.canodromes) {
                let _takedCans = []
                _context.canodromes.map((canodrome) => {
                    let cans = canodrome.cans
                    _takedCans = [ ..._takedCans, ...cans ]
                })
                //console.log(_takedCans)
                setTakedCans(_takedCans)
            }
        }
    }

    const setRenderModal = _ => { }
    const setModalText = _ => { }

    const deleteCan = async (canodromeId, canId) => {
        _context.setLoading(true)
        const baseUrl = "https://cryptocans.io/api/v1/"
        await axios.delete(baseUrl + "canodromes/" + canodromeId + "/" + canId)
        await _context.getCanodromes(_context.wallet)
        console.log("---------------canodrome: " + canodromeId + " - canId: " + canId)
        getTakedCans()
        _context.setLoading(false)
    }

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
                            return (
                                <div key={canItem.id} className="col-lg-3 col-md-4 col-sm-6 col-12 p-2">
                                    <NftCard setRenderModal={setRenderModal} setModalText={setModalText} setCan={setCan} item={canItem} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>}
        {_context.canodromes && _context.canodromes.map((canodromeItem) => {
            return (
                <div key={canodromeItem._id} className='row border mt-4'>
                    <div>
                        id del canodromo: {canodromeItem._id}
                    </div>
                    <div className='col-4 p-1'>
                        <div className='p-3 '>
                            <div className='text-center'>
                                <h3>Energy</h3>
                            </div>
                            <div className='d-flex justify-content-center'>
                                <img height={"60px"} src={energyLogo} alt="" />
                                <h1 className='energy mx-3'>0 / 6 </h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-8 p-1">
                        <div className='p-3 '>
                            <div className='row'>
                                <div className="col-4  text-center">
                                    <img className='img-fluid' src={canodrome} alt="" />
                                </div>
                                <div className='col-8 '>
                                    <h1 className='text-center'>No cans added</h1>
                                    <div className=' d-flex justify-content-around'>
                                        {canodromeItem.cans[0] ? <>
                                            <div>
                                                can {canodromeItem.cans[0].can.id}
                                            </div>
                                            <div>
                                                <button onClick={_ => deleteCan(canodromeItem._id, canodromeItem.cans[0].can.id)} className='btn btn-danger'>
                                                    Remove Can
                                                </button>

                                            </div>
                                        </> : <>
                                            <button onClick={_ => addCan(canodromeItem._id)}>
                                                + 0
                                            </button>
                                        </>}
                                        {canodromeItem.cans[1] ? <>
                                            <div>
                                                can {canodromeItem.cans[1].can.id}
                                            </div>
                                            <div>
                                                <button onClick={_ => deleteCan(canodromeItem._id, canodromeItem.cans[1].can.id)} className='btn btn-danger'>
                                                    Remove Can
                                                </button>

                                            </div>
                                        </> : <>
                                            <button onClick={_ => addCan(canodromeItem._id)}>
                                                + 1
                                            </button>
                                        </>}

                                        {canodromeItem.cans[2] ? <>
                                            <div>
                                                can {canodromeItem.cans[2].can.id}
                                            </div>
                                            <div>
                                                <button onClick={_ => deleteCan(canodromeItem._id, canodromeItem.cans[2].can.id)} className='btn btn-danger'>
                                                    Remove Can
                                                </button>

                                            </div>
                                        </> : <>
                                            <button onClick={_ => addCan(canodromeItem._id)}>
                                                + 2
                                            </button>
                                        </>}




                                        {/*  {canodromeItem.cans.length <= 0 ? <>
                                            
                                            <button onClick={_ => addCan(canodromeItem._id) }>
                                                + 2
                                            </button>
                                            <button onClick={_ => addCan(canodromeItem._id) }>
                                                + 3
                                            </button>
                                        </> : 
                                        <div className='border p-2'>
                                                can
                                        </div>} */}
                                        {/* <div className='border p-2'>
                                             {canodromeItem.cans[id].can.id} 
                                            <button onClick={_ => deleteCan(canodromeItem._id)} className='btn btn-danger'>
                                                Remove Can
                                            </button>
                                        </div> */}





                                        {/* {addCansButtons.map(id => {
                                            return (
                                                <div key={id}>
                                                    {canodromeItem.cans[id] ?
                                                        <div className='border p-2'>
                                                            {canodromeItem.cans[id].can.id} <button onClick={() => { deleteCan(canodromeItem._id, canodromeItem.cans[id].id) }} className='btn btn-danger'> Remove Can </button>
                                                        </div>
                                                        :
                                                        <button onClick={() => { addCan(id, canodromeItem); setSelectedCanodrome(canodromeItem._id) }}>
                                                            + {id}
                                                        </button>
                                                    }
                                                </div>
                                            )
                                        })} */}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)
        })}

    </ div>
}
export default Canodromes