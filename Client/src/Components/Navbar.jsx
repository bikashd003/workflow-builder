import React from 'react'
import '../Styles/navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
    <div className='navbar'>
        <ul className='nav'>
            <Link to="/" className='link'>Home</Link>
            <Link to="/execution" className='link'>Execution</Link>
        </ul>
    </div>
    </>
  )
}

export default Navbar