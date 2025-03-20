import { useState } from 'react';
import { PlusIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface RightSidebarButtonProps {
    isRightSidebarOpen: boolean;
    toggleRightSidebar: () => void;
}

const RightSidebarButton: React.FC<RightSidebarButtonProps> = ({
    isRightSidebarOpen,
    toggleRightSidebar
}) => {
    const [isButtonHovered, setIsButtonHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsButtonHovered(true);
    };

    const handleMouseLeave = () => {
        setIsButtonHovered(false);
    };

    return (
        <button
            onClick={toggleRightSidebar}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`absolute top-1/2 -translate-y-1/2 z-10 bg-gray-200 hover:bg-blue-500 p-3 rounded-l-full transition-all duration-300`}
            style={{
                right: isRightSidebarOpen ? '0' : '0',
                transform: isRightSidebarOpen ? 'translateY(-50%)' : 'translate(-1px, -50%)',
            }}
        >
            <div className="flex items-center hover:text-white">
                {isRightSidebarOpen ? (
                    <ChevronRightIcon className="h-6 w-6 mr-2" />
                ) : (
                    <PlusIcon className="h-6 w-6 mr-2" />
                )}
                {isRightSidebarOpen ? null : isButtonHovered && <span className="text-sm">Adicionar</span>}
            </div>
        </button>
    );
};

export default RightSidebarButton;
