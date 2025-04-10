import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Uploadzone(){
    return(
        <div>
            <Input
              type="text"
              className="text-sm text-acpreto rounded-xl font-medium !leading-8 !ring-0 flex-1"
              autoFocus
            />
            <Button/>
        </div>
    )
}