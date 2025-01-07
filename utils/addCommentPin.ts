export function addCommentPin() {
    const sidebar = document.getElementById("sidebar");
    sidebar?.appendChild(document.createElement("p"));
    const comentario = document.querySelector("#sidebar p");

    if (comentario) {
        // Type assertion or check:
        if ('innerText' in comentario) {
            comentario.innerText = "Comentario";
        } else {
            console.error("Element does not have innerText property.");
        }
    } else {
        console.error("Element with selector '#sidebar p' not found.");
    }
}
