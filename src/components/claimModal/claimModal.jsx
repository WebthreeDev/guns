const ClaimModal = ({ claimPercent, claim, ammountToClaim, _setAmmountToClaim, setClaiming, oracule }) => {
    return (
        <div className="modalX">
            <div className="modalIn">
                <div className="loaderWrap">
                    <h1> Claim </h1>
                    <h4> {oracule} Credits = 1 CCT </h4>
                    <div>
                        <i className="text-danger">minimun ammount to claim: 100 Credits </i>
                    </div>
                    {ammountToClaim &&
                        <div className="py-2">
                            {Number.parseFloat(ammountToClaim / oracule).toFixed(6)} CCT - {claimPercent}% fee = {Number.parseFloat(((ammountToClaim / oracule) - (((ammountToClaim / oracule) * claimPercent) / 100))).toFixed(6)} CCT
                        </div>
                    }
                    <input onChange={(e) => _setAmmountToClaim(e.target.value)} className="form-control mt-2" type="number" />
                    <div className="d-flex justify-content-center mt-3">
                        <button className="btn btn-danger w-50" onClick={() => { setClaiming(false) }}> Cancel </button>
                        <button onClick={claim} className="btn btn-primary w-50"> Claim </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ClaimModal