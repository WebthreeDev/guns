import runDog from '../../img/rundog.gif'
import { useState, useEffect, useRef } from "react";
const RaceUi = ({ setRaceUi, places }) => {

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

        let _place = places.indexOf(1)

        setTimeout(() => {
            setRaceUi(false)
            let lugar = ["er", "do", "er", "to", "to", "to"]
            let er = lugar[_place]
            alert("Llegaste de " + (_place + 1) + er + " lugar")
        }, 60000)

        let contador1 = 0
        let contador2 = 0
        let contador3 = 0
        let contador4 = 0
        let contador5 = 0
        let contador6 = 0

        const pos = places

        const final = [
            0,
            random(850, 900),
            random(800, 849),
            random(750, 799),
            random(700, 750),
            random(650, 699),
            random(600, 649)
        ]

        const paso = 0.6
        let min = 20
        let max = 40

        let randomArray = []
        for (let i = 0; i <= 5; i++) {
            let random2 = Math.random() * 5
            console.log(random2)
            (!randomArray.includes(random2)) ? randomArray[i] = random2 : i--
        }


        let run1 = setInterval(() => {
            if (contador1 < final[pos[randomArray[0]]]) contador1 += paso || clearInterval(run1)
            setPosition1(contador1)
        }, random(min, max))

        let run2 = setInterval(() => {
            if (contador2 < final[pos[randomArray[1]]]) contador2 += paso || clearInterval(run2)
            setPosition2(contador2)
        }, random(min, max))

        let run3 = setInterval(() => {
            if (contador3 < final[pos[randomArray[2]]]) contador3 += paso || clearInterval(run3)
            setPosition3(contador3)

        }, random(min, max))

        let run4 = setInterval(() => {
            if (contador4 < final[pos[randomArray[3]]]) contador4 += paso || clearInterval(run4)
            setPosition4(contador4)
        }, random(min, max))

        let run5 = setInterval(() => {
            if (contador5 < final[pos[randomArray[4]]]) contador5 += paso || clearInterval(run5)
            setPosition5(contador5)
        }, random(min, max))

        let run6 = setInterval(() => {
            if (contador6 < final[pos[randomArray[5]]]) contador6 += paso || clearInterval(run6)
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
                    {places.indexOf(1) == 0 ? <img ref={item1} className='dog1 border' src={runDog} alt="" /> : <img ref={item1} className='dog1' src={runDog} alt="" />}
                    {places.indexOf(1) == 1 ? <img ref={item2} className='dog2 border' src={runDog} alt="" /> : <img ref={item2} className='dog2' src={runDog} alt="" />}
                    {places.indexOf(1) == 2 ? <img ref={item3} className='dog3 border' src={runDog} alt="" /> : <img ref={item3} className='dog3' src={runDog} alt="" />}
                    {places.indexOf(1) == 3 ? <img ref={item4} className='dog4 border' src={runDog} alt="" /> : <img ref={item4} className='dog4' src={runDog} alt="" />}
                    {places.indexOf(1) == 4 ? <img ref={item5} className='dog5 border' src={runDog} alt="" /> : <img ref={item5} className='dog5' src={runDog} alt="" />}
                    {places.indexOf(1) == 5 ? <img ref={item6} className='dog6 border' src={runDog} alt="" /> : <img ref={item6} className='dog6' src={runDog} alt="" />}

                </div>
                <div className='meta'> </div>
            </div>

        </div>
    )
}
export default RaceUi