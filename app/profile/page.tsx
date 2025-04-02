"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { courses } from "@/data/courses";
import { estadosBrasil } from "@/data/states";
import { formSchema } from "@/schemes/form";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-separator";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
    // username: z.string().min(2, {
    //     message: "Nome de usuário deve ter ao menos 2 caracteres.",
    // }),
    username: z.string(),
    lastname: z.string(),
    address: z.string(),
    state: z.string(),
    city: z.string(),
    course: z.string(),
    cpf: z.string(),
    phone: z.string(),
    cellphone: z.string(),
    gender: z.string(),
    birthdate: z.string()
});

export type city = {
    id: number;
    nome: string;
};

export default function ProfilePage() {
    const { user, isLoaded, isSignedIn } = useUser();
    const [selectPopulated, setSelectPopulated] = useState(false);
    const [cities, setCities] = useState<city[]>([]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username:  "",
            lastname:  "",
            address: "",
            course: "",
            cpf: "",
            phone: "",
            cellphone: "",
            gender: "",
            birthdate: ""
        }
    });

    const searchCities = async (uf: string) => {
        if (uf == "" || uf == undefined) return;

        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos`)
            .then(res => res.json())
            .then(cidades => {
                let cidadesArray: city[] = [];
                cidades.map((cid: city) => {
                    let cidade = {
                        id: cid.id,
                        nome: cid.nome,
                    };
                    cidadesArray.push(cidade);
                });

                cidadesArray.sort((a, b) => a.nome.localeCompare(b.nome));
                setCities(cidadesArray);

                setTimeout(() => {
                    form.setValue("city", user?.unsafeMetadata?.city as string || "");
                }, 1000);
            });
    }


    useEffect(() => {
        if (isLoaded && user){
            form.setValue("username", user.firstName as string || "");
            form.setValue("lastname", user.lastName as string || "");
            form.setValue("address", user.unsafeMetadata?.address as string || "");
            form.setValue("state", user.unsafeMetadata?.state as string || "");
            form.setValue("city", user.unsafeMetadata?.city as string || "");
            form.setValue("course", user.unsafeMetadata?.course as string || "");
            form.setValue("cpf", user.unsafeMetadata?.cpf as string || "");
            form.setValue("phone", user.unsafeMetadata?.phone as string || "");
            form.setValue("cellphone", user.unsafeMetadata?.cellphone as string || "");
            form.setValue("gender", user.unsafeMetadata?.gender as string || "");
            form.setValue("birthdate", user.unsafeMetadata?.birthdate as string || "");
        }
    }, [isLoaded, user]);
        

    if (!isLoaded || !isSignedIn) return null;

    if (!selectPopulated){
        form.setValue("course", user.unsafeMetadata?.course as string || "");
        form.setValue("gender", user.unsafeMetadata?.gender as string || "");
        form.setValue("state", user.unsafeMetadata?.state as string || "");
        searchCities(user.unsafeMetadata?.state as string || "");
        setSelectPopulated(true);
    }

    const handleSubmitForm = async (data: z.infer<typeof FormSchema>) => {
        await user?.update({
            unsafeMetadata: {
                ...user.unsafeMetadata,
                address: data.address,
                state: data.state,
                city: data.city,
                course: data.course,
                cpf: data.cpf,
                phone: data.phone,
                cellphone: data.cellphone,
                gender: data.gender,
                birthdate: data.birthdate
            }
        });
    }

    function onSubmit(data: z.infer<typeof FormSchema>) {
        handleSubmitForm(data);
        toast({
            title: "Salvo",
            description: "Dados enviados com sucesso!",
        });
        // toast({
        //     title: "Você enviou os seguintes valores: ",
        //     description: (
        //         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //             <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        //         </pre>
        //     )
        // });
    }

    return (
        // <div className="flex container justify-center pt-4 pb-20">
        <div className="flex w-full justify-center flex-grow">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                    <h2 className="text-4xl py-2 font-bold col-span-2">Dados do Usuário</h2>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Insira seu primeiro nome" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full md:w-2/3 px-3">
                            <FormField
                                control={form.control}
                                name="lastname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sobrenome</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Insira seu sobrenome" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/3 px-3 mb-4 md:mb-0">
                            <FormField
                                control={form.control}
                                name="cpf"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CPF</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Insira seu CPF" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="w-full md:w-1/3 px-3 mb-4 md:mb-0">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telefone(DDD e Número)</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Insira seu telefone" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="w-full md:w-1/3 px-3 mb-4 md:mb-0">
                            <FormField
                                control={form.control}
                                name="cellphone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Celular(DDD e Número)</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Insira seu número" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/3 px-3 mb-4 md:mb-0">
                            <FormField control={form.control} name="state" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estado</FormLabel>
                                    <Select onValueChange={(value) => {
                                        field.onChange(value);
                                        setCities([]);
                                        searchCities(value);
                                        form.setValue("city", "");
                                    }} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Selecione um estado..." /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {estadosBrasil.map((estado) => (
                                                <SelectItem key={estado.sigla} value={estado.sigla}>{estado.nome}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                        </div>

                        <div className="w-full md:w-2/3 px-3 mb-8 md:mb-0">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cidade</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Selecione uma cidade..." /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {cities.map((city) => (
                                                <SelectItem key={city.id} value={String(city.id)}>{city.nome}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                        </div>
                    </div>


                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Endereço</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Digite seu endereço, rua, n°, bairro..." {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/3 px-3 mb-4 md:mb-0">
                            <FormField 
                                control={form.control}
                                name="course"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Curso</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um curso..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    courses.map((curso) => (
                                                        <SelectItem key={curso.id} value={String(curso.id)}>
                                                            {curso.name}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="w-full md:w-1/3 px-3 mb-4 md:mb-0">
                            <FormField control={form.control} name="gender" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sexo</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o sexo..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="masculino">Masculino</SelectItem>
                                            <SelectItem value="feminino">Feminino</SelectItem>
                                            <SelectItem value="outro">Outro</SelectItem>
                                            <SelectItem value="nenhum">Não desejo responder</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                        </div>

                        <div className="w-full md:w-1/3 px-3 mb-4 md:mb-0">
                            <FormField control={form.control} name="birthdate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Data de Nascimento</FormLabel>
                                    <Input type="date" {...field} />
                                </FormItem>
                            )} />
                        </div>
                    </div>
                    <Button type="submit">Enviar</Button>
                </form>
            </Form>
        </div>
    );
}