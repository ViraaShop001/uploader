async function upload(){
  const file = document.getElementById("file").files[0]
  if(!file) return alert("Pilih file")

  document.getElementById("status").innerText="Uploading..."

  const reader = new FileReader()
  reader.readAsDataURL(file)

  reader.onload = async ()=>{
    const base64 = reader.result.split(',')[1]
    const ext = "."+file.name.split('.').pop()

    const res = await fetch("/api/upload",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({content:base64,ext})
    })

    const data = await res.json()

    if(data.status){
      document.getElementById("status").innerText="Berhasil!"
      document.getElementById("link").value=data.url
    }else{
      document.getElementById("status").innerText="Gagal upload"
    }
  }
}
