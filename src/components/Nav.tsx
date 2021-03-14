import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function Nav() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit" className={classes.title}>
                        Car Trader
                    </Typography>

                    <Button color="inherit">
                        <Link href="/">
                            <a style={{ color: "white" }}>
                                <Typography variant="h6" color="inherit">
                                    Home
                                </Typography>
                            </a>
                        </Link>
                    </Button>

                    <Button color="inherit">
                        <Link href="/faq">
                            <a style={{ color: "white" }}>
                                <Typography variant="h6" color="inherit">
                                    FAQ
                                </Typography>
                            </a>
                        </Link>
                    </Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}
