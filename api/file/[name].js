const USERNAME = "ViraaShop001" // ganti
const REPO = "uploader"

export default async function handler(req,res){
  const { name } = req.query

  const gh = await fetch(
    `https://raw.githubusercontent.com/${USERNAME}/${REPO}/main/uploads/${name}`
  )

  if(!gh.ok)
    return res.status(404).send("File not found")

  res.setHeader("Cache-Control","public, max-age=31536000, immutable")
  res.setHeader("Content-Type", gh.headers.get("content-type"))

  const buffer = await gh.arrayBuffer()
  res.send(Buffer.from(buffer))
}
