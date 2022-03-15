import { configureStore } from '@reduxjs/toolkit'
import reduxState from './redux'

export default configureStore({
    reducer:{ reduxState }
})


