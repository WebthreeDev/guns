import runDog from '../../img/rundog.gif'
import { useState, useEffect, useRef } from "react";
const RaceUi = ({ setRaceUi }) => {

    const [position1, setPosition1] = useState(0)
    const [position2, setPosition2] = useState(0)
    const [position3, setPosition3] = useState(0)
    const [position4, setPosition4] = useState(0)
    const [position5, setPosition5] = useState(0)
    const [position6, setPosition6] = useState(0)

    useEffect(() => {
        item1.current.style.left = `${position1}px`
        item2.current.style.left = `${position2}px`
        item3.current.style.left = `${position3}px`
        item4.current.style.left = `${position4}px`
        item5.current.style.left = `${position5}px`
        item6.current.style.left = `${position6}px`
    }, [position1, position2,position3,position4,position5,position6,])

    useEffect(()=>{
        start()
    },[])

    const item1 = useRef(null)
    const item2 = useRef(null)
    const item3 = useRef(null)
    const item4 = useRef(null)
    const item5 = useRef(null)
    const item6 = useRef(null)

    const start = () => {

        setTimeout(() => {
            setRaceUi(false)
            alert("Finalizo la carrera")
        }, 60000)

        let contador1 = 0
        let contador2 = 0
        let contador3 = 0
        let contador4 = 0
        let contador5 = 0
        let contador6 = 0

        const pos = [5, 1, 3, 4, 2, 6]

        const final = [
            0,
            1000,
            900,
            850,
            800,
            750,
            700
        ]

        const paso = 0.6
        let min = 20
        let max = 40

        let run1 = setInterval(() => {
            if (contador1 < final[pos[0]]) contador1 += paso
            if (contador1 > final[pos[0]]) clearInterval(run1)
            setPosition1(contador1)
        }, random(min, max))

        let run2 = setInterval(() => {
            if (contador2 < final[pos[1]]) contador2 += paso
            if (contador2 > final[pos[1]]) clearInterval(run2)
            setPosition2(contador2)
        }, random(min, max))

        let run3 = setInterval(() => {
            if (contador3 < final[pos[2]]) contador3 += paso
            if (contador3 > final[pos[2]]) clearInterval(run3)
            setPosition3(contador3)

        }, random(min, max))

        let run4 = setInterval(() => {
            if (contador4 < final[pos[3]]) contador4 += paso
            if (contador4 > final[pos[3]]) clearInterval(run4)
            setPosition4(contador4)
        }, random(min, max))

        let run5 = setInterval(() => {
            if (contador5 < final[pos[4]]) contador5 += paso
            if (contador5 > final[pos[4]]) clearInterval(run5)
            setPosition5(contador5)
        }, random(min, max))

        let run6 = setInterval(() => {
            if (contador6 < final[pos[5]]) contador6 += paso
            if (contador6 > final[pos[5]]) clearInterval(run6)
            setPosition6(contador6)
        }, random(min, max))


    }

    const random = (min, max) => {
        const rand = Math.random() * (max - min) + min
        return rand
    }

    return (
        <div className="raceUi">
            <div className="bg-gradas">
               
            </div>
            <div className="bg-pista">
                <div className="rundog">
                    <img ref={item1} className='dog1' src={runDog} alt="" />
                    <img ref={item2} className='dog2' src={runDog} alt="" />
                    <img ref={item3} className='dog3' src={runDog} alt="" />
                    <img ref={item4} className='dog4' src={runDog} alt="" />
                    <img ref={item5} className='dog5' src={runDog} alt="" />
                    <img ref={item6} className='dog6' src={runDog} alt="" />
                </div>
                <div className='meta'> </div>
            </div>

        </div>
    )
}
export default RaceUi