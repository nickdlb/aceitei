import { useState } from 'react';
import { X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import AuthPopupProps from '@/types/AuthPopupProps';

const AuthPopup = ({ isOpen, onClose, onSubmit }: AuthPopupProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Identifique-se para comentar</DialogTitle>
                    <DialogDescription>
                        Para manter a qualidade das discussões e facilitar o acompanhamento dos comentários,
                        precisamos saber quem você é.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={async (e: React.FormEvent) => {
                        e.preventDefault();
                        setLoading(true);
                        setError('');

                        try {
                            await onSubmit(name, email);
                            onClose();
                        } catch (error: any) {
                            setError(error.message || 'Erro ao salvar suas informações. Tente novamente.');
                        } finally {
                            setLoading(false);
                        }
                    }}
                    className="grid gap-4 py-4"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            maxLength={30} // Limit name length
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {error && (
                        <div className="text-sm text-red-600">
                            {error}
                        </div>
                    )}
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Salvando...' : 'Continuar'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AuthPopup;
