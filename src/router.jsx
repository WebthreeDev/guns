import React from "react";
import { Switch, Route } from "react-router-dom"
import Dashboard from "./pages/dashboard/dashboard"
import Market from "./pages/market/market"
import Shop from "./pages/shop/shop"
import Race from "./pages/race/race"
import Admin from "./pages/admin/admin";
import Canodromes from "./pages/canodromes/canodromes";
import MarketCanodromes from "./pages/marketCanodromes/marketCanodromes";
import Minigame from "./pages/minigame/minigame";
import MarketItems from "./pages/marketItems/marketItems";

const Router = () => {
    return (
        <Switch>
            <Route path="/market">
                <Market />
            </Route>
            <Route path="/marketItems">
                <MarketItems />
            </Route>
            <Route path="/minigame">
                <Minigame/>
            </Route>
            <Route path="/marketcanodromes">
                <MarketCanodromes />
            </Route>
            <Route path="/canodromes">
                <Canodromes />
            </Route>
            <Route path="/admin">
                <Admin />
            </Route>
            <Route path="/dashboard">
                <Dashboard />
            </Route>
            <Route path="/race">
                <Race />
            </Route>
            <Route path="/shop">
                <Shop />
            </Route>
            <Route path="/" exact>
                <Dashboard />
            </Route>
            <Route path="/dapp">
                <Dashboard/>
            </Route>
        </Switch>
    )
}
export default Router