import React from "react";
import perro from '../../img/perro.png'
import aero from '../../img/aero.png'
const MintModal = ({ canMinted,setMinted,getCans,wallet }) => {
    const _continue = ()=>{
        setMinted(false)
    } 
    return (
        <div className="modalX">
            <div className="modalIn">
                <div className="loaderWrap">
                    <div className="nftSmall">
                        {canMinted.rarity === "1" && <div className='nftRarity common'> Common </div>}
                        {canMinted.rarity === "2" && <div className='nftRarity rare'> Rare </div>}
                        {canMinted.rarity === "3" && <div className='nftRarity epic'> Épic </div>}
                        {canMinted.rarity === "4" && <div className='nftRarity legendary'> Legendary </div>}
                        <b className='text-white'> #{canMinted.id} </b>
                        <div className="nftImg">
                            <img className='imgNft' src={perro} alt="" />
                        </div>
                        <div className='nftName'>
                            {canMinted.name}
                        </div>
                        <div className='nftStats'>
                            <div className="stats">
                                <div className="">
                                    <div className='logoNft'>
                                        <img className='logoImg' src={aero} alt="" />
                                    </div>
                                </div>
                                <div className="">
                                    {canMinted.aerodinamica}
                                </div>
                                <div className="">
                                    <div className='logoNft'> <img className='logoImg' src={aero} alt="" /></div>
                                </div>
                                <div className="">
                                    {canMinted.aceleracion}
                                </div>
                                <div className="">
                                    <div className='logoNft'> <img className='logoImg' src={aero} alt="" /></div>
                                </div>
                                <div className="">
                                    {canMinted.resistencia}
                                </div>
                            </div>
                            <div>
                            </div>
                            <div className="totalStats">
                                <div>
                                    {canMinted.resistencia + canMinted.aceleracion + canMinted.aerodinamica}
                                </div>
                            </div>
                        </div>
                    </div>
                        <button onClick={_=>_continue()} className="btn btn-primary form-control mt-3"> Continue </button>
                </div>
            </div>
        </div>
    )
}
export default MintModal