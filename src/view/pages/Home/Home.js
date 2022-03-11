
import React from "react";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import New from 'app1/New';

export default function Home(props) {

  return (
    <div>
      Home
      <Link to="tt"> jump to Test </Link>

      <br />
      <br />
      <br />
      <New />
    </div>
  )
}