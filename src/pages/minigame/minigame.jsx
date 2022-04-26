import { useContext, useEffect, useState } from "react"
import axios from "axios"
import t1 from '../../img/tikets/t1.png'
import t2 from '../../img/tikets/t2.png'
import t3 from '../../img/tikets/t3.png'
import t4 from '../../img/tikets/t4.png'
import v1 from '../../img/tikets/v1.png'
import v2 from '../../img/tikets/v2.png'
import v3 from '../../img/tikets/v3.png'
import v4 from '../../img/tikets/v4.png'
import { DataContext } from "../../context/DataContext"
import w3S from "../../services/w3S"
import service from "./service"

const Minigame = () => {

    const { wallet, tiket, pass, exectConnect } = useContext(DataContext)
    const [codes, setCodes] = useState(false)
    const [tiket1, setTiket1] = useState(false)
    const [tiket2, setTiket2] = useState(false)
    const [tiket3, setTiket3] = useState(false)
    const [tiket4, setTiket4] = useState(false)
    const [modalFinding, setModalFinding] = useState(false)
    const [finding, setFinding] = useState(false)

    useEffect(() => {
        generateCodes()
    }, [])

    const generateCodes = () => {
        let aux = []
        for (let i = 1; i <= 400; i++) {
            aux.push(i)
        }
        setCodes(aux)
    }

    const verify = async () => {
        const account = await w3S.requestAccounts()
        const _wallet = account[0]
        const body = { wallet: _wallet }
        const res = await axios.post(process.env.REACT_APP_BASEURL + "codes/verify", body)
        console.log(res.data.response)
        if (res.data.response == "Add Pass") {
            setTiket1(false)
            setTiket2(false)
            setTiket3(false)
            setTiket4(false)
            alert("Pase conseguido")
            exectConnect(_wallet)
        } else {
            alert("Error al obtener el pase")
        }
    }

    const find = async (item) => {
        const body = { wallet, code: item }
        try {
            const res = await axios.post(process.env.REACT_APP_BASEURL + "codes", body)
            const validate = res.data.response
            if (validate.result) {
                if (validate.key === "a") setTiket1(true)
                if (validate.key === "b") setTiket2(true)
                if (validate.key === "c") setTiket3(true)
                if (validate.key === "d") setTiket4(true)
            } else {
                alert("Mala suerte")
            }
        } catch (error) {
            console.log(error)
        }
        /*  const res = await service.find(i)
         console.log("res:",res) */
        /*  validateArray[res]() */
    }

    const playGame = (item) => {
        if (tiket != false && tiket > 0) {
            setFinding(item)
            setModalFinding(true)
        } else {
            alert("No tienes tikets, compralos en la tienda")
        }
    }

    return (<>
        {modalFinding && <div className="modalX">
            <div className="modalIn">
                <div className="w-100 text-center">
                    <h1>
                        {finding && finding}
                    </h1>
                    <button className="w-100 btn btn-primary" onClick={() => { find(finding); setModalFinding(false) }}> Good Look </button>
                </div>
            </div>
        </div>}
        <div className="pt-5">
            <div className="container-fluid findTiket">
                <div className="text-center pt-3">
                    <h3>
                        find the hidden ticket
                    </h3>
                    <div>
                        Tickets:{tiket && tiket} -
                        Race Pass:{pass && pass}
                    </div>
                </div>
                <div className="row p-3">
                    <div className="col-3">
                        <div className="d-flex">
                            <div className="w-50">
                                {tiket1 ? <img src={v1} className="w-100" alt="" /> : <img src={t1} className="w-100" alt="" />}
                            </div>
                            <div className="w-50">
                                {tiket2 ? <img src={v2} className="w-100" alt="" /> : <img src={t2} className="w-100" alt="" />}
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="w-50">
                                {tiket3 ? <img src={v3} className="w-100" alt="" /> : <img src={t3} className="w-100" alt="" />}
                            </div>
                            <div className="w-50">
                                {tiket4 ? <img src={v4} className="w-100" alt="" /> : <img src={t4} className="w-100" alt="" />}
                            </div>
                        </div>
                        <div>
                            {tiket1 && tiket2 && tiket3 && tiket4 ?
                                <button onClick={() => verify()} className="btn w-100 mt-3 vrfbtn"> Verify </button> :
                                <button disabled className="btn btn-secondary w-100 mt-3" >  Verify </button>
                            }
                        </div>

                    </div>
                    <div className="col-9">
                        <div className="">
                            {codes && codes.map((item) => {
                                return <button key={item} onClick={() => playGame(item)} className="boxy text-white">
                                    {item}
                                </button>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
export default Minigame
/* 
const codes = {
    1: 145,
    2: 45,
    3: 1,
    4: 456,
    5: 12,
    6: 20,
    7: 32,
    8: 45
} */