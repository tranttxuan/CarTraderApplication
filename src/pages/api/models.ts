import { NextApiRequest, NextApiResponse } from "next";
import { getModels } from "../../database/getModels";
import { getAsString } from "../../getAsString";

export default async function models(req: NextApiRequest, res: NextApiResponse) {
    const make = getAsString(req.query.make);
    const models = await getModels(make);
    console.log( models)
    res.status(200).json(models)
}


// www.myapp.com?myparam=hello&myparams=hell023 => qurey.myParams =[hello, hell0123