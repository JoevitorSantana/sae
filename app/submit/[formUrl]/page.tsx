import { GetFormContentByUrl } from "@/actions/form";
import { FormElementInstance } from "@/components/FormElements";
import FormSubmitComponent from "@/components/FormSubmitComponent";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { BsArrowBarRight, BsArrowLeft } from "react-icons/bs";

async function SubmitPage({
    params
}: {
    params: {
        formUrl: string
    }
}) {
    const { userId } = auth();

    if (!userId) {
        redirect(`/sign-in?returnUrl=submit/${params.formUrl}`);
    }

    const form = await GetFormContentByUrl(params.formUrl, userId);

    if (!form) {
        throw new Error("Formulário não encontrado!");
    }

    if (form == "answered") {
        redirect(`/`);
    }

    const formContent = JSON.parse(form.content) as FormElementInstance[];

    return (
        <div className="flex w-full flex-grow flex-col items-center">
            <FormSubmitComponent formUrl={params.formUrl} content={formContent} />
            <div className="flex justify-between">
                <Button variant={"link"} asChild>
                    <Link href={"/"} className="gap-2">
                        <BsArrowLeft />
                        Voltar à Home
                    </Link>
                </Button>
            </div>
        </div>
    );
}

export default SubmitPage;