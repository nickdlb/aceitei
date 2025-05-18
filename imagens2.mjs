const imagens = [438690, 437654, 464264, 325562, 437248, 471975, 437798, 449000, 205737, 436271, 450722, 451404, 436723, 435817, 207157]

async function fetchObjectTitle(id) {
  const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
  const data = await response.json()
  return data;
}

async function main(imagens) {
    const novoimagens = []
    const tam = imagens.length
    for (let i = 0; i < tam; i++) {
    let data = await fetchObjectTitle(imagens[i])
    novoimagens.push(data.title)
  }
  console.log(novoimagens)
}

main(imagens)