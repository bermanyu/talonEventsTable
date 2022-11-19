import {DataGrid} from '@mui/x-data-grid';
import _ from "lodash";
import './EventsTable.styles.css'
import {useEffect, useState} from 'react';
import EventsFilter from '../EventsFilter/EventsFilter';
import EmptyTableState from '../EmptyTableState/EmptyTableState'

export const toSentenceCase = (text) => {
    if(text != null) {
        const result      = text?.replace(/([A-Z])/g, " $1");
        const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
        return finalResult;
    }

    else {
        return ''
    }

}

const loadDataFromServer = async () => {
    let retVal = [];

    const bla                 = await fetch("http://localhost:8000/dataTable");
    const handlePromise       = await bla.json();
    const eventsTypesFromData = _.map(handlePromise, 'eventType')
    console.log('data', handlePromise)

    retVal = [_.uniq(eventsTypesFromData), handlePromise];

    return retVal;
}

const EventsTable = () => {

    const columns                     = [
        {
            field:        'eventType',
            headerName:   'Event Type',
            sortable:     false,
            flex:         1,
            renderHeader: (params) => (
                <p style={{margin: "4vw"}}>{params.colDef.headerName}</p>
            ),
            renderCell:   (params) => (
                <p style={{margin: "4vw"}}>{toSentenceCase(params.row.eventType)}</p>
            )
        },
        {
            field:        'severity',
            headerName:   'Severity',
            sortable:     false,
            flex:         1,
            renderHeader: (params) => (
                <p style={{margin: "4vw"}}>{params.colDef.headerName}</p>
            ),
            renderCell:   (params) => (
                <div>
                    {params.row.severity === 'low' && <span className='badge' style={{
                        backgroundColor: '#3A90E5',
                        margin:          "4vw"
                    }}>{params.row.severity.toUpperCase()}</span>}
                    {params.row.severity === 'medium' && <span className='badge' style={{
                        backgroundColor: '#FFB547',
                        margin:          "4vw"
                    }}>{params.row.severity.toUpperCase()}</span>}
                    {params.row.severity === 'high' && <span className='badge' style={{
                        backgroundColor: '#F06161',
                        margin:          "4vw"
                    }}>{params.row.severity.toUpperCase()}</span>}
                </div>
            )
        },
        {
            field:      'user',
            headerName: 'User',
            sortable:   false,
            flex:       1,
            renderCell: (params) => (
                <p style={{marginBottom:10}}>
                    <strong>{params.row.user.name || ''}</strong> <br/>
                    {params.row.user.email || ''}
                </p>
            )
        },
        {
            field:          'time',
            headerName:     'Date',
            sortable:       false,
            flex:           1,
            sortComparator: (v1, v2) => {
                const v1Split  = v1.split('|');
                const v1AsDate = new Date(v1Split[0] + v1Split[1]);
                const v2Split  = v2.split('|');
                const v2AsDate = new Date(v2Split[0] + v2Split[1]);

                return v1AsDate > v2AsDate;
            },
            valueGetter:    (params) => {
                let retVal;
                const date        = new Date(params.row.time)
                const dateOptions = {
                    year:  'numeric',
                    day:   '2-digit',
                    month: '2-digit'
                };
                const timeOptions = {
                    hour12:    false,
                    hourCycle: 'h23',
                    hour:      '2-digit',
                    minute:    '2-digit',
                    second:    '2-digit'
                };

                retVal = `${date.toLocaleDateString('en-ZA', dateOptions) + " | " + date.toLocaleTimeString('en-Gb',
                    timeOptions)}`;

                return retVal
            }
        }
    ];
    const [mainData, setData]         = useState([])
    const [rows, setRows]             = useState([]);
    const [eventsList, setEventsList] = useState([]);
    const [loading, setLoading]       = useState(false);
    const [pageSize, setPageSize]     = useState(5);

    const tableSx = {flex:1,
        '&.MuiDataGrid-root .MuiDataGrid-row':{
            minHeight: "73px !important",
            display:'flex',
            flexWrap:'wrap-reverse',
            alignContent: "center",
        },
        '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within':{
            outline: "none !important"
        },
        '& .MuiDataGrid-virtualScroller':{
            marginTop:'70px !important'
        },
        '& .MuiDataGrid-overlay':         {
            backgroundColor: `rgba(93,89,89,0.2)`
        },
        '& .MuiDataGrid-withBorder	':  {
            borderWidth: 2,
            borderColor: "#3D4752",
        },
        '& .MuiDataGrid-cell':            {
            paddingBottom:3,
            borderWidth: 2,
            borderColor: '#3D4752',
        },
        '& .MuiDataGrid-footerContainer': {
            borderColor: 'transparent'
        },
        '& .MuiTablePagination-root ':          {
            color: '#ffffff'
        },
        '& .MuiSvgIcon-root.MuiSelect-icon':          {
            color: '#ffffff'
        },
        '& .MuiDataGrid-columnHeaders':          {
            borderBottom: '2px solid #3D4752'
        },
        '& .MuiDataGrid-iconSeparator':   {
            color: 'transparent'
        }
    }

    const tableInitialState = {
        sorting: {
            sortModel: [{
                field: 'time',
                sort:  'desc'
            }],
        },
    }

    useEffect(() => {
        (async () => {
            setLoading(true);
            const loadedData = await loadDataFromServer()
            setRows(loadedData[1])
            setEventsList(loadedData[0])
            setData(loadedData[1])
                        setLoading(false);
        })()

    }, [])

    const onEventsTypesFilterHandler = (enteredEventsTypesList) => {
        setLoading(true);
        if(_.isEmpty(enteredEventsTypesList)) {
            setRows(mainData);
        }
        else {
            setLoading(true);
            const eventsTypesList = [...enteredEventsTypesList];
            const newFilteredRows = _.filter(mainData, (row) => {
                const isRowTypeInFilterList = _.find(eventsTypesList, (type) => {
                    return type === row.eventType
                });
                return isRowTypeInFilterList;
            })
            setRows(newFilteredRows);

        }
        setLoading(false);

    }

    return (
        <div className="events-table">
            <p className="table-title">Events Table</p>
            <div className="events-filter-container">
                <EventsFilter onEventsTypeFilterChange={onEventsTypesFilterHandler}
                              eventTypes={eventsList}
                />
            </div>

            <DataGrid
                initialState={tableInitialState}
                sx={tableSx} className="events-table events-table-data-grid"
                rows={rows} columns={columns}
                disableSelectionOnClick
                pageSize={pageSize}
                rowsPerPageOptions={[5, 10, 25]}
                getRowId={(row) => row.time}
                disableColumnMenu
                pagination
                autoHight
                loading={loading}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                components={{
                    NoRowsOverlay: EmptyTableState,
                }}
            />
        </div>)
}

export default EventsTable;
