const ClaimModal = ({ claimPercent,claim, ammountToClaim, setAmmountToClaim, setClaiming,oracule }) => {
    return (
        <div className="modalX">
            <div className="modalIn">
                <div className="loaderWrap">
                    <h1> Claim </h1>
                    <h4> {oracule} Credits = 1 CCT </h4>
                    <i className="text-danger">minimun ammount to claim: 100 Credits </i>
                    {ammountToClaim &&
                        <div className="py-2">
                            {ammountToClaim / oracule} CCT - {claimPercent}% fee = {(Math.round(((ammountToClaim / oracule)-(((ammountToClaim / oracule)*claimPercent)/100))*10000))/10000} CCT
                        </div>
                    }

                    <input onChange={(e) => setAmmountToClaim(e.target.value)} className="form-control mt-2" type="number" />
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