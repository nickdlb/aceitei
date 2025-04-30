import { UploadZone } from '@/components/dashboard/header/UploadZone';
import { Card, CardContent } from "@/components/common/ui/card"
import SiteUpload from "@/components/dashboard/header/SiteUpload"

interface PopupUploadProps {
    onUploadComplete: (data: any) => void;
}

const PopupUpload = ({ onUploadComplete }: PopupUploadProps) => {
    const handleUploadSuccess = async (data: any) => {
        console.log('Upload success:', data);
        if (data && onUploadComplete) {
            await onUploadComplete(data);
        }
    };

    return (
        <Card className="!border-none pt-0 pb-0 w-full h-full flex flex-col rounded-none">
            <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="mb-4 space-y-2">
                    <div>
                        <p className="text-sm font-medium text-actextocinza mb-2">Adicionar Site</p>
                        <SiteUpload />
                    </div>
                    <p className="text-sm font-medium text-actextocinza mb-2"> ou </p>
                    <div>
                        <p className="text-sm font-medium text-actextocinza mb-2">Adicionar Imagens</p>
                        <UploadZone onUploadSuccess={handleUploadSuccess} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PopupUpload;
