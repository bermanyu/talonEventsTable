import {useEffect, useState} from 'react';
import _ from "lodash";
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import CancelIcon from "@material-ui/icons/Cancel";
import {makeStyles} from '@mui/styles';

import {toSentenceCase} from '../EventsTable/EventsTable';

const ITEM_HEIGHT      = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps        = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width:     250,
        },
    },
};

const useStyles = makeStyles({
    box:   {
        width:    "fit-content",
        maxWidth: "100%",
        display:  'flex',
        gap:      '3px'
    },
    chip:  {
        backgroundColor: ` rgba(255, 255, 255, 0.16) !important`,
        whiteSpace:      'nowrap',
        overflow:        'hidden',
        textOverflow:    'ellipsis',
    },
    label: {
        color:           "#919EAB !important",
        "&.Mui-focused": {
            color: "#919EAB !important",
        }
    },
    root:  {
        width:                                                      '400px',
        height:                                                     '61px',
        "& .MuiSvgIcon-root":                                       {
            color: "white",
        },
        "&.MuiInputBase-root":                                      {
            "& fieldset":             {
                borderColor: `rgba(255, 255, 255, 0.16)`
            },
            "&.Mui-focused fieldset": {
                borderColor: `rgba(255, 255, 255, 0.16)`
            }
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline":           {
            border:       "1px solid #fffffff",
            borderRadius: "5px 5px 0 0"
        },
        "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderRadius: '8px',
            borderColor:  `rgba(255, 255, 255, 0.16)`,
            border:       `1px solid`
        },
        "& .MuiBox .MuiChip-root":                                  {
            backgroundColor: "white"
        },
        "& div":                                                    {
            color: "white"
        },
    }
});

const EventsFilter = (props) => {
    const classes = useStyles()

    const [selectedEvents, setEventsList] = useState([]);

    const handleChange = (event) => {
        const {target: {value}} = event;
        setEventsList(value);
        props.onEventsTypeFilterChange(value)
    };

    const handleDelete = (e, value) => {
        e.preventDefault();
        const updatedList = _.without(selectedEvents, value);
        setEventsList(updatedList);
        props.onEventsTypeFilterChange(updatedList)
    };

    return (
        <div>
            <FormControl sx={{
                m:     1,
                width: 300
            }}>
                <InputLabel shrink className={classes.label} id="multiple-chip-label">Event Type Filter</InputLabel>
                <Select
                    className={classes.root}
                    labelId="multiple-chip-label" id="demo-multiple-chip"
                    multiple value={selectedEvents} onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" notched label="Event Type Filter"/>}
                    renderValue={(selected) => (
                        <Box className={classes.box}>
                            {selected.map((value) => (
                                <Chip className={classes.chip}
                                      deleteIcon={
                                          <CancelIcon style={{color: '#919EAB'}}
                                                      onMouseDown={(event) => event.stopPropagation()}/>}
                                      onDelete={(e) => handleDelete(e, value)}
                                      key={value} title={toSentenceCase(value)} label={toSentenceCase(value)}/>

                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}>
                    {props.eventTypes.map((type) => (
                        <MenuItem
                            key={type}
                            value={type}>
                            {toSentenceCase(type)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default EventsFilter;
