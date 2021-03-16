import { NextApiRequest, NextApiResponse } from "next";
import { getPaginatedCars } from "../../database/getPaginatedCars";

export default async function models(req: NextApiRequest, res: NextApiResponse) {
    console.log("backend: ", req.query)
    const cars = await getPaginatedCars(req.query);
    console.log("return ", cars)
    res.status(200).json(cars);
}
