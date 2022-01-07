import MaterialTable from 'material-table'
import React, { useState, useEffect } from 'react'
// Component
import { tableIcons } from '../core/TableIcons'
import { ThemeProvider } from '@material-ui/styles'
import { createTheme } from '@material-ui/core/styles'
import { Container, Row } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

//css
import '../../css/AdminStudentsList.scss'

// Api
import Api from '../../Api'

// Loader
import Loader from '../../components/core/Loader'

function AdminStudentsList(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])
  const history = useHistory()

  const tableTheme = createTheme({
    overrides: {
      MuiTableRow: {
        root: {
          '&:hover': {
            cursor: 'pointer',
            backgroundColor: 'rgba(224, 224, 224, 1) !important',
          },
        },
      },
    },
  })

  const columns = [
    {
      title: 'S.No',
      render: (rowData) => rowData.tableData.id + 1,
      width: '3%',
    },
    { title: 'Firstname', field: 'firstName' },
    { title: 'Lastname', field: 'lastName' },
    { title: 'Email', field: 'email' },
    { title: 'Course Count', field: 'totalCourseEnrolled' },
  ]

  const getAdminStudentsList = () => {
    Api.get('api/v1/student').then((response) => {
      const data = response.data.data.data
      setData(data)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    getAdminStudentsList()
  }, [])

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <Row className="pt-3">
            <h3 className="adminstudent-title">Students List</h3>
          </Row>
          <ThemeProvider theme={tableTheme}>
            <MaterialTable
              columns={columns}
              data={data}
              icons={tableIcons}
              options={{
                showTitle: false,
                headerStyle: {
                  backgroundColor: '#CCE6FF',
                  zIndex: 0,
                  fontWeight: 'bold',
                },
                actionsColumnIndex: -1,
                addRowPosition: 'last',
              }}
              localization={{
                body: {
                  emptyDataSourceMessage: 'No Students List',
                },
              }}
              actions={[
                {
                  icon: () => (
                    <p
                      className="enroll-style"
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        marginBottom: 0,
                        color: '#0D6EFD',
                      }}
                    >
                      View
                    </p>
                  ),
                  onClick: (event, rowData) => {
                    history.push(`/upcoming/schedule/list/${rowData.id}`)
                  },
                  tooltip: 'View Upcoming Course Schedule',
                },
              ]}
            />
          </ThemeProvider>
        </Container>
      )}
    </div>
  )
}

export default AdminStudentsList
