import Image from 'next/image';
import { getImageUrl } from '@/utils/getImageUrl';
import { ImageSidebarProps } from '@/types';

const ImageSidebar = ({ pages, currentPage, onPageChange }: ImageSidebarProps) => {
    return (
        <div className="w-36 bg-acbgbranco flex flex-col">
            <div className="p-4 h-14 items-center">
                <h2 className="text-sm font-semibold text-actextocinza">
                    Páginas ({pages.length})
                </h2>
            </div>
            <div className="pt-2 pr-2 pl-2 flex-1 overflow-y-auto space-y-2">
                {pages.map((page) => {
                    const imageUrl = getImageUrl(page.image_url);
                    const isActive = page.id === currentPage;
                    return (
                        <div
                            key={page.id}
                            className={`relative rounded cursor-pointer hover:bg-acbg transition-colors ${isActive ? 'bg-actextocinza' : ''
                                }`}
                            onClick={() => onPageChange(page.id)}
                        >
                            <div className="relative aspect-[4/3] w-full">
                                <Image
                                    src={imageUrl}
                                    alt={`Página ${page.page_number}`}
                                    fill
                                    className="object-cover rounded-md shadow-sm"
                                    sizes="120px"
                                    unoptimized
                                />
                                <div className="absolute top-1 right-1 bg-acpreto bg-opacity-50 text-acbranco text-xs px-1.5 py-0.5 rounded-sm">
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