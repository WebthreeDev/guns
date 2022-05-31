import React from "react"
import { BrowserRouter } from "react-router-dom"
import Router from "../router"
import Navbar from "./navbar/navbar"
import Sidebar from "./sidebar/sidebar"
import SidebarMovil from "./sidebarMovil/sidebarMovil"
function App() {
  return (
    <BrowserRouter>
      <div className="etiketaEnviroment"> {process.env.REACT_APP_ENVIROMENT}  </div>
      <Navbar />
      <SidebarMovil />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2 col-lg-1 d-none d-md-block ">
            <Sidebar />
          </div>
          <div className="col-md-10 col-lg-11 col-12">
            <Router />
          </div>
        </div>

      </div>
    </BrowserRouter>
  )
}
export default App;
