import { MdDeleteOutline, MdOutlinePublish } from "react-icons/md";
import { Button } from "./ui/button";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useTransition } from "react";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { DeleteForm } from "@/actions/form";

function DeleteFormBtn({id}: {id: number}) {
    const [loading, startTransition] = useTransition();
    const router = useRouter();

    async function deleteForm() {
        try {
          await DeleteForm(id);
          toast({
            title: "Successo",
            description: "Seu formulário excluído com sucesso!",
          });
          router.push('/');
        } catch (error) {
          toast({
            title: "Erro",
            description: "Ocorreu algum erro!",
          });
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={"destructive"} className="gap-2">
                    <MdDeleteOutline className="h-4 w-4" />
                    Excluir
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                Essa ação não pode ser refeita! Após a exclusão você não poderá editar o formulário. <br />
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                    disabled={loading}
                    onClick={(e) => {
                        e.preventDefault();
                        startTransition(deleteForm);
                    }}
                >
                    Excluir {loading && <FaSpinner className="animate-spin" />}
                </AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
      </AlertDialog>
    );
}

export default DeleteFormBtn;