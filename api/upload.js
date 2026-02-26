import crypto from "crypto"

const USERNAME = "ViraaShop001"
const REPO = "uploader"

function randomName(ext){
  return crypto.randomBytes(6).toString("hex") + ext
}

export default async function handler(req,res){
  if(req.method !== "POST")
    return res.status(405).json({error:"method not allowed"})

  try{
    const { content, ext } = req.body
    if(!content) return res.status(400).json({error:"no file"})

    const filename = randomName(ext)

    const gh = await fetch(
      `https://api.github.com/repos/${USERNAME}/${REPO}/contents/uploads/${filename}`,
      {
        method:"PUT",
        headers:{
          Authorization:`Bearer ${process.env.GITHUB_TOKEN}`,
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          message:"upload file",
          content
        })
      }
    )

    if(!gh.ok) throw await gh.text()

    const url = `${process.env.BASE_URL}/${filename}`
    res.json({status:true,url})

  }catch(e){
    res.status(500).json({status:false,error:String(e)})
  }
}
