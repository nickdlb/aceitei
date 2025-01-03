import { DeleteFile} from '@/utils/deleteFile'

export default function DeleteCardButton({id}) {
    const handleDeleteFile = async () => {
        await DeleteFile(id)
        console.log("Arquivo Removido")
    }

    return (
        <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={handleDeleteFile}>
        Deletar
        </button>
    )
}
