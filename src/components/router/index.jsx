import React from "react";
import { Switch, Route } from "react-router-dom"
import Dashboard from "../routes/dashboard/dashboard"
import Market from "../routes/market/market"
import Shop from "../routes/shop/shop"
import Race from "../routes/race/race"
import Test from "../routes/test/test";

const Router = () => {
    return (
        <Switch>
            <Route path="/market">
                <Market />
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
            <Route path="/test">
                <Test/>
            </Route>
        </Switch>
    )
}
export default Router