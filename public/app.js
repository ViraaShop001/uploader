async function upload(){
  const file = document.getElementById("file").files[0]
  if(!file) return alert("Pilih file dulu")

  document.getElementById("status").innerText = "Uploading..."

  const form = new FormData()
  form.append("file", file)

  const res = await fetch("/api/upload",{
    method:"POST",
    body:form
  })

  const data = await res.json()

  if(data.status){
    document.getElementById("status").innerText="Berhasil!"
    document.getElementById("link").value=data.url
  }else{
    document.getElementById("status").innerText="Gagal upload"
  }
}
