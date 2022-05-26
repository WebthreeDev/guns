import React, { useState, useContext, useEffect } from "react";
import canodromeImg from '../../img/canodrome.png'
import { DataContext } from "../../context/DataContext";
import Loader from "../../components/loader/loader";
import axios from "axios";
import NftCard from "../../components/nftCard/nftCard";
import { Link } from "react-router-dom"
import RaceUi from "../../components/raceui/raceui";
import "../../css/pages/games.scss"
import enviroment from "../../env"
import flag from '../../img/assets/icons/flag.png'
import control from '../../img/assets/icons/control.png'
import rank from '../../img/assets/icons/rank.png'
import beats from '../../img/assets/icons/beats.png'
import '../../css/components/raceUi.scss';
import commonCanodrome from '../../img/canodromes/common.png'
import rareCanodrome from '../../img/canodromes/rare.png'
import epicCanodrome from '../../img/canodromes/epic.png'
import legendaryCanodrome from '../../img/canodromes/legendary.png'

import commonNft from '../../img/nfts/common.png'
import rareNft from '../../img/nfts/rare.png'
import epicNft from '../../img/nfts/epic.png'
import legendaryNft from '../../img/nfts/legendary.png'
import Card from "../../components/card/card";

const Race = () => {
    const _context = useContext(DataContext)
    const { rarity } = useContext(DataContext)

    const [modalRace, setModalRace] = useState(false)
    const [modalRaceActive, setModalRaceActive] = useState(false)
    const [selectedCan, setSelectedCan] = useState(false)
    const [selectedCanodrome, setSelectedCanodrome] = useState(false)
    const [raceUi, setRaceUi] = useState(false)
    const [places, setPlaces] = useState([])
    const [position, setPosition] = useState([])

    const clickRun = async () => {
        const canId = selectedCan.id
        const canodromeId = selectedCanodrome._id
        const body = { canId, wallet: _context.wallet, canodromeId }
        console.log(body)
        try {
            const res = await axios.post(enviroment().baseurl + "race", body)
            const _places = res.data.response.places
            //actualizar estado energy
            await _context.exectConnect()
            setModalRaceActive(false)
            goRace(_places)
        } catch (error) { alert(error.response.data.error) }
    }

    const goRace = (_places) => {
        let aux = []
        for (let i = 0; i <= 5; i++) {
            let randomPosition = Math.round(Math.random() * (5 - 0) + 0)
            if (aux.includes(randomPosition)) {
                i--
            } else {
                aux[i] = randomPosition
            }
        }
        setPosition(aux)
        setPlaces(_places)
        setRaceUi(true)
        _context.setLoading(false)
    }

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

    const openCanModal = (can)=>{
        setCan(can)
    }

    return (
        <div className="container">
            {raceUi && <RaceUi places={places} setRaceUi={setRaceUi} position={position} selectedCan={selectedCan} />}
            {_context.loading && <Loader />}
            {modalRace && <div className="modalX">
                <div className="modalRace ">
                    <div className='selectTittle'>
                        <div className='tittle'> Select your can</div>
                        <button className="btn btn-danger" onClick={_ => setModalRace(false)}> X </button>
                    </div>
                    <div className="container py-4 ">
                        {!_context.canodromes && "You need a canodrome to play race"}
                        {_context.canodromes && _context.canodromes.map((canodrome, index) => {
                            return (
                                <div key={index} className="row raceCanodrome mb-2 ">
                                    <div className="col-md-3 col-12">
                                        {canodrome.energy} / {_context.converType(canodrome.type)}
                                        {canodrome.type === 1 && <img className="w-100" src={commonCanodrome} alt="" />}
                                        {canodrome.type === 2 && <img className="w-100" src={rareCanodrome} alt="" />}
                                        {canodrome.type === 3 && <img className="w-100" src={epicCanodrome} alt="" />}
                                        {canodrome.type === 4 && <img className="w-100" src={legendaryCanodrome} alt="" />}
                                    </div>
                                    <div className="col-md-9 col-12">
                                        <div className="container-fluid">
                                            <div className="row">
                                                {canodrome.cans.length == 0 && <div className="h-100 text-center pt-3">
                                                    <h1 className="text-center"> Add cans in canodrome section</h1>
                                                    <Link className="btn btn-primary" to="/canodromes">
                                                        Go to Canodromes
                                                    </Link>
                                                </div>}
                                                {canodrome.cans && canodrome.cans.map((can, index) => {
                                                    return (
                                                        <div key={index} className="col-4" onClick={() => { setCan(can.can); setSelectedCanodrome(canodrome) }}>
                                                                <Card openCanModal={openCanModal} sale={true} can={can.can} />
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
                </div>
            </div>}


            {modalRaceActive && <>
                <div className='modalX'>
                    <div className='canModalIn'>
                        <div className='px-4 d-flex pt-3 align-items-center justify-content-between'>
                            <div>Are you ready?</div>
                            <button className='btn btn-danger' onClick={() => setModalRaceActive(false)}> X </button>
                        </div>
                        <div className="container-fluid">
                            <div className="row gx-2">
                                <div className="col-6">
                                    <div className='canPhoto'>
                                        <div className='stats'>
                                            <div className='totalStats'>Total stats</div>
                                            <div className='statsNumber'>{selectedCan.resistencia + selectedCan.aceleracion + selectedCan.aerodinamica}</div>
                                        </div>
                                        <div className='rarity'>
                                            {rarity(selectedCan.rarity)}
                                        </div>
                                        <div className='nftId'>
                                            # {selectedCan.id}
                                        </div>
                                        {selectedCan.rarity === "1" && <img className='imgNft' src={commonNft} alt="" />}
                                        {selectedCan.rarity === "2" && <img className='imgNft' src={rareNft} alt="" />}
                                        {selectedCan.rarity === "3" && <img className='imgNft' src={epicNft} alt="" />}
                                        {selectedCan.rarity === "4" && <img className='imgNft' src={legendaryNft} alt="" />}

                                    </div>
                                    <div className='options'>
                                        {selectedCan.name}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className='canInfo'>
                                        <div className='w-energy'>
                                            <div className='energy'>
                                                <div>
                                                    Energy:
                                                </div>
                                                <div>
                                                    {selectedCan && selectedCan.energy}/4
                                                </div>
                                            </div>
                                            <div>
                                                <progress value={selectedCan.energy} min="0" max="4" className='progressEnergy'> </progress>
                                            </div>
                                        </div>
                                        <div className='energy mt-3'>
                                            <div>Aerodinamic:</div>
                                            <div>{selectedCan && selectedCan.aerodinamica}</div>
                                        </div>
                                        <div className='energy mt-3'>
                                            <div>Aceleration:</div>
                                            <div>{selectedCan && selectedCan.aceleracion}</div>
                                        </div>
                                        <div className='energy mt-3'>
                                            <div>Resistence:</div>
                                            <div>{selectedCan && selectedCan.resistencia}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 pt-4 pb-3">
                                    <button onClick={() => { clickRun() }} className="btn btn-success form-control"> Ready! </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>}
            {/* /********** */}
            {/* {modalRaceActive && <div className="modalX">
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
                        
                            
                    </div>
                </div>
            </div>} */}
            {/* /********************************** */}
            <div className="row racebg">
                <div className="col-md-3 col-12">
                    <div onClick={() => race(0)} className="raceButton">
                        <div className="text-center">
                            <img className="flag" src={flag} alt="" />
                        </div>
                        <div className="textButtonRace">
                            SINGLE RACE
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-12">
                    <Link to="/minigame" className="raceButton rbtn4 t">
                        <div className="text-center">
                            <img className="flag" src={control} alt="" />
                        </div>
                        <div className="textButtonRace">
                            TICKET MINIGAME
                        </div>
                    </Link>
                </div>
                <div className="col-md-3 col-12">
                    <div className="raceButtonComingSoon rbtn2">
                        <div>
                            <div className="text-center">
                                <img className="flag" src={rank} alt="" />
                            </div>
                            <div className="btn-gray">
                                RANK MODE
                            </div>
                            <div className="cms">
                                Coming soon
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-12">
                    <div className="raceButtonComingSoon rbtn3">
                        <div>
                            <div className="text-center">
                                <img className="flag" src={beats} alt="" />
                            </div>
                            <div className="btn-gray">
                                RACE BEATS
                            </div>
                            <div className="cms">
                                Coming soon
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    )
}
export default Race