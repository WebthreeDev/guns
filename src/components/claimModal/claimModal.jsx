const ClaimModal = ({ claim, ammountToClaim, setAmmountToClaim,setClaiming }) => {
    const change = 50
    return (
        <div className="modalX">
            <div className="modalIn">
                <div>
                    <div>
                        lorem
                    </div>
                    <div >
                        <button onClick={()=>{setClaiming(false)}}> X </button>
                    </div>
                </div>
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
                    <button onClick={claim} className="btn btn-primary w-100 mt-2"> Claim </button>
                </div>
            </div>
        </div>
    )
}
export default ClaimModal