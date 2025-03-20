export default interface ProfilePhotoProps {
    photoURL: string;
    onUpdatePhoto: (url: string) => void;
    userId: string | null;
  }