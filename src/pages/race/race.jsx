import React, { useState, useContext } from "react";
import perrito from '../../img/rundog.gif'
import { DataContext } from "../../context/DataContext";
import Loader from "../../components/loader/loader";
import axios from "axios";
import NftCard from "../../components/nftCard/nftCard";
const Race = () => {
    const _context = useContext(DataContext)

    const [corriendo, setCorriendo] = useState(false)
    const [wRace, setWrace] = useState("wRace2")
    const [pop, setPop] = useState(false)
    const [selected, setSelected] = useState(false)
    const [dog, setDog] = useState([])
    const [canodromeId, setCanodromeId] = useState(false)

    const inicioCarrera = () => {
        setWrace("wRace")
        setCorriendo(true)
        setTimeout(() => {
            // console.log("Termino")
            setCorriendo(false)
        }, 20000)
    }

    const racePopUp = async (index) => {
        if (_context.wallet) {
            setPop(true)
        } else {
            _context.connect()
        }
    }

    const selectDog = async (item, _canodromeId) => {
        setCanodromeId(_canodromeId)
        setDog(item)
        setSelected(true)
    }

    const clickRun = async (canId, canodromeId) => {
        const body = { canId,wallet:_context.wallet,canodromeId } 
        try {
            const res = await axios.post("https://cryptocans.io/api/v1/race",body) 
            const _places = res.data.response.places
            let place = _places.indexOf(1) + 1
            let er
            if (place === 1 || place === 3) er = "er"
            if (place === 2) er = "do"
            if (place > 3) er = "to"
            alert("Llegaste de " + place + er + " lugar")
            setSelected(false)

        } catch (error) {alert(error.response.data.error)}

    }


    const setRenderModal = _ => { }
    const setModalText = _ => { }
    const setCan = _ => { }
    return (
        <div className="container p-2">
            {_context.loading && <Loader />}
            {pop &&
                <div className="cansSelection">
                    <div className="selectTittle">
                        <div className="tittle">
                            Select cans
                        </div>
                        <div>
                            <button onClick={() => { setPop(false); setSelected(false) }}> X </button>
                        </div>
                    </div>
                    <div className="container-fluid px-5 containerSelectCans">
                        <div className="row gx-4 px-5">
                            {_context.canodromes && _context.canodromes.map((item, index) => {
                                return (
                                    <div key={index} className="col-12 p-4 border mb-2 bg-primary">
                                        Canodrome #{index} - Energy: {item.energy} - {item.rarity}
                                        <h2>Elija un can para correr</h2>
                                        <div className="container-fluid">
                                            <div className="row">
                                                {!selected ?
                                                    item.cans && item.cans.map((_item, i) => {
                                                        return (
                                                            <div key={i} onClick={_ => selectDog(_item.can, item._id)} className="col-4 p-2">
                                                                <NftCard
                                                                    setRenderModal={setRenderModal}
                                                                    setModalText={setModalText}
                                                                    setCan={setCan}
                                                                    item={_item.can}
                                                                    btnPrice={false}
                                                                />

                                                            </div>
                                                        )
                                                    }
                                                    )
                                                    :
                                                    
                                                    <div>
                                                        <div>
                                                            {dog && <>
                                                                <div className="border">
                                                                    <div className="container-flid">
                                                                        <div className="row">
                                                                            <div className="col-4">
                                                                                <div className="p-2">
                                                                                    Nombre: {dog.name} <hr />
                                                                                    Id: {dog.id} <hr />
                                                                                    Aceleracion: {dog.aceleracion} <hr />
                                                                                    Aerodinamica: {dog.aerodinamica} <hr />
                                                                                    Resistencia: {dog.resistencia} <hr />
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-8">
                                                                                <div className="border carreraFondo">
                                                                                    <div className="pista">
                                                                                        <img height="40px" src={perrito} alt="" />
                                                                                    </div>
                                                                                    <div className="pista">
                                                                                        <img height="40px" src={perrito} alt="" />
                                                                                    </div>
                                                                                    <div className="pista">
                                                                                        <img height="40px" src={perrito} alt="" />
                                                                                    </div>
                                                                                    <div className="pista">
                                                                                        <img height="40px" src={perrito} alt="" />
                                                                                    </div>
                                                                                    <div className="pista">
                                                                                        <img height="40px" src={perrito} alt="" />
                                                                                    </div>
                                                                                    <div className="pista">
                                                                                        <img height="40px" src={perrito} alt="" />
                                                                                    </div>
                                                                                </div>
                                                                                <button onClick={() => clickRun(dog.id, item._id)} className="btn btn-danger form-control"> play </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>}
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                    </div>
                </div>
            }

            {/*  <div className={wRace}>
                {corriendo ?
                    <img src={perrito} alt="" className="corriendo2"></img>
                    : <img src={perroEstatico} alt="" className="parado" ></img>
                }
            </div>
            <div className={wRace}>
                {corriendo ?
                    <img src={perrito} alt="" className={"corriendo"}></img>
                    : <img src={perroEstatico} alt="" className="parado" ></img>
                }
            </div> */}

            {/* <button onClick={() => { inicioCarrera() }}> Iniciar carrera </button> */}
            <div className="row text-center">
                <div className="col-4">
                    <div onClick={_ => racePopUp(1)} className="race">
                        Single Race
                    </div>
                </div>
                <div className="col-4">
                    <div className="race2">
                        Rank
                    </div>
                </div>
                <div className="col-4">
                    <div className="race2">
                        Stake
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Race

/* .then((res) => {
            const _places = res.data.response.places
            console.log(res.data.response)
            let place = _places.indexOf(1) + 1
            let er
            if (place === 1 || place === 3) er = "er"
            if (place === 2) er = "do"
            if (place > 3) er = "to"

            alert("Llegaste de " + place + er + " lugar")
            setSelected(false)
            //console.log(places)
        }).catch(_ => console.log(_)) */

        //alert("preparado para correr: " + id + " - " + wallet + " - " + canodromeId)
        //inicioCarrera
/* const _body = { canId:canId, wallet:wallet, canodromeId:canodromeId }
const body = JSON.stringify(_body) */
/* carrera = {
    "id":8,
    "wallet":"0x20a4dabc7c80c1139ffc84c291af4d80397413da",
    "canodromeId":"6245f31615ab45fd04dc0839"
} */