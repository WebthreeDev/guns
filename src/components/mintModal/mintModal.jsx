import React from "react";
import NftCard from "../nftCard/nftCard";

const MintModal = ({ canMinted, setMinted }) => {
    const _continue = () => {
        setMinted(false)
    }

    const setRenderModal = () => { }
    const setModalText = () => { }
    const setCan = () => {
        setMinted(false)
    }
    return (
        <div className="modalX">
            <div className="container">
                <div className="row">
                    <div className="col-4"></div>
                    <div className="col-4">
                        <NftCard
                            setRenderModal={setRenderModal}
                            setModalText={setModalText}
                            setCan={setCan}
                            item={canMinted}
                            btnPrice={false}
                        />
                    <button onClick={_ => _continue()} className="btn btn-primary form-control mt-3"> Continue </button>
                    </div>
                    <div className="col-4"></div>
                </div>
            </div>
        </div>
    )
}
export default MintModal