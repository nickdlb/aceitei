export interface UserInfoProps {
  userData: {
    nome: string;
    email: string;
  };
  onUpdateName: (newName: string) => void;
  userId: string | null;
}