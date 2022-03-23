import React from "react";
import { Switch, Route } from "react-router-dom"
import Dashboard from "./pages/dashboard/dashboard"
import Market from "./pages/market/market"
import Shop from "./pages/shop/shop"
import Race from "./pages/race/race"
import Admin from "./pages/admin/admin";

const Router = () => {
    return (
        <Switch>
            <Route path="/market">
                <Market />
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