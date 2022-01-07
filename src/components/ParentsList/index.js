import MaterialTable from 'material-table'
import React, { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";

// Api
import Api from '../../Api'

//icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'

// Component
import { tableIcons } from '../core/TableIcons'

//Loader
import Loader from '../../components/core/Loader'

//css
import '../../css/ParentList.scss';

function ParentsList(props) {
  const [ data, setData ] = useState([])
  const [ isLoading, setIsLoading ] = useState(true)
  const history = useHistory()

  const tableTheme = createTheme({
    overrides: {
      MuiTableRow: {
        root: {
          "&:hover": {
            cursor: "pointer",
            backgroundColor: "rgba(224, 224, 224, 1) !important",
          },
        },
      },
    },
  });

  const columns = [
    {
      title: 'S.No',
      render: (rowData) => rowData.tableData.id + 1,
      width: '3%',
    },
    { title: 'First Name', field: 'firstName' },
    { title: 'Last Name', field: 'lastName' },
    { title: 'Email', field: 'email' },
    {
      title: 'No. Of Students Enrolled',
      field: 'totalStudentEnroll',
      cellStyle: { width: 250 },
    },
  ]

  // Get Parent List
  const ParentsListData = () => {
    Api.get('api/v1/parent/', {}).then((res) => {
      const data = res.data.data.data
      setData(data)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    ParentsListData()
  }, [])

  return (
    <div>
      {isLoading ? (
        <Loader />) : (
        <Container>
          <Row>
            <h3 className="parents-title">
              Parents List
            </h3>
          </Row>
          <ThemeProvider theme={tableTheme}>
            <MaterialTable
              title="Parent Information"
              icons={tableIcons}
              options={{
                showTitle: false,
                headerStyle: {
                  backgroundColor: '#CCE6FF', zIndex: 0,
                  fontWeight: "bold",
                },
                actionsColumnIndex: -1,
                addRowPosition: 'last',
              }}
              columns={columns}
              data={data}
              actions={[
                {
                  icon: () => (
                    <FontAwesomeIcon icon={faEye} size="sm" color="#397ad4" />
                  ),
                  tooltip: 'View Student Details',
                  onClick: (event, rowData) => {
                    history.push({
                      pathname: `/student/list/${rowData.id}`,
                    })
                  },
                },
              ]}
              localization={{
                body: {
                  emptyDataSourceMessage: 'No Parents List',
                },
              }}
            />
          </ThemeProvider>
        </Container>
      )}
    </div>
  )
}

export default ParentsList
