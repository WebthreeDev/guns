import React, {  useState } from "react";
import perrito from '../../../img/rundog.gif'
import perroEstatico from '../../../img/perroEstatico.png'
const Race = () => { 

    const [corriendo, setCorriendo] = useState(false)

    const [ wRace,setWrace] = useState("wRace2")

    const inicioCarrera = () => {
        setWrace("wRace")
        setCorriendo(true)
        setTimeout(() => {
            console.log("Termino")
            setCorriendo(false)
        }, 20000)
    }

    return (
        <div className="container p-2">

            <div className={wRace}>
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
            </div>

            <button onClick={() => { inicioCarrera() }}> Iniciar carrera </button>
            <div className="row text-center">
                <div className="col-4">
                    <div className="race">
                        Single Race
                    </div>
                </div>
                <div className="col-4">
                    <div className="race">
                        Rank
                    </div>
                </div>
                <div className="col-4">
                    <div className="race">
                        Stake
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Race