import React from "react";
const Modal = ({text,setRenderModal})=>{
    return (
    <div className="reactModal">
        <div className="modalBody"> 
            <div className="modalHeader">
                {text}
            </div>
            <div className="modalFooter d-flex justify-content-around">
                <button onClick={_=>setRenderModal(false)} className="btn btn-danger mx-1"> Cancel </button>
                <button className="btn btn-primary mx-1"> Confirm </button>
            </div>
        </div>
    </div>
    )
}
export default Modal