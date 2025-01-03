export function addCommentPin() {
    const sidebar = document.getElementById("sidebar");
    sidebar?.appendChild(document.createElement("p"));    
    const comentario = document.querySelector("#sidebar p")
    comentario.innerText = "Comentario"
}
