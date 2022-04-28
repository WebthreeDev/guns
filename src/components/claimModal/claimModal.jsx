const ClaimModal = ({minimunToClaim, claimPercent, claim, ammountToClaim, _setAmmountToClaim, setClaiming, oracule }) => {
    return (
        <div className="modalX">
            <div className="modalIn">
                <div className="loaderWrap">
                    <h1> Claim </h1>
                    <h4> {oracule} Credits = 1 CCT </h4>
                    {ammountToClaim &&
                        <div className="py-2">
                            {Number.parseFloat(ammountToClaim / oracule).toFixed(2)} CCT - {claimPercent}% fee = {Number.parseFloat(((ammountToClaim / oracule) - (((ammountToClaim / oracule) * claimPercent) / 100))).toFixed(2)} CCT
                        </div>
                    }
                    <div>
                        {ammountToClaim && ammountToClaim < minimunToClaim && 
                        <i className="text-danger">minimun ammount to claim: {minimunToClaim} Credits </i>
                        }
                    </div>
                    <input onChange={(e) => _setAmmountToClaim(e.target.value)} className="form-control mt-2" type="number" />
                    <div className="d-flex justify-content-center mt-3">
                        <button className="btn btn-danger w-50" onClick={() => { setClaiming(false) }}> Cancel </button>
                        {ammountToClaim && ammountToClaim >= minimunToClaim ?
                        <button onClick={claim} className="btn btn-primary w-50"> Claim </button>:
                        <button className="btn btn-secondary" disabled> Claim </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ClaimModal