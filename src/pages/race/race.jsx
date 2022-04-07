import React, { useState, useContext,useEffect } from "react";
import canodromeImg from '../../img/canodrome.png'
import runDog from '../../img/rundog.gif'
import { DataContext } from "../../context/DataContext";
import Loader from "../../components/loader/loader";
import axios from "axios";
import NftCard from "../../components/nftCard/nftCard";
const Race = () => {
    const _context = useContext(DataContext)

    const [modalRace, setModalRace] = useState(false)
    const [modalRaceActive, setModalRaceActive] = useState(false)
    const [selectedCan, setSelectedCan] = useState(false)
    const [selectedCanodrome, setSelectedCanodrome] = useState(false)

    useEffect(() => {
        _context.getCanodromes(_context.wallet)
    }, [_context.wallet, _context.canodromes])

    const clickRun = async () => {
        const canId = selectedCan.id
        const canodromeId = selectedCanodrome._id
        const body = { canId, wallet: _context.wallet, canodromeId }
        console.log(body)
        try {
            const res = await axios.post(process.env.REACT_APP_BASEURL + "race", body)
            const _places = res.data.response.places
            let place = _places.indexOf(1)
            let lugar = ["er", "do", "er", "to", "to", "to"]
            let er = lugar[place]
            await _context.exectConnect()
            alert("Llegaste de " + (place + 1) + er + " lugar")
            setModalRaceActive(false)
        } catch (error) { alert(error.response.data.error) }
    }

    const setRenderModal = _ => { }
    const setModalText = _ => { }
    const setCan = can => {
        setSelectedCan(can)
        setModalRace(false)
        setModalRaceActive(true)
    }

    const race = (selector) => {
        if (selector === 0) singleRace()
        if (selector === 1) rankRace()
        if (selector === 2) beatsRace()
    }

    const singleRace = () => setModalRace(true)
    const rankRace = () => alert("Coming Soon!")
    const beatsRace = () => alert("Coming Soon!")

    return (
        <div className="container">
            {_context.loading && <Loader />}
            {modalRace && <div className="cansSelection">
                <div className='selectTittle'>
                    <div className='tittle'> Single Race </div>
                    <button onClick={_ => setModalRace(false)}> X </button>
                </div>
                <div className="container py-4 overflow">
                    {_context.canodromes && _context.canodromes.map((canodrome, index) => {
                        return (
                            <div key={index} className="row raceCanodrome mb-2">
                                <div className="col-md-2 col-12">
                                    {canodrome.energy} / {_context.converType(canodrome.type)}
                                    <img className="w-100" src={canodromeImg} alt="" />
                                </div>
                                <div className="col-md-10 col-12">
                                    <div className="container-fluid">
                                        <div className="row">
                                            {canodrome.cans && canodrome.cans.map((can, index) => {
                                                return (
                                                    <div key={index} className="col-4" onClick={() => { setCan(can.can); setSelectedCanodrome(canodrome) }}>
                                                        <NftCard
                                                            btnPrice={false}
                                                            setRenderModal={setRenderModal}
                                                            setModalText={setModalText}
                                                            setCan={setCan}
                                                            item={can.can} />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>}

            {modalRaceActive && <div className="cansSelection">
                <div className='selectTittle'>
                    <div className='tittle'> Single Race </div>
                    <button onClick={_ => setModalRaceActive(false)}> X </button>
                </div>
                <div className="container-fluid">
                    <div className="row p-4">
                        <div className="col-3">
                            {selectedCan &&
                                <NftCard
                                    btnPrice={false}
                                    setRenderModal={setRenderModal}
                                    setModalText={setModalText}
                                    setCan={setCan}
                                    item={selectedCan} />
                            }
                        </div>
                        <div className="col-9">
                            <div className="pista">
                                <div className="carril">
                                    <div className="canInCarril">
                                    </div>
                                    <div className="runCarril">
                                    </div>
                                </div>
                                <div className="carril">
                                    <div className="canInCarril">
                                    </div>
                                    <div className="runCarril">
                                    </div>
                                </div>
                                <div className="carril">
                                    <div className="canInCarril">
                                    </div>
                                    <div className="runCarril">
                                    </div>
                                </div>
                                <div className="carril">
                                    <div className="canInCarril">
                                    </div>
                                    <div className="runCarril">
                                    </div>
                                </div>
                                <div className="carril">
                                    <div className="canInCarril">
                                    </div>
                                    <div className="runCarril">
                                    </div>
                                </div>
                                <div className="carril">
                                    <div className="canInCarril">
                                    </div>
                                    <div className="runCarril">
                                    </div>
                                </div>

                            </div>
                            <button onClick={() => { clickRun() }} className="btn btn-success form-control"> Ready! </button>
                        </div>
                    </div>
                </div>
            </div>}

            <div className="row racebg">
                <div className="col-md-4 col-12">
                    <div onClick={() => race(0)} className="raceButton">
                        Single Race
                    </div>
                </div>
                <div className="col-md-4 col-12">
                    <div onClick={() => race(1)} className="raceButton">
                        Rank Mode
                    </div>
                </div>
                <div className="col-md-4 col-12">
                    <div onClick={() => race(2)} className="raceButton">
                        Beats
                    </div>
                </div>
            </div>
        </div >

    )
}
export default Race