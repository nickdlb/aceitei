import { UploadZone } from '../dashboard/upload/UploadZone';
import { Plus } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RightSidebarProps {
    onUploadComplete: (data: any) => void;
}

const RightSidebar = ({ onUploadComplete }: RightSidebarProps) => {
    const handleUploadSuccess = async (data: any) => {
        console.log('Upload success:', data);
        if (data && onUploadComplete) {
            await onUploadComplete(data);
        }
    };

    return (
        <Card className="!border-none pt-0 pb-0 w-full h-full flex flex-col rounded-none">
            <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-actextocinza mb-2">
                        Adicionar Imagens
                    </h3>
                    <UploadZone onUploadSuccess={handleUploadSuccess} />
                </div>
            </CardContent>
        </Card>
    );
};

export default RightSidebar;
