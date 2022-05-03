import runDog from '../../img/rundog.gif'
import { useState,useEffect } from "react";
const RaceUi = ()=>{

    const [style,setStyle] = useState()

    useEffect(()=>{
        initRace()
        //prueba()
    },[])

    /* const prueba = ()=>{
        setStyle({"left":"200px"})
    } */

    const initRace = ()=>{
        let time = 0
       do {
            setTimeout(()=>{
                console.log("time:",time)
                setStyle({"left":time+"px"})
            },100)
            time++
        } while (time <= 1000)
    }

    return (
        <div className="raceUi">
            <div className="bg-gradas">
            </div>
            <div className="bg-pista">
                <div className="rundog">
                <img className='dog1' src={runDog} alt="" />
                <img className='dog2' src={runDog} alt="" />
                <img className='dog3' src={runDog} alt="" />
                <img className='dog4' src={runDog} alt="" />
                <img className='dog5' src={runDog} alt="" />
                <img className='dog6' src={runDog} alt="" style={style} /> 
                </div>
            </div>            
            
        </div>
    )
}
export default RaceUi