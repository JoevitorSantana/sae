import { HiSaveAs } from "react-icons/hi";
import { Button } from "./ui/button";
import useDesigner from "./hooks/useDesigner";
import { UpdateFormContent } from "@/actions/form";
import { toast } from "./ui/use-toast";
import { useTransition } from "react";
import { FaSpinner } from "react-icons/fa";

function SaveFormBtn({id}: {id: number}) {

    const { elements } = useDesigner();
    const [loading, startTransition] = useTransition();

    const updateFormContent = async () => {
        try {
             const JsonElements = JSON.stringify(elements);

             await UpdateFormContent(id, JsonElements);

             toast({
                title: 'Sucesso',
                description: 'Seu formulário foi salvo!',
             });
        } catch (error) {
            toast({
                title: 'Erro',
                description: 'Algo de errado ocorreu!',
                variant: 'destructive'
             });
        }
    }

    return (
        <Button
            variant={"outline"}
            className="gap-2"
            disabled={loading}
            onClick={() => {
                startTransition(updateFormContent);
            }}
        >
            <HiSaveAs className="h-4 w-4"/>
            Salvar
            {loading && <FaSpinner className="animate-spin"/>}
        </Button>
    );
}

export default SaveFormBtn;