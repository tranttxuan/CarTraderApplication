import {
    Grid,
    Paper,
    InputLabel,
    FormControl,
    Select,
    MenuItem,
    SelectProps,
    Button,
    Box,
} from "@material-ui/core";
import { Field, Form, Formik, useField, useFormikContext } from "formik";
import { GetServerSideProps } from "next";
import React, { useEffect } from "react";
import { getMakes, Make } from "../database/getMakes";
import { makeStyles } from "@material-ui/core/styles";
import router, { useRouter } from "next/router";
import { getModels, Model } from "../database/getModels";
import { getAsString } from "../getAsString";
import useSWR from "swr";

const useStyles = makeStyles((theme) => ({
    paper: {
        margin: "auto",
        maxWidth: 500,
        padding: theme.spacing(3),
    },
}));

const prices = [500, 1000, 5000, 15000, 25000, 50000, 100000];

export interface HomeProps {
    makes: Make[];
    models: Model[];
    singleColumn?: boolean;
}

export default function SearchComponent({ makes, models, singleColumn }: HomeProps) {
    const classes = useStyles();
    const { query } = useRouter();
    const smValue = singleColumn ? 12 : 6;
    console.log(query.make);

    const initialValues = {
        make: getAsString(query.make) || "all",
        model: getAsString(query.model) || "all",
        minPrice: getAsString(query.minPrice) || "all",
        maxPrice: getAsString(query.maxPrice) || "all",
    };
    console.log("initial Value", initialValues);

    return (
        <div>
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                    router.push(
                        {
                            pathname: "/cars",
                            query: { ...values, page: 1 },
                        },
                        undefined,
                        { shallow: false }
                    );
                }}
            >
                {({ values }) => (
                    <Form>
                        <Box mt={10}>
                            <Paper elevation={5} className={classes.paper}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={smValue}>
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

                                    <Grid item xs={12} sm={smValue}>
                                        <ModelSelect
                                            name="model"
                                            models={models}
                                            make={values.make}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={smValue}>
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
                                    <Grid item xs={12} sm={smValue}>
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
                                    <Grid item xs={12} sm={smValue}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            color="primary"
                                        >
                                            Search for cars
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export interface ModelSelectProps extends SelectProps {
    name: string;
    models: Model[];
    make: string;
}

export function ModelSelect({ models, make, ...props }: ModelSelectProps) {
    const { setFieldValue } = useFormikContext();
    const [field] = useField({
        name: props.name,
    });

    // change make => change list of models
    const { data } = useSWR<Model[]>(`/api/models?make=${make}`, {
        dedupingInterval: 60000,
        onSuccess: (newValues) => {
            console.log("it successes", newValues);
            if (!newValues.map((a) => a.model).includes(field.value)) {
                setFieldValue("model", "all");
            }
        },
    });
    const newModels = data || models;

    return (
        <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-age-native-simple">Model</InputLabel>
            <Select name="model" labelId="search-model" label="Model" {...field} {...props}>
                <MenuItem value="all">
                    <em>All models</em>
                </MenuItem>
                {newModels.map(({ model, count }, id) => (
                    <MenuItem key={id} value={model}>
                        {model} ({count})
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const make = getAsString(ctx.query.make);

    const [makes, models] = await Promise.all([getMakes(), getModels(make)]);

    return { props: { makes, models } };
};
