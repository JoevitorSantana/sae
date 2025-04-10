import { MdOutlinePublish } from "react-icons/md";
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
import { PublishForm } from "@/actions/form";

function PublishFormBtn({id}: {id: number}) {
    const [loading, startTransition] = useTransition();
    const router = useRouter();

    async function publishForm() {
        try {
          await PublishForm(id);
          toast({
            title: "Successo",
            description: "Seu formulário agora está disponível para o público!",
          });
          router.refresh();
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
                <Button className="gap-2 text-white bg-gradient-to-r from-green-900 to-green-400">
                    <MdOutlinePublish className="h-4 w-4" />
                    Publicar
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                Essa ação não pode ser refeita! Após a publicação você não poderá editar o formulário. <br />
                <br />
                <span className="font-medium">
                    Publicando este formulário, você irá disponibilizá-lo ao público para coletar respostas.
                </span>
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                disabled={loading}
                onClick={(e) => {
                    e.preventDefault();
                    startTransition(publishForm);
                }}
                >
                Confirmar {loading && <FaSpinner className="animate-spin" />}
                </AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
      </AlertDialog>
    );
}

export default PublishFormBtn;