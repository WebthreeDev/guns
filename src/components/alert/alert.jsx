import alertImg from '../../img/assets/icons/alert.png'
const Alert = ({ text, status,setAlertStatus }) =>
    status &&
    <div className="modalX">
        <div className="modalInClaim">
            <div className="alertWrap text-center">
                <div className="text-center w-100">
                    <div>
                        <img src={alertImg} height="80px" alt="" />
                    </div>
                    <div className="alertText my-2">{text}</div>
                    <button onClick={()=>setAlertStatus(false) } className='btn btn-primary'> Continue </button>
                </div>
            </div>
        </div>
    </div>

export default Alert