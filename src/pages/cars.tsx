import { Grid } from '@material-ui/core'
import React from 'react'

export default function CarsList() {
    return (
        <Grid container>
            <Grid item xs={12} sm={5} md={3} lg={2}>
                Left 
            </Grid>

            <Grid item xs={12} sm={7} md={9} lg={10}>
                Right
            </Grid>
        </Grid>
    )
}
