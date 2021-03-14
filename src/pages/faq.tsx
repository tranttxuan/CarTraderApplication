import { GetStaticProps } from "next";
import React, { useEffect, useState } from "react";
import { FaqModel } from "../../api/Faq";
import { openDB } from "../openDB";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    //   borderBottom:
    },
    content:{
        color:'red'
    }
  }));

export interface FAQProps {
    faq: FaqModel[];
}

export default function Faq({ faq }: FAQProps) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {faq.map((f) => (
                <div key={f.id}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}>{f.question} </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography className={classes.content}>{f.answer}</Typography>
                        </AccordionDetails>
                    </Accordion>
                </div>
            ))}
        </div>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const db = await openDB();
    const getFAQ = await db.all("SELECT * FROM FAQ ORDER BY createDate DESC");

    return {
        props: { faq: getFAQ },
    };
};
