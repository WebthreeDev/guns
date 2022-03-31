import perro from '../../img/perro.png'
import { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
const NftCard = ({ item, setCan, setModalText, setRenderModal }) => {
    const _context = useContext(DataContext)
    return (
            <div onClick={_ => { setCan(item); setRenderModal(true); setModalText("Confirm!") }} className="nftCard">

                <div className="d-flex justify-content-between">
                    <div className='border px-1'>  
                        <img src="" alt="" /> {item.onSale.price} BNB
                    </div>
                    <div className="sidebarText px-2"> #{item.id} - {item.status} </div>
                </div>
                <div>
                    <div className="px-2 sidebarText">{_context.lastForWallet(item.wallet)}</div>
                </div>
                <div className="text-center">
                    <img height="100px" src={perro} alt="" />
                </div>
                <div className="mt-2">
                    <div className="text-light p-2 ">
                        <div className="">
                            <div className="marketName"> {item.name} </div>
                        </div>
                        <div>
                        <div className='d-flex justify-content-between align-items-center'>
                                <div>
                                    Acceleration
                                    <progress min={"0"} value={item.aceleracion} max={"300"} name="" id="" />
                                </div>
                                <div className='totalStats'> {item.aceleracion} </div>
                            </div>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div>Aerodinamic 
                                <div> <progress min={"0"} value={item.aerodinamica} max={"300"} name="" id="" /> </div>

                                </div>
                                <div className='totalStats'> {item.aerodinamica} </div>
                            </div>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div>Resistence
                                <div> <progress min={"0"} value={item.resistencia} max={"300"} name="" id="" /> </div>

                                </div>
                                <div className='totalStats'> {item.resistencia} </div>
                            </div>
                           
                        </div>
                        <div className="d-flex justify-content-between mt-1">
                            {item.rarity === "1" && <i className="w-100 text-center common">Common </i>}
                            {item.rarity === "2" && <i className="w-100 text-center rare">Rare </i>}
                            {item.rarity === "3" && <i className="w-100 text-center epic">Epic </i>}
                            {item.rarity === "4" && <i className="w-100 text-center legendary">Legendary </i>}
                        </div>
                    </div>
                </div>
            </div>
       )
}
export default NftCard