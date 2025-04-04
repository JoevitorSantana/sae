"use client";

import { Form } from "@prisma/client";
import PreviewDialogBtn from "./PreviewDialogBtn";
import SaveFormBtn from "./SaveFormBtn";
import PublishFormBtn from "./PublishFormBtn";
import Designer from "./Designer";
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import DragOverlayWrapper from "./DragOverlayWrapper";
import { useEffect, useState } from "react";
import useDesigner from "./hooks/useDesigner";
import { ImSpinner2 } from "react-icons/im";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import Link from "next/link";
import { BsArrowBarRight, BsArrowLeft } from "react-icons/bs";
import Confetti from "react-confetti";
import DeleteFormBtn from "./DeleteFormBtn";

function FormBuilder({ form }: { form: Form }) {

    const { setElements, setSelectedElement } = useDesigner();
    const [isReady, setIsReady] = useState(false);

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
          distance: 10,
        },
    });
    
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 300,
            tolerance: 5,
        },
    });

    const sensors = useSensors(mouseSensor, touchSensor);

    useEffect(() => {
        if (isReady) return;
        const elements = JSON.parse(form.content);
        setElements(elements);
        setSelectedElement(null);
        const readyTimeout = setTimeout(() => setIsReady(true), 500);
        return () => clearTimeout(readyTimeout);
    }, [form, setElements, isReady, setSelectedElement]);

    if (!isReady) {
        return (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <ImSpinner2 className="animate-spin h-12 w-12" />
          </div>
        );
    }

    const shareUrl = `${window.location.origin}/submit/${form.shareURL}`;

    if (form.published) {
        return (
          <>
            <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={1000} />
            <div className="flex flex-col items-center justify-center h-full w-full">
              <div className="max-w-md">
                <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">
                  🎊🎊 Publicado! 🎊🎊
                </h1>
                <h2 className="text-2xl">Compartilhe o formulário!</h2>
                <h3 className="text-xl text-muted-foreground border-b pb-10">
                  Qualquer pessoa com este link pode visualizar e responder o formulário
                </h3>
                <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
                  <Input className="w-full" readOnly value={shareUrl} />
                  <Button
                    className="mt-2 w-full"
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      toast({
                        title: "Copiado!",
                        description: "Link copiado para área de transferência!",
                      });
                    }}
                  >
                    Copiar link
                  </Button>
                </div>
                <div className="flex justify-between">
                  <Button variant={"link"} asChild>
                    <Link href={"/"} className="gap-2">
                      <BsArrowLeft />
                      Voltar à Home
                    </Link>
                  </Button>
                  <Button variant={"link"} asChild>
                    <Link href={`/forms/${form.id}`} className="gap-2">
                      Ver detalhes do formulário
                      <BsArrowBarRight />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </>
        );
    }

    return (
        <DndContext sensors={sensors}>
            <main className="flex flex-col w-full">
                <nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
                    <h2 className="truncate font-medium">
                        <span className="text-muted-foreground mr-2">Formulário:</span>
                        {form.name}
                    </h2>
                    <div className="flex items-center gap-2">
                        <PreviewDialogBtn />
                        {!form.published && (
                        <>
                            <DeleteFormBtn id={form.id} />
                            <SaveFormBtn id={form.id} />
                            <PublishFormBtn id={form.id} />
                            <Button asChild>
                              <Link href={"/"}>
                                <BsArrowLeft />
                                Voltar à Home
                              </Link>
                            </Button>
                        </>
                        )}
                    </div>
                </nav>
                <div className="flex w-full flex-grow items-center justify-center relative overflow-y-auto h-[200px] bg-accent">
                <Designer />
                </div>
            </main>
            <DragOverlayWrapper />
        </DndContext>
    );
}

export default FormBuilder;