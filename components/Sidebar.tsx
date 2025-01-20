import Link from 'next/link';
    import { formatDate } from '@/utils/formatDate';
    import { Pin } from '@/types/Pin';
    import { PencilIcon, CheckIcon, CogIcon } from '@heroicons/react/24/outline';

    interface SidebarProps {
        pins: Pin[];
        statusFilter: 'ativo' | 'resolvido';
        setStatusFilter: (status: 'ativo' | 'resolvido') => void;
        editingPinId: string | null;
        comments: {[key: string]: string};
        handleCommentChange: (pinId: string, value: string) => void;
        handleCommentSave: (pinId: string) => void;
        handleDeletePin: (pinId: string) => void;
        handleStatusChange: (pinId: string) => void;
        setEditingPinId: (pinId: string | null) => void;
        userNames: {[key: string]: string};
    }

    export default function Sidebar({
        pins,
        statusFilter,
        setStatusFilter,
        editingPinId,
        comments,
        handleCommentChange,
        handleCommentSave,
        handleDeletePin,
        handleStatusChange,
        setEditingPinId,
        userNames
    }: SidebarProps) {
        const formatDateTime = (dateString: string) => {
            const date = new Date(dateString);
            const formattedDate = formatDate(dateString);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${formattedDate} ${hours}:${minutes}`;
        };

        const handleKeyPress = async (event: React.KeyboardEvent<HTMLTextAreaElement>, pinId: string) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                await handleCommentSave(pinId);
            }
        };

        return (
            <div id="sidebar" className="w-96 bg-gray-100 border-r border-gray-300 flex flex-col h-full">
                <div className="p-4 border-b bg-white border-b-gray-300">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded"></div>
                        <div className="flex items-center justify-between flex-1">
                            <Link href="/" className="font-medium hover:text-blue-600">
                                Aceitei
                            </Link>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">Free</span>
                        </div>
                    </div>
                </div>

                <div className="px-4 py-3 bg-white border-b border-b-gray-300">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setStatusFilter('ativo')}
                            className={`px-3 py-1 rounded text-sm ${
                                statusFilter === 'ativo' 
                                    ? 'bg-yellow-500 text-white' 
                                    : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                            Ativos
                        </button>
                        <button
                            onClick={() => setStatusFilter('resolvido')}
                            className={`px-3 py-1 rounded text-sm ${
                                statusFilter === 'resolvido' 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                            Resolvidos
                        </button>
                    </div>
                </div>

                <div className="px-4 py-2 bg-white border-b border-b-gray-300">
                    <span className="font-medium">
                        Total de Comentários: {pins.length}
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh - 100px)] bg-white">
                    <div className="space-y-4">
                        {pins.sort((a, b) => a.num - b.num).map((pin) => (
                            <div key={pin.id} className="bg-white rounded-lg p-4 shadow">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-black">{pin.num}</span>
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            pin.status === 'ativo' 
                                                ? 'bg-yellow-100 text-yellow-800' 
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {pin.status === 'ativo' ? 'Ativo' : 'Resolvido'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500">
                                            {formatDateTime(pin.created_at)}
                                        </span>
                                        <button
                                            onClick={() => handleDeletePin(pin.id)}
                                            className="text-xs text-red-500 hover:text-red-700"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                                
                                {editingPinId === pin.id ? (
                                    <div>
                                        <textarea
                                            value={comments[pin.id] || ''}
                                            onChange={(e) => handleCommentChange(pin.id, e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, pin.id)}
                                            className="w-full p-2 border rounded mb-2 min-h-[60px] resize-none text-sm"
                                            placeholder="Comentário..."
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleCommentSave(pin.id)}
                                            disabled={!comments[pin.id]?.trim()}
                                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                        >
                                            Confirmar
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                          {userNames[pin.id] && (
                                            <span className="text-xs text-gray-500">
                                              {userNames[pin.id]}
                                            </span>
                                          )}
                                          <p className="text-sm text-gray-700">
                                              {pin.comment}
                                          </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingPinId(pin.id)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(pin.id)}
                                                className={`${
                                                    pin.status === 'ativo' 
                                                        ? 'text-yellow-500 hover:text-yellow-600' 
                                                        : 'text-green-500 hover:text-green-600'
                                                }`}
                                            >
                                                {pin.status === 'ativo' ? <CheckIcon className="w-4 h-4" /> : <CogIcon className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
