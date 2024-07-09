"use client"

import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ImSpinner2 } from "react-icons/im";
import { formSchema, formSchemaType } from "@/schemes/form";
import { toast } from "./ui/use-toast";
import { CreateForm } from "@/actions/form";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";

export default function CreateFormBtn() {
    const router = useRouter();
    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema)
    });

    async function onSubmit(values: formSchemaType) {
        try {
            const formId = await CreateForm(values);

            toast({
                title: "Sucesso",
                description: "Formulário criado com sucesso!"
            });

            console.log("Form ID", formId);
            router.push(`/builder/${formId}`);
        } catch (error) {
            toast({
                title: "Erro",
                description: "Algo de errado ocorreu!",
                variant: "destructive"
            });
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
            <Button
                variant={"outline"}
                className="group border border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4"
            >
                <BsFileEarmarkPlus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
                <p className="font-bold text-xl text-muted-foreground group-hover:text-primary">Criar novo formulário</p>
            </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Criar novo formulário</DialogTitle>
                    <DialogDescription>Criar um novo formulário para começar coletar respostas</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea rows={5} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="w-full mt-4">
                        {!form.formState.isSubmitting && <span>Salvar</span>}
                        {form.formState.isSubmitting && <ImSpinner2 className="animate-spin" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}