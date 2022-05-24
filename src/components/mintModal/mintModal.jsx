import React from "react";

import commonNft from '../../img/nfts/common.png'
import rareNft from '../../img/nfts/rare.png'
import epicNft from '../../img/nfts/epic.png'
import legendaryNft from '../../img/nfts/legendary.png'

const rarity = (r) => {
    const rarityObj = {
        1: <div className='rarityText'>Common</div>,
        2: <div className='rarityText'>Rare</div>,
        3: <div className='rarityText'>Epic</div>,
        4: <div className='rarityText'>Legendary</div>
    }
    return rarityObj[r]
}

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

        <div className='modalX'>
            <div className='canModalIn'>
                <div className="container-fluid">
                    <div className="row gx-2">
                        <div className="col-6">
                            <div className='canPhoto'>

                                <div className='stats'>
                                    <div className='totalStats'>Total stats</div>
                                    <div className='statsNumber'>{canMinted.resistencia + canMinted.aceleracion + canMinted.aerodinamica}</div>
                                </div>
                                <div className='rarity'>
                                    {rarity(canMinted.rarity)}
                                </div>
                                <div className='nftId'>
                                    # {canMinted.id}
                                </div>
                                {canMinted.rarity == 1 && <img className='imgNft' src={commonNft} alt="" />}
                                {canMinted.rarity == 2 && <img className='imgNft' src={rareNft} alt="" />}
                                {canMinted.rarity == 3 && <img className='imgNft' src={epicNft} alt="" />}
                                {canMinted.rarity == 4 && <img className='imgNft' src={legendaryNft} alt="" />}

                            </div>
                            <div className='options'>
                                {canMinted.name}
                            </div>
                        </div>
                        <div className="col-6">
                            <div className='canInfo'>
                                <div className='w-energy'>
                                    <div className='energy'>
                                        <div>
                                            Energy:
                                        </div>
                                        <div>
                                            {canMinted && canMinted.energy}/4
                                        </div>
                                    </div>
                                    <div>
                                        <progress value={canMinted.energy - 1} min="0" max="4" className='progressEnergy'> </progress>
                                    </div>
                                </div>
                                <div className='energy mt-3'>
                                    <div>Aerodinamic:</div>
                                    <div>{canMinted && canMinted.aerodinamica}</div>
                                </div>
                                <div className='energy mt-3'>
                                    <div>Aceleration:</div>
                                    <div>{canMinted && canMinted.aceleracion}</div>
                                </div>
                                <div className='energy mt-3'>
                                    <div>Resistence:</div>
                                    <div>{canMinted && canMinted.resistencia}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 p-1">
                            <div className='selectedCanHeading'>
                                <button className='btn btn-primary btnModal' onClick={_ => _continue()}> Continue </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        // <div className="modalX">
        //     <div className="container">
        //         <div className="row">
        //             <div className="col-4"></div>
        //             <div className="col-4">
        //                 <NftCard
        //                     setRenderModal={setRenderModal}
        //                     setModalText={setModalText}
        //                     setCan={setCan}
        //                     item={canMinted}
        //                     btnPrice={false}
        //                 />
        //             <button onClick={_ => _continue()} className="btn btn-primary form-control mt-3"> Continue </button>
        //             </div>
        //             <div className="col-4"></div>
        //         </div>
        //     </div>
        // </div>
    )
}
export default MintModal