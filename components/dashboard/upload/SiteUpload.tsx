import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SiteUpload() {
    const handleUploadSite = () => {
        console.log("Enviando Site para upload")
    }

    return(
        <div className="flex gap-2">
            <Input
              type="text"
              className="text-sm text-acpreto rounded-xl font-medium !leading-8 !ring-0"
              autoFocus
            />
            <Button className='!text-xs h-8 px-4 bg-acazul opacity-100 disabled:bg-acazul text-acbrancohover'
            onClick={handleUploadSite}>
            Enviar
          </Button>
        </div>
    )
}