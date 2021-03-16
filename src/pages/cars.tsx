import { Grid } from "@material-ui/core";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { CarModel } from "../../api/Car";
import { getMakes, Make } from "../database/getMakes";
import { getModels, Model } from "../database/getModels";
import { getPaginatedCars } from "../database/getPaginatedCars";
import { getAsString } from "../getAsString";
import SearchComponent from "./index";
import { Pagination, PaginationItem, PaginationRenderItemParams } from "@material-ui/lab";
import { useRouter } from "next/router";
import { ParsedUrlQuery, stringify } from "querystring";
import Link from "next/link";
import useSWR from "swr";
import deepEqual from "fast-deep-equal";
import CarCard from "../components/CarCard";

export interface CarsListProps {
    makes: Make[];
    models: Model[];
    cars: CarModel[];
    totalPages: number;
}

export default function CarsList({ makes, models, cars, totalPages }: CarsListProps) {
    const { query } = useRouter();
    const [serverQuery] = useState(query);

    console.log("check query server", query, serverQuery);

    const { data } = useSWR("/api/cars?" + stringify(query), {
        dedupingInterval: 20000,
        initialData: deepEqual(query, serverQuery) ? { cars, totalPages } : undefined,
    });

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={5} md={3} lg={2}>
                <SearchComponent singleColumn={true} makes={makes} models={models} />
            </Grid>

            <Grid item xs={12} sm={7} md={9} lg={10}>
                <Grid item xs={12}>
                    <Pagination
                        count={data?.totalPages}
                        color="primary"
                        page={parseInt(getAsString(query.page)) || 1}
                        renderItem={(item) => (
                            <PaginationItem
                                component={MaterialUiLink}
                                query={query}
                                item={item}
                                {...item}
                            />
                        )}
                    />
                </Grid>

                {(data?.cars || []).map((car) => (
                    <Grid key={car.id} item xs={12} sm={6}>
                        <CarCard car={car} />
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
}

export interface MaterialUiLinkProps {
    item: PaginationRenderItemParams;
    query: ParsedUrlQuery;
}

export function MaterialUiLink({ item, query, ...props }: MaterialUiLinkProps) {
    return (
        <Link
            href={{
                pathname: "/cars",
                query: { ...query, page: item.page },
            }}
            shallow
        >
            <a {...props}></a>
        </Link>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const make = getAsString(ctx.query.make);
    console.log("query", ctx.query);

    const [makes, models, pagination] = await Promise.all([
        getMakes(),
        getModels(make),
        getPaginatedCars(ctx.query),
    ]);

    return { props: { makes, models, cars: pagination.cars, totalPages: pagination.totalPages } };
};
