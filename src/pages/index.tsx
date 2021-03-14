import { Grid, Paper, InputLabel, FormControl, Select, MenuItem } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { GetServerSideProps } from "next";
import React from "react";
import { getMakes, Make } from "../database/getMakes";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import { getModels, Model } from "../database/getModels";
import { getAsString } from "../getAsString";

const useStyles = makeStyles((theme) => ({
    paper: {
        margin: "auto",
        maxWidth: 500,
        padding: theme.spacing(3),
    },
}));

const prices = [500,1000,5000,15000,25000,50000,100000]

export interface HomeProps {
    makes: Make[];
    models:Model[]
}

export default function Home({ makes, models }: HomeProps) {
    const classes = useStyles();
    const { query } = useRouter();
    console.log(query.make);

    const initialValues = {
        make: getAsString(query.make) || "all",
        model: getAsString (query.model) || "all",
        minPrice:getAsString(query.minPrice) || "all",
        maxPrice: getAsString(query.maxPrice )|| "all",
    };
    console.log("initial Value", initialValues);

    return (
        <div>
            <Formik initialValues={initialValues} onSubmit={() => {}}>
                {({ values }) => (
                    <Form>
                        <Paper elevation={5} className={classes.paper}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel htmlFor="outlined-age-native-simple">
                                            Make
                                        </InputLabel>
                                        <Field
                                            name="make"
                                            as={Select}
                                            labelId="search-make"
                                            label="Make"
                                        >
                                            <MenuItem value="all">
                                                <em>All makes</em>
                                            </MenuItem>
                                            {makes.map(({ make, count }, id) => (
                                                <MenuItem value={make} key={id}>
                                                    {make} ({count})
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>

                                {/* <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel htmlFor="outlined-age-native-simple">
                                            Model
                                        </InputLabel>
                                        <Field
                                            name="model"
                                            as={Select}
                                            labelId="search-model"
                                            label="Model"
                                        >
                                            <MenuItem value="all">
                                                <em>All models</em>
                                            </MenuItem>
                                            {models.map(({ model, count }, id) => (
                                                <MenuItem value={model} key={id}>
                                                    {model} ({count})
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid> */}

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel htmlFor="outlined-age-native-simple">
                                            Min Price
                                        </InputLabel>
                                        <Field
                                            as={Select}
                                            name="minPrice"
                                            labelId="search-min=price"
                                            label="min price"
                                        >
                                            <MenuItem value="all">
                                                <em>No min</em>
                                            </MenuItem>
                                            {prices.map((price, id) => (
                                                <MenuItem value={price} key={id}>
                                                    {price} 
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel htmlFor="outlined-age-native-simple">
                                           No Max
                                        </InputLabel>
                                        <Field
                                            as={Select}
                                            name="maxPrice"
                                            labelId="search-min=price"
                                            label="max price"
                                        >
                                            <MenuItem value="all">
                                                <em>All price</em>
                                            </MenuItem>
                                            {prices.map((price, id) => (
                                                <MenuItem value={price} key={id}>
                                                    {price} 
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const make = getAsString(ctx.query.make);

    const [makes, models] = await Promise.all([
        getMakes(),
        getModels(make)
    ])
    // const makes = await getMakes();
    // const models = await getModels(make)
    return { props: { makes,models } };
};
