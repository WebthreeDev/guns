import dogCommon from '../../img/nftRace/dogCommon.gif'
import dogRare from '../../img/nftRace/dogRare.gif'
import dogEpic from '../../img/nftRace/dogEpic.gif'
import dogLegendary from '../../img/nftRace/dogLegendary.gif'
import trofeo from '../../img/trofeo.png'

import { useState, useEffect, useRef, Fragment } from "react";

const RaceUi = ({ setRaceUi, places, position,selectedCan, credits,arrayDogs }) => {

    const [position1, setPosition1] = useState(0)
    const [position2, setPosition2] = useState(0)
    const [position3, setPosition3] = useState(0)
    const [position4, setPosition4] = useState(0)
    const [position5, setPosition5] = useState(0)
    const [position6, setPosition6] = useState(0)
    const [alert, setAlert] = useState({status: false, title: "", btn: ""})
    
    const randomDogs = [dogCommon,dogRare,dogEpic,dogLegendary]

    useEffect(() => {
        item1.current.style.left = `${position1}px`
        item2.current.style.left = `${position2}px`
        item3.current.style.left = `${position3}px`
        item4.current.style.left = `${position4}px`
        item5.current.style.left = `${position5}px`
        item6.current.style.left = `${position6}px`
    }, [position1, position2, position3, position4, position5, position6,])

    useEffect(() => {
        start()
    }, [])

    const item1 = useRef(null)
    const item2 = useRef(null)
    const item3 = useRef(null)
    const item4 = useRef(null)
    const item5 = useRef(null)
    const item6 = useRef(null)

    const start = () => {

        console.log("array result:", position)
        console.log(position[5])

        let _place = places.indexOf(1) +1;
        //end of race
        setTimeout(() => {
            handlertAlert(true, _place)
        }, 60000)

        let contador1 = 0
        let contador2 = 0
        let contador3 = 0
        let contador4 = 0
        let contador5 = 0
        let contador6 = 0

        const final = {
            1: 900,
            2: 800,
            3: 750,
            4: 700,
            5: 650,
            6: 600
        }

        const paso = 0.4
        let min = 20
        let max = 30

        const random = (min, max) => {
            const rand = Math.random() * (max - min) + min
            return rand
        }

        let run1 = setInterval(() => {
            if (contador1 < final[places.indexOf(position[0] + 1) + 1]) contador1 += paso || clearInterval(run1)
            setPosition1(contador1)
        }, random(min, max))

        let run2 = setInterval(() => {
            if (contador2 < final[places.indexOf(position[1] + 1) + 1]) contador2 += paso || clearInterval(run2)
            setPosition2(contador2)
        }, random(min, max))

        let run3 = setInterval(() => {
            if (contador3 < final[places.indexOf(position[2] + 1) + 1]) contador3 += paso || clearInterval(run3)
            setPosition3(contador3)

        }, random(min, max))

        let run4 = setInterval(() => {
            if (contador4 < final[places.indexOf(position[3] + 1) + 1]) contador4 += paso || clearInterval(run4)
            setPosition4(contador4)
        }, random(min, max))

        let run5 = setInterval(() => {
            if (contador5 < final[places.indexOf(position[4] + 1) + 1]) contador5 += paso || clearInterval(run5)
            setPosition5(contador5)
        }, random(min, max))

        let run6 = setInterval(() => {
            if (contador6 < final[places.indexOf(position[5] + 1) + 1]) contador6 += paso || clearInterval(run6)
            setPosition6(contador6)
        }, random(min, max))

    }

    const canSelection = (can)=>{
        if(can != false){
            if(can.rarity == 1) {
               return dogCommon
            }
            if(can.rarity == 2) { 
                return dogRare
            }
            if(can.rarity == 3) {
                return dogEpic
            }
            if(can.rarity == 4) {
                return dogLegendary
            } 
        }else{
            return dogCommon
        }
    }

    const handlertAlert = (status, place) => {
        setAlert({
            status,
            place,
        })
    }
    const visible = {
        display: alert.status ? 'none' : "grid" 
    }

    return (
        <Fragment>
            {alert.status && <div className="modalX">
                <div className="modal">
                    <div className="circle">
                        <img className="trofeo" src={trofeo} alt="" />
                    </div>
                    <div className="modal-body">
                        <h2>{alert.place}st</h2>
                        <p className="place">PLACE</p>
                        {/* <p>Credits: {alert.credit}</p> */}
                    </div>
                    <div><p>Reward credits: {credits}</p></div>
                    <button onClick={() => setRaceUi(false)} className='btn btn-primary'>Continue</button>
                </div>
            </div>}
            
            <div className="raceUi">
                    <div className="bg-gradas">
                    </div>
                    <div className="bg-pista">
                        <div className="rundog" style={visible}>
                            {position[0] === 0 ? <div ref={item1} className='dog1'><div className='guia2'> </div> <img className='dogImg' src={canSelection(selectedCan)} alt="" /> </div> : 
                            
                            <div ref={item1} className='dog1'> <img draggable="false" className='dogImg' src={randomDogs[arrayDogs[0]]} alt="" /> </div>}
                            
                            {position[1] === 0 ? <div ref={item2} className='dog2'><div className='guia2'> </div> <img className='dogImg' src={canSelection(selectedCan)} alt="" /> </div> : 
                            
                            <div ref={item2} className='dog2'><img draggable="false" className='dogImg' src={randomDogs[arrayDogs[1]]} alt="" /></div>}
                            
                            {position[2] === 0 ? <div ref={item3} className='dog3'><div className='guia2'> </div> <img className='dogImg' src={canSelection(selectedCan)} alt="" /> </div> : 
                            
                            <div ref={item3} className='dog3'><img draggable="false" className='dogImg' src={randomDogs[arrayDogs[2]]} alt="" /></div>}
                           
                            {position[3] === 0 ? <div ref={item4} className='dog4'><div className='guia2'> </div> <img className='dogImg' src={canSelection(selectedCan)} alt="" /> </div> : 
                            
                            <div ref={item4} className='dog4'><img draggable="false" className='dogImg' src={randomDogs[arrayDogs[3]]} alt="" /></div>}
                            
                            {position[4] === 0 ? <div ref={item5} className='dog5'><div className='guia2'> </div> <img className='dogImg' src={canSelection(selectedCan)} alt="" /> </div> : 
                            
                            <div ref={item5} className='dog5'><img draggable="false" className='dogImg' src={randomDogs[arrayDogs[4]]} alt="" /></div>}
                            
                            {position[5] === 0 ? <div ref={item6} className='dog6'><div className='guia2'> </div> <img className='dogImg' src={canSelection(selectedCan)} alt="" /> </div> : 
                            
                            <div ref={item6} className='dog6'><img draggable="false" className='dogImg' src={randomDogs[arrayDogs[5]]} alt="" /></div>}
                        </div>
                        <div className='meta'> </div>
                    </div>
  
            </div>  
        </Fragment>
    )
}
export default RaceUi