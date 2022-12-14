import { client } from "../../lib/sanity";

const getUserInfo = async (req, res) => {
    try {
        const query = `*[_type == "users" && _id == "${req.query.activeAccount}"]{
        name,
        walletAddress,
        "imageUrl": profileImage.asset->url,
        }`
        const sanityResponse = await client.fetch(query);
        res.status(200).send({message:'Success', data: sanityResponse[0]});
    } catch (e) {
        res.status(500).send({ message: "Error getting user", data: sanityResponse[0] });
    }
}

export default getUserInfo;