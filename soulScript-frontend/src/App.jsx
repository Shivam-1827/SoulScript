import { useState } from 'react'

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './components/Home'
import Blog from './components/Blog'  
import Post from './components/Post'



function App() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/blog:slug' element={<Blog/>}></Route>
        <Route path='/post' element={<Post/>}></Route>
      </Routes>
    </Router>
  )
}

export default App
