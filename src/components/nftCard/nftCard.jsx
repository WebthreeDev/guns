import { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import commonNft from '../../img/nfts/common.webp'
import rareNft from '../../img/nfts/rare.webp'
import epicNft from '../../img/nfts/epic.webp'
import legendaryNft from '../../img/nfts/legendary.webp'
import '../../css/pages/nftCard.scss';
const NftCard = ({ item, setCan, setModalText, setRenderModal, btnPrice }) => {
    return (
        <div onClick={_ => { setCan(item); setRenderModal(true); setModalText("Confirm!") }} className="nftCard">
            {item.onSale.sale &&
                <div className='onSale'>
                    On sale
                </div>
            }
            <div className="nftCard-header">
                {btnPrice != 0 && (
                    <div className='button-market px-1'>
                        <img src="" alt="" /> {Number.parseFloat(item.onSale.price)} BNB
                    </div>
                )}
                <div className="px-2 lb-color item-id"> #{item.id} </div>
            </div>
                {item.rarity === "1" && <img className='nftCard-img' src={commonNft} alt="" />}
                {item.rarity === "2" && <img className='nftCard-img' src={rareNft} alt="" />}
                {item.rarity === "3" && <img className='nftCard-img' src={epicNft} alt="" />}
                {item.rarity === "4" && <img className='nftCard-img' src={legendaryNft} alt="" />}
    
            <div className="">
                <div className="p-2">
                    <div>
                        <div className='d-flex justify-content-between'>
                            <span>Total stats</span>
                            {item.resistencia + item.aceleracion + item.aerodinamica}
                        </div>
                        <div className='totalStatsCard'>
                            <div className="lb-color nft-name"> {item.name} </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between mt-1">
                        {item.rarity === 1 && <i className="rarity common">Common </i>}
                        {item.rarity === 2 && <i className="rarity rare">Rare </i>}
                        {item.rarity === 3 && <i className="rarity epic">Epic </i>}
                        {item.rarity === 4 && <i className="rarity legendary">Legendary </i>}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default NftCard