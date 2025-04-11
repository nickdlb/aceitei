import { useState } from 'react';
import { Button } from "@/components/common/ui/button"
import { Plus, ChevronRight } from "lucide-react"

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
        <Button
            onClick={toggleRightSidebar}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            variant="secondary"
            className={`absolute top-1/2 -translate-y-1/2 z-10 rounded-l-full transition-all duration-300 bg-acbg hover:bg-acazul hover:textac-branco`}
            style={{
                right: isRightSidebarOpen ? '0' : '0',
                transform: isRightSidebarOpen ? 'translateY(-50%)' : 'translate(-1px, -50%)',
                padding: '0.75rem',
            }}
        >
            <div className="flex items-center">
                {isRightSidebarOpen ? (
                    <ChevronRight className="h-6 w-6 mr-2" />
                ) : (
                    <Plus className="h-6 w-6 mr-2" />
                )}
                {isRightSidebarOpen ? null : isButtonHovered && <span className="text-sm">Adicionar</span>}
            </div>
        </Button>
    );
};

export default RightSidebarButton;
