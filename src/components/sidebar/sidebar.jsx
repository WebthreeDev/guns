import telegram from '../../img/assets/social/telegram.svg'
import discord from '../../img/assets/social/discord.svg'
import twitter from '../../img/assets/social/twitter.svg'
import icon from '../../img/assets/icons/icon.png'
import marketIcon from '../../img/assets/icons/market.png'
const Sidebar = () => {
    return (<div className="sidebar">
        <div className='sidebarWrap'>
            <div className='w-100'>
                <div className='btnSidebar'>
                    <div>
                        <div>
                            <img className='icon' src={icon} alt="" />

                        </div>
                        <div className='text-sidebar'>
                            Dashboard
                        </div>
                    </div>
                </div>
                <div className='btnSidebar'>
                    <div>
                        <div>
                            <img className='icon' src={marketIcon} alt="" />
                        </div>
                        <div className='text-sidebar'>
                            Market
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <img className='social' src={telegram} alt="" />
                </div>
                <div>
                    <img className='social' src={discord} alt="" />
                </div>
                <div>
                    <img className='social' src={twitter} alt="" />
                </div>
            </div>
        </div>
    </div>)
}
export default Sidebar