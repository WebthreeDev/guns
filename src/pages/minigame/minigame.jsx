import { useEffect,useState } from "react"
const Minigame = () => {

    const [array1,setArray1] = useState(false)
    
    useEffect(()=>{
        generateRandomArrays()
    },[])
    
    const answer = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    const generateRandomArrays = ()=>{
        let arr

    }

    const x = 1

    return (<>
        <div className="pt-5">
            
            <div className="container pt-3">
                <h3> Hack the box</h3>
            </div>
            <div className="container">
                <div className="row border px-1 py-3 bg-black">
                    <div className="col-8">
                        <div className="pantalla container">
                            <div className="row">
                                <div className="col-1 text-center border">
                                    {String.fromCharCode(x)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="container-fluid">
                            <div className="row pb-3">
                                {answer.map(i => {
                                    return <div key={i} className="col-1 border p-2">  {i + 1} </div>
                                })}
                            </div>

                            <div className="row pb-3">
                                {answer.map(i => {
                                    return <div key={i} className="col-1 border p-2">  {i + 1} </div>
                                })}
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <button className="btn btn-primary w-100"> Play </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </>)
}
export default Minigame