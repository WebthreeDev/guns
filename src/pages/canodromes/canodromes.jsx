import energyLogo from '../../img/energy.png'
import canodrome from '../../img/canodrome.png'
import { useContext, useEffect } from 'react'
import { DataContext } from '../../context/DataContext'
const Canodromes = () => {
    const _context = useContext(DataContext)

    useEffect(_ => {
        console.log(_context.canodromes)
    }, [_context.canodromes])

    const addCan = (id,item)=>{
        alert(id)
        console.log(item)
    }

    return <div className='container pt-50'>
        {_context.canodromes && _context.canodromes.map(item => {
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
                                        {item.cans[0]? 
                                        <div> perro : {item.cans[0].id} </div>
                                        :
                                            <button onClick={()=>addCan(1,item)} className='btn-add-can'> + </button>
                                        }
                                        <button onClick={()=>addCan(2,item)} className='btn-add-can'> + </button>
                                        <button onClick={()=>addCan(3,item)} className='btn-add-can'> + </button>
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