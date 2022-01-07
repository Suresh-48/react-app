import React from 'react'
import { Spinner } from 'react-bootstrap'

function Loader() {
  return (
    <div>
      <div className="d-flex position-absolute top-50 start-50 translate-middle">
        <Spinner animation="grow" variant="primary" />
        <span>
          <h4 style={{ paddingLeft: 20 }}>Loading...</h4>
        </span>
      </div>
    </div>
  )
}

export default Loader
