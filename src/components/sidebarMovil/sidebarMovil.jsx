import "../../css/components/sidebarMovil.scss"
import { NavLink } from "react-router-dom"
import icon from '../../img/assets/icons/icon.png'
import marketIcon from '../../img/assets/icons/market.png'
import playIcon from '../../img/assets/icons/play.png'
import shopIcon from '../../img/assets/icons/shop.png'
const SidebarMovil = () => {
    return <div className="sidebarMovil d-md-none d-flex">

        <NavLink to='/dashboard' className='btnSidebar border-r'>
            <div>
                <div>
                    <img className='icon' src={icon} alt="" />
                </div>
                <div className='text-sidebar'>
                    Dashboard
                </div>
            </div>
        </NavLink>
        <NavLink to='/market' className='btnSidebar border-r'>
            <div>
                <div>
                    <img className='icon' src={marketIcon} alt="" />
                </div>
                <div className='text-sidebar'>
                    Market
                </div>
            </div>
        </NavLink>
        <NavLink to='/race' className='btnSidebar border-r'>
            <div>
                <div>
                    <img className='icon' src={playIcon} alt="" />
                </div>
                <div className='text-sidebar'>
                    Games
                </div>
            </div>
        </NavLink>
        <NavLink to='/shop' className='btnSidebar text-center'>
            <div>
                <div>
                    <img className='icon' src={shopIcon} alt="" />
                </div>
                <div className='text-sidebar'>
                    Shop
                </div>
            </div>
        </NavLink>
    </div>
}
export default SidebarMovil