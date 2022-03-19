import axios from "axios"
import React, { useEffect, useState,useContext } from "react"
import perro from '../../../img/perro.png'
import Modal from "../../chunk/modal/modal"
import { DataContext } from "../../../context/DataContext"

const Market = () => {
    const _context = useContext(DataContext)
    const [rango, setRango] = useState(0)
    const [dogList, setdogList] = useState(false)

    const [renderModal,setRenderModal] = useState(false)
    const [modalText,setModalText] =useState(false)

    useEffect(() => {
        getCansOnSell()
    }, [])

    const changeRango = (e) => {
        setRango(e.target.value)
    }

    const getCansOnSell = async () => {
        const cansOnSell = await axios.get('https://cryptocans.io/api/v1/market?limit=10&page=1')
        console.log(cansOnSell.data.response)
        setdogList(cansOnSell.data.response)
    }

    const modalRenderer = (text)=>{
        setModalText(text)
        setRenderModal(true)
    }

    return (
        <div> 
           {renderModal && <Modal text={modalText} setRenderModal={setRenderModal}/>} 
            <div className="secondNav">
                <button className="secondNavButton active">
                    Dogs
                </button>
                <button className="secondNavButton">
                    Canodromes
                </button>
                <button className="secondNavButton">
                    Items
                </button>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-2 sidebar">
                        <div className="d-flex justify-content-between align-items-center">
                            <b>Filter</b>
                            <button className="btn btn-primary btn-sm" href="">Clear filter</button>
                        </div>
                        <div className="mt-3">
                            <div className="sidebarText mb-1">
                                Order
                            </div>
                            <select className="select" name="" id="">
                                <option className="optionFilter" value="">Price ASC</option>
                                <option className="optionFilter" value="">Price DESC</option>
                            </select>
                        </div>
                        <div className="mt-3">
                            <div className="sidebarText mb-1">
                                Rarity
                            </div>
                            <div>
                                <div className="row">
                                    <div className="col-6 textRaza">
                                        <div>
                                            <input type="checkbox" name="" id="" /> Common
                                        </div>
                                        <div>
                                            <input type="checkbox" name="" id="" /> Rare
                                        </div>
                                    </div>
                                    <div className="col-6 textRaza">
                                        <div>
                                            <input type="checkbox" name="" id="" /> Épic
                                        </div>
                                        <div>
                                            <input type="checkbox" name="" id="" /> Legendary
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className=" mb-1 d-flex align-items-center justify-content-between">
                                <div className="sidebarText">
                                    Breeds
                                </div>
                                <div>
                                    <h3 className="breedCount">{rango}</h3>
                                </div>
                            </div>
                            <div>
                                <input onChange={changeRango} className="w-100" type="range" value={rango} name="" id="" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <button className="w-100 btn btn-primary text-light" type="button" name="" id="" > Find </button>
                        </div>
                    </div>
                    <div className="col-10 listItems">
                        <h3> {dogList&& dogList.lenght} Cans Listed </h3>
                        <div className="row gx-2 gy-2">
                            {dogList ?
                                dogList.map((item) => {
                                    return (
                                        <div key={item.id} className="col-3">
                                            <div onClick={_=>modalRenderer("Esta seguro de comprar "+item.name)} className="nftCard pt-2">
                                                <div className="sidebarText px-2"> #{item.id} </div>
                                                <div className="text-center">
                                                    <img height="100px" src={perro} alt="" />
                                                </div>
                                                <div className="mt-2">
                                                    <div className="text-light p-2 nftFeatures">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <h4 className="nftName"> Firulais </h4>
                                                            <div>0 / 7</div>
                                                        </div>
                                                        <div className="d-flex justify-content-between mt-1">
                                                            <div className="raza">
                                                                Buldog
                                                            </div>
                                                            <i className="rarity">Uncommon </i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : <div className="text-center"><hr/> No cans Listed </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Market