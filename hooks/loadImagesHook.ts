import { useState, useEffect } from "react";
import { loadImages } from '@/utils/loadImages';

const useLoadImages = () => {
    const [imagens, setImagens] = useState([]);

    useEffect( () => {
    const fetchImages = async () => {
        const imagensDownload:any = await loadImages();
        console.log("Estas são as", imagensDownload);
        setImagens(imagensDownload);
    };

    fetchImages();
    }, []);

    return {imagens}
}

export default useLoadImages
