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
        <Card className="w-full h-full flex flex-col">
            <CardHeader className="p-4 border-b">
                <CardTitle className="font-medium">Fazer Upload</CardTitle>
                <Button variant="ghost" className="p-2 rounded-full transition-colors flex items-center">
                    <Plus className="text-gray-600" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Adicionar Imagens
                    </h3>
                    <UploadZone onUploadSuccess={handleUploadSuccess} />
                </div>
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">
                        Uploads Recentes
                    </h3>
                    {/* Lista de uploads recentes aqui */}
                </div>
            </CardContent>
        </Card>
    );
};

export default RightSidebar;
