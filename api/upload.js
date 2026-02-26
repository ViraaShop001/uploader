import crypto from "crypto"

const USERNAME = "ViraaShop001"
const REPO = "uploader"
const TOKEN = "dm0SIK2U+I0f6Bx8h1b2DaE3IHyCarCN2H2lncDjmwrJTs/zeU30yklisRyV1PfJ"

function randomName(ext){
  return crypto.randomBytes(6).toString("hex") + ext
}

export const config = {
  api: { bodyParser: false }
}

export default async function handler(req,res){
  if(req.method !== "POST")
    return res.status(405).end()

  try{
    const chunks=[]
    for await (const chunk of req){
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    const match = req.headers['content-type'].match(/boundary=(.*)$/)
    const boundary = match[1]

    const parts = buffer.toString().split(boundary)
    const filePart = parts.find(p=>p.includes("filename="))

    const fileMatch = filePart.match(/filename="(.+?)"/)
    const ext = "."+fileMatch[1].split('.').pop()

    const start = filePart.indexOf("\r\n\r\n")+4
    const end = filePart.lastIndexOf("\r\n")

    const fileBuffer = Buffer.from(filePart.slice(start,end),"binary")
    const base64 = fileBuffer.toString("base64")

    const filename = randomName(ext)

    const gh = await fetch(
      `https://api.github.com/repos/${USERNAME}/${REPO}/contents/uploads/${filename}`,
      {
        method:"PUT",
        headers:{
          Authorization:`Bearer ${TOKEN}`,
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          message:"upload",
          content:base64
        })
      }
    )

    if(!gh.ok){
      const t = await gh.text()
      return res.status(500).json({status:false,error:t})
    }

    res.json({status:true,url:`https://${req.headers.host}/${filename}`})

  }catch(e){
    res.status(500).json({status:false,error:String(e)})
  }
      }
