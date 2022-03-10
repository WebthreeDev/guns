import React, { useState } from "react"
import perro from '../../../img/perro.png'


const Market = () => {


    const [rango, setRango] = useState(0)

    const changeRango = (e) => {
        setRango(e.target.value)
    }

    const dogList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

    return (
        <div>
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
                                Raza
                            </div>
                            <div>
                                <div className="row">
                                    <div className="col-6 textRaza">
                                        <div>
                                            <input type="checkbox" name="" id="" /> Galgo
                                        </div>
                                        <div>
                                            <input type="checkbox" name="" id="" /> Pastor
                                        </div>
                                        <div>
                                            <input type="checkbox" name="" id="" /> Lobo
                                        </div>
                                    </div>
                                    <div className="col-6 textRaza">
                                        <div>
                                            <input type="checkbox" name="" id="" /> Buldog
                                        </div>
                                        <div>
                                            <input type="checkbox" name="" id="" /> Puddle
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
                        <h3> 456 Cans Listed </h3>
                        <div className="row gx-2 gy-2">
                            {dogList.map((item) => {
                                return (
                                    <div key={item} className="col-3 ">
                                        <div className="nftCard pt-2">
                                            <div className="sidebarText px-2"> #{item} </div>
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
                            })}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Market