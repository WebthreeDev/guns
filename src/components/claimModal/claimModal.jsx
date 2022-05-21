import logoCCT from '../../img/assets/icons/logoCCT.png'
import logoCredit from '../../img/assets/icons/credit.png'
const ClaimModal = ({ minimunToClaim, claimPercent, claim, ammountToClaim, _setAmmountToClaim, setClaiming, oracule }) => {
    
    const totalValueToClaim = ()=>{
        const value = Number.parseFloat(((ammountToClaim / oracule) - (((ammountToClaim / oracule) * claimPercent) / 100))).toFixed(2)
        if (!value){
            return 0
        } else{
            return value
        }
    }

    return (

        <div className="bgClaim">
            <div className="modalInClaim">
                <div>
                    <div className=" mb-3 d-flex justify-content-between align-items-center">
                        <div className="textClaim">Claim</div>
                        <div>
                            <div className="w-50 p-2 ">
                                <button className="btn btn-danger btn-sm" onClick={() => { setClaiming(false) }}> X </button>
                            </div>
                        </div>
                    </div>
                    <div className="textClaim"> {oracule} CREDIT = 1 CCT </div>
                    <div className='textClaim2'>
                        Current fee {claimPercent}%
                    </div>

                    <div className="textClaim text-center">
                        {ammountToClaim && ammountToClaim < minimunToClaim &&
                            <i className="text-danger">minimun ammount {minimunToClaim} Credits </i>
                        }
                    </div>
                    <div className='container-fluid p-0 mt-3'>
                        <div className="row gx-0">
                            <div className='col-2'>
                                <img className='logoClaim' src={logoCredit} alt="" />
                            </div>
                            <div className='col-10'>
                                <input onChange={(e) => _setAmmountToClaim(e.target.value)} className="inputClaim" type="number" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 mb-2 text-center">
                        ↑↓
                    </div>
                    <div className='container-fluid p-0'>
                        <div className="row">
                            <div className='col-2'>
                                <img className='logoClaim' src={logoCCT} alt=""  />
                            </div>
                            <div className='col-10'>
                                <div className="inputClaim">
                                    {totalValueToClaim()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-100 d-flex mt-5 px-4">
                        <div className="w-100">
                            {ammountToClaim && ammountToClaim >= minimunToClaim ?
                                <button onClick={claim} className="btn btn-primary w-100"> Claim </button> :
                                <button className="btn btn-secondary w-100" disabled> Claim </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ClaimModal