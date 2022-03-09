import React from "react";
import sobre1 from "../../../img/sobre.png"
import sobre2 from "../../../img/sobre2.png"
import sobre3 from "../../../img/sobre3.png"
import { buyCommonPackage, buyEpicPackage, buyLegendaryPackage } from "./shopService";
const Shop = () => {

    return (
        <div className="bg-dogs">
            <div className="container py-5 ">
                <div className="neon">
                    <div className="w-100 marco">
                        <div className=" w-100">
                            <div className="row text-center">
                                <div className="col-4">
                                    <img className="nft-img" height={"300px"} src={sobre1} alt="" />
                                    <button onClick={_ => buyCommonPackage()} className="btn-ccan mt-4 w-50"> BUY </button>
                                </div>
                                <div className="col-4">
                                    <img className="nft-img" height={"300px"} src={sobre2} alt="" />
                                    <button onClick={_ => buyEpicPackage()} className="btn-ccan mt-4 w-50"> BUY </button>
                                </div>
                                <div className="col-4">
                                    <img className="nft-img" height={"300px"} src={sobre3} alt="" />
                                    <button onClick={_ => buyLegendaryPackage()} className="btn-ccan mt-4 w-50"> BUY </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Shop