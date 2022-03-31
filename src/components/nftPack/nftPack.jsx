import React, { useContext, useState } from "react";
import sobre1 from "../../img/perro.png"
import common from "../../img/common.png"
import { DataContext } from "../../context/DataContext";
const NftPack = () => {
    const { wallet, loading, connect } = useContext(DataContext)
    const [myStyle, setStyle] = useState({ transform: "" })
    const motionMatchMedia = window.matchMedia("(prefers-reduced-motion)");
    const THRESHOLD = 150;
    function handleHover(e) {
        const { clientX, clientY, currentTarget } = e;
        const { clientWidth, clientHeight, offsetLeft, offsetTop } = currentTarget;

        const horizontal = (clientX - offsetLeft) / clientWidth;
        const vertical = (clientY - offsetTop) / clientHeight;
        const rotateX = (THRESHOLD / 20 - horizontal * THRESHOLD).toFixed(20);
        const rotateY = (vertical * THRESHOLD - THRESHOLD / 20).toFixed(20);

        let transformStyle = `perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1, 1, 1)`;
        setStyle({ transform: transformStyle });
    }
    function resetStyles(e) {
        let transformStyle = `perspective(${e.currentTarget.clientWidth}px) rotateX(0deg) rotateY(0deg)`;
        setStyle({ transform: transformStyle });
    }
    const handlemove = (e) => { if (!motionMatchMedia.matches) handleHover(e) }
    const handleleave = (e) => { if (!motionMatchMedia.matches) resetStyles(e) }
    return (
        <div className="">
            <div className="nftBorder animated"
                onMouseMove={(e) => handlemove(e)}
                onMouseLeave={(e) => handleleave(e)}
                style={myStyle}>
                <div className="nftBg">
                    <div className="d-flex justify-content-between">
                        <div className="text-warning">
                            <div className="d-flex align-items-center">
                                <div>
                                    <img height="24px" src="https://upload.wikimedia.org/wikipedia/commons/f/fc/Binance-coin-bnb-logo.png" alt="" />
                                </div>
                                <div className="text-warning">
                                    <b className="mx-1">
                                        {/* commonPackagePrice */}1 BNB
                                    </b>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            {loading ? <div className="border p-1 text-center">Loading</div> : <>
                                {wallet ?
                                    <button /* onClick={() => buyPackage("1", wallet, commonPackagePrice)} */ className="btn-ccan w-100"> MINT </button>
                                    :
                                    <button onClick={connect} className="btn-ccan"> Connect </button>}
                            </>}
                            <div className="minted-text">
                                Minted 0 / 1000
                            </div>
                        </div>
                    </div>
                    <div className="d-flex">
                        <div className="commonText">
                            <img className="commonImg" src={common} alt="" />
                        </div>
                        <div className="">
                            <img height={"260px"} src={sobre1} alt="" />
                            {/* <Package img={sobre1} /> */}
                            {/* <img className="imgNft1" src={sobre1} alt="" /> */}
                            <div className="d-flex p-2 justify-content-center">
                                <div className="p-2 ">
                                    <div>Common</div>
                                    <div> <h5> 60%</h5> </div>
                                    <div>Epic</div>
                                    <div> <h5>0.9%</h5>  </div>
                                </div>
                                <div className="p-2 ">
                                    <div>Rare</div>
                                    <div> <h5>30%</h5>  </div>
                                    <div>Legendary</div>
                                    <div> <h5>0.1%</h5> </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default NftPack