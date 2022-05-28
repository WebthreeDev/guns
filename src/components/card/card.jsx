import commonNft from '../../img/nfts/common.png'
import rareNft from '../../img/nfts/rare.png'
import epicNft from '../../img/nfts/epic.png'
import legendaryNft from '../../img/nfts/legendary.png'
import { DataContext } from '../../context/DataContext'
import React, { useContext } from 'react'

const Card = ({ can, sale, openCanModal,btnPrice }) => {

    const { rarity } = useContext(DataContext)

    let en = [<>
        <div className="pointEnergyFree"></div>
        <div className="pointEnergyFree"></div>
        <div className="pointEnergyFree"></div>
        <div className="pointEnergyFree"></div>
    </>,
    <>
        <div className="pointEnergy"></div>
        <div className="pointEnergyFree"></div>
        <div className="pointEnergyFree"></div>
        <div className="pointEnergyFree"></div>
    </>,
    <>
        <div className="pointEnergy"></div>
        <div className="pointEnergy"></div>
        <div className="pointEnergyFree"></div>
        <div className="pointEnergyFree"></div>
    </>,
    <>
        <div className="pointEnergy"></div>
        <div className="pointEnergy"></div>
        <div className="pointEnergy"></div>
        <div className="pointEnergyFree"></div>
    </>,
    <>
        <div className="pointEnergy"></div>
        <div className="pointEnergy"></div>
        <div className="pointEnergy"></div>
        <div className="pointEnergy"></div>
    </>]

    const energy = (e) => {
        if (e <= 4) return en[e]
        if (e >= 5) {
            return (<>
                <div className="pointEnergy"></div>
                <div className="pointEnergy"></div>
                <div className="pointEnergy"></div>
                <div className="pointEnergy"></div>
            </>)
        }
    }
    return (<div onClick={_ => openCanModal(can)} className="bgNft">
        <div className='imgSection'>
            {sale && can.onSale.sale && <div className='onSale'>On sale</div>}
            {can.rarity == 1 && <img className='imgNft' src={commonNft} alt="" />}
            {can.rarity == 2 && <img className='imgNft' src={rareNft} alt="" />}
            {can.rarity == 3 && <img className='imgNft' src={epicNft} alt="" />}
            {can.rarity == 4 && <img className='imgNft' src={legendaryNft} alt="" />}
            <div className='stats'>
                <div className='totalStats'>Total stats</div>
                <div className='statsNumber'>{can.resistencia + can.aceleracion + can.aerodinamica}</div>
            </div>
            <div className='rarity'>
                {rarity(can.rarity)}
            </div>
            <div className='nftId'>
                # {can.id}
            </div>
            {btnPrice && <div className='btnPrice'>{Number.parseFloat(can.onSale.price).toFixed(3) }  BNB </div>}
        </div>
        <div className='W-options'>
            <div className='options'>
                <div>
                    {can.name}
                </div>
                <div className="cardEnergy">
                    {energy(can.energy)}
                </div>
            </div>
        </div>
    </div>)
}
export default Card