import React from 'react'

import { Col, Card } from 'react-bootstrap'

import CountUp from 'react-countup'

import { Link } from 'react-router-dom'

// Style
import '../../css/DashBoard.scss'

function DashboardTiles({ label, count, url }) {
  return (
    <>
      <Col xs={12} sm={12} md={4} lg={4}>
        <Card className="card-style mt-3">
          <div className="student-count-style">
            <h4 className="know">{label}</h4>
            <h2 className="mb-0">
              {url ? (
                <Link to={url} className="text-decoration">
                  <CountUp end={count} duration={1} />
                </Link>
              ) : (
                <div>
                  <CountUp end={count} duration={1} />
                </div>
              )}
            </h2>
          </div>
        </Card>
      </Col>
    </>
  )
}

export default DashboardTiles
