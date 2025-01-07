import { DeleteFile } from '@/utils/deleteFile';
    import { TrashIcon } from '@heroicons/react/24/outline';
    import { useState, useEffect } from 'react';
    import loadPins from '@/utils/loadPins';

    export default function DeleteCardButton({ id, onDelete, onModalOpen, onModalClose }) {
      const [showConfirmation, setShowConfirmation] = useState(false);
      const [deleteComments, setDeleteComments] = useState(false);
      const [commentCount, setCommentCount] = useState(0);

      useEffect(() => {
        const fetchCommentCount = async () => {
          if (id) {
            const pins = await loadPins(id);
            if (pins) {
              setCommentCount(pins.length);
            }
          }
        };

        if (showConfirmation) {
          fetchCommentCount();
        }
      }, [showConfirmation, id]);

      const handleDeleteFile = () => {
        setShowConfirmation(true);
        onModalOpen();
      };

      const confirmDelete = async () => {
        try {
          await DeleteFile(id, deleteComments);
          onDelete(id);
          console.log('Arquivo Removido');
        } catch (error) {
          console.error("Erro ao deletar card:", error);
        } finally {
          setShowConfirmation(false);
          onModalClose();
        }
      };

      const cancelDelete = () => {
        setShowConfirmation(false);
        onModalClose();
      };

      const handleCheckboxChange = (e) => {
        setDeleteComments(e.target.checked);
      };

      const getCommentText = () => {
        if (commentCount === 0) {
          return "";
        } else if (commentCount === 1) {
          return `1 comentário será deletado`;
        } else {
          return `${commentCount} comentários serão deletados`;
        }
      };

      return (
        <>
          <button className="bg-transparent hover:bg-red-100 p-1 rounded-full" onClick={handleDeleteFile}>
            <TrashIcon className="h-4 w-4 text-black" />
          </button>

          {showConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={cancelDelete}>
              <div className="bg-white rounded-lg shadow p-6 w-80" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Deletar Card</h3>
                  <button onClick={cancelDelete} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-4">Atenção, esta ação não pode ser desfeita</p>
                {commentCount > 0 && (
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="deleteComments"
                      checked={deleteComments}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    <label htmlFor="deleteComments" className="text-sm">
                      {getCommentText()}
                    </label>
                  </div>
                )}
                <div className="flex justify-end mt-4 gap-2">
                  <button
                    onClick={cancelDelete}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className={`bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded ${commentCount > 0 && !deleteComments ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={commentCount > 0 && !deleteComments}
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }
