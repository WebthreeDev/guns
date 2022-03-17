import React, { useState, useContext } from "react";
import perrito from '../../../img/rundog.gif'
import perroEstatico from '../../../img/perroEstatico.png'
import { DataContext } from "../../../context/DataContext";
import Loader from "../../chunk/loader/loader";
import axios from "axios";

const Race = () => {
    const _context = useContext(DataContext)

    const [corriendo, setCorriendo] = useState(false)
    const [wRace, setWrace] = useState("wRace2")
    const [pop, setPop] = useState(false)
    const [selected, setSelected] = useState(false)
    const [dog, setDog] = useState([])

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

    const selectDog = async (item) => {
        setDog(item)
        setSelected(true)
    }

    const clickRun = (id,wallet) =>{
        //inicioCarrera
        const body = {id,wallet }
        axios.post("https://cryptocans.io/api/v1/race",body).then((res)=>{
            const places = res.data.response
            let place
            places.forEach((dog,i) => {
                if(dog == 1) place = i+1
            })

            let er
            if(place === 1 || place === 3) er="er"
            if(place === 2) er="do"
            if(place  >  3) er="to"
            
            alert("Llegaste de "+place+er+" lugar")
            //console.log(places)
        }).catch(_=> console.log(_))
    }

    return (
        <div className="container p-2">
            {_context.loading && <Loader />}
            {pop &&
                <div className="racePop">
                    <button className="btn btn-danger" onClick={() => setPop(false)}> Cerrar </button>
                    <div className="border bg-dark m-3 p-3 carrera">
                        {!selected ?
                            <div>
                                <h2> Elija su can para competir </h2>
                                {_context.cans && _context.cans.map((item) =>
                                    (<button key={item.id} onClick={_ => selectDog(item)} className="btn btn-primary m-2"> {item.id} {item.name} {item.rarity} </button>)
                                )}
                            </div> :
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
                                                        <button onClick={()=>clickRun(dog.id,_context.wallet)} className="btn btn-danger form-control"> play </button>
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