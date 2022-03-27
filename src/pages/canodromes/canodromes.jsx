import energyLogo from '../../img/energy.png'
import canodrome from '../../img/canodrome.png'
const Canodromes = () => {
    return <div className='container  py-4'>
        <div className='row'>
            <div className='col-4 p-1'>
                <div className='p-3 '>
                    <div className='text-center'>
                        <h3>Energy</h3>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <img height={"60px"} src={energyLogo} alt="" />
                        <h1 className='energy mx-3'> 6 </h1>
                    </div>
                </div>
            </div>
            <div className="col-8 p-1">
                <div className='p-3 border'>
                    <div className='row'>
                        <div className="col-4  text-center">
                            <img className='img-fluid' src={canodrome} alt="" />
                        </div>
                        <div className='col-8 '>
                            <h1 className='text-center'>No cans added</h1>
                            <div className=' d-flex justify-content-around'>
                                <button className='btn-add-can'> + </button>
                                <button className='btn-add-can'> + </button>
                                <button className='btn-add-can'> + </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ div>
}
export default Canodromes