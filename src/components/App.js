import React from "react"
import { BrowserRouter } from "react-router-dom"
import Router from "../router"
import Navbar from "./navbar/navbar"
import Sidebar from "./sidebar/sidebar"
function App() {
  return (
    <BrowserRouter>
      <div className="etiketaEnviroment"> {process.env.REACT_APP_ENVIROMENT}  </div>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-1">
            <Sidebar />
          </div>
          <div className="col-11">
            <Router />
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}
export default App;
