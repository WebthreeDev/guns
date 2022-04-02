import energyLogo from '../../img/energy.png'
import canodrome from '../../img/canodrome.png'
import { useContext, useState } from 'react'
import { DataContext } from '../../context/DataContext'
import NftCard from '../../components/nftCard/nftCard'
import axios from 'axios'
import Loader from '../../components/loader/loader'

const Canodromes = () => {
    const _context = useContext(DataContext)
    const [selectCans, setSelectCans] = useState(false)
    const [selectedCanodrome, setSelectedCanodrome] = useState(false)
    const addCansButtons = [0, 1, 2]

    const addCan = (id, item) => {
        setSelectCans(true)
        setSelectedCanodrome(item)
        console.log(selectedCanodrome)
        console.log(_context.canodromes)
    }
    const setCan = async can => {
       
        const body = JSON.stringify(can)
        console.log(process.env.REACT_APP_BASEURL)
        const res = await axios.patch("https://cryptocans.io/api/v1/canodromes/" + selectedCanodrome._id, body)
        console.log(res.data.response)
        setSelectCans(false)
        _context.getCanodromes(_context.wallet)

    }
    const setRenderModal = _ => { }
    const setModalText = _ => { }


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
                        {_context.cans && _context.cans.map((item) => {
                            return (
                                <div key={item.id} className="col-lg-3 col-md-4 col-sm-6 col-12 p-2">
                                    <NftCard setRenderModal={setRenderModal} setModalText={setModalText} setCan={setCan} item={item} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>}
        {_context.canodromes && _context.canodromes.map((item, index) => {
            return (
                <div key={item._id} className='row border mt-4'>
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
                                        {addCansButtons.map(id => {
                                            return (
                                                <div key={id}>
                                                    {item.cans[id]? 
                                                    <> {item.cans[id].can.id} </>:
                                                    <button onClick={()=>{ addCan(id,item);setSelectedCanodrome(item._id) }}>  + {id} </button>
                                                }
                                                </div>
                                            )
                                        })}
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