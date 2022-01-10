
import React from "react";
import { useLocation, useNavigate, Link } from 'react-router-dom'

export default function Home(props) {

  return (
    <div>
      Home
      <Link to="tt"> jump to Test </Link>
    </div>
  )
}