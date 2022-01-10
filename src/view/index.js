
import React, { lazy } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Routes, Route } from "react-router-dom";
import { withSuspense } from "@HOC"

/* static import */
import Home from '@pages/Home'

/* async import  */
const AsyncTest = withSuspense(lazy(() => import('@pages/Test')))


ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path='tt' element={<AsyncTest />} />
        <Route index element={<Home />} />
      </Routes>
    </HashRouter >
  </React.StrictMode >,
  document.getElementById('root')
)
