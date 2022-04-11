const ClaimModal = ({ claim, ammountToClaim, setAmmountToClaim, setClaiming }) => {
    const change = 50
    return (
        <div className="modalX">
            <div className="modalIn">
                <div className="loaderWrap">
                    <h1> Claim </h1>
                    <h4> {change} Credits = 1 CCT </h4>
                    <i className="text-danger">minimun ammount to claim: 100 Credits </i>
                    {ammountToClaim &&
                        <div className="py-2">
                            {ammountToClaim / change} CCT
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