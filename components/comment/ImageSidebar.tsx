import Image from 'next/image';
import { getImageUrl } from '@/utils/getImageUrl';
import ImageSidebarProps from '@/types/ImageSidebarProps';

const ImageSidebar = ({ pages, currentPage, onPageChange }: ImageSidebarProps) => {
    return (
        <div className="w-36 bg-white border-l border-gray-200 flex flex-col">
            {/* Cabeçalho */}
            <div className="p-3 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-700">
                    Páginas ({pages.length})
                </h2>
            </div>

            {/* Lista de miniaturas */}
            <div className="flex-1 overflow-y-auto">
                {pages.map((page) => {
                    const imageUrl = getImageUrl(page.image_url);
                    const isActive = page.id === currentPage;

                    return (
                        <div
                            key={page.id}
                            className={`relative p-1.5 cursor-pointer hover:bg-gray-50 transition-colors ${isActive ? 'bg-blue-50' : ''
                                }`}
                            onClick={() => onPageChange(page.id)}
                        >
                            {/* Container para miniatura e número */}
                            <div className="relative aspect-[4/3] w-full">
                                <Image
                                    src={imageUrl}
                                    alt={`Página ${page.page_number}`}
                                    fill
                                    className="object-cover rounded shadow-sm"
                                    sizes="120px"
                                    unoptimized
                                />
                                {/* Número da página */}
                                <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded-sm">
                                    {page.page_number}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ImageSidebar; 