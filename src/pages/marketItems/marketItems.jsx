import { Link } from "react-router-dom"
const MarketItems = () => {
    return (<div className="">
        <div className="container-fluid">
            <div className="secondNav mt-50px mb-3">
                <Link to="/market" className="secondNavButton">
                    <div>
                        Cans
                    </div>
                </Link>
                <Link to="/marketcanodromes" className="secondNavButton">
                    Canodromes
                </Link>
                <Link to="/marketItems" className="secondNavButton active">
                    Items
                </Link>
            </div>
        </div>
    </div>)
}
export default MarketItems