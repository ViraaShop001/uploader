const TOKEN = "dm0SIK2U+I0f6Bx8h1b2DaE3IHyCarCN2H2lncDjmwrJTs/zeU30yklisRyV1PfJ";
const USERNAME = "ViraaShop001";
const REPO = "uploader";
const BRANCH = "main";

export default async function handler(req, res) {
  const { name } = req.query;

  const r = await fetch(
    `https://raw.githubusercontent.com/${USERNAME}/${REPO}/${BRANCH}/uploads/${name}`
  );

  if (!r.ok) return res.status(404).send("Not found");

  const buffer = await r.arrayBuffer();
  res.send(Buffer.from(buffer));
                                         }
