"use client";

import { ElementsType, FormElement, FormElementInstance } from "../FormElements";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import useDesigner from "../hooks/useDesigner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { BsTextParagraph } from "react-icons/bs";
import { Textarea } from "../ui/textarea";

const type: ElementsType = "ParagraphField";

const extraAttributes = {
    text: "Texto aqui",
};

const propertiesSchema = z.object({
    text: z.string().min(2).max(200)
});

export const ParagraphFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes,
    }),
    designerBtnElement: {
        icon: BsTextParagraph,
        label: "Parágrafo",
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    validate: () => true
};

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes
};

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;


function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const element = elementInstance as CustomInstance;
  
    const { title } = element.extraAttributes;
    return <p className="text-xl">{title}</p>;
}
  

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const element = elementInstance as CustomInstance;
    const { updateElement } = useDesigner();
    const form = useForm<propertiesFormSchemaType>({
      resolver: zodResolver(propertiesSchema),
      mode: "onBlur",
      defaultValues: {
        text: element.extraAttributes.title,
      },
    });
  
    useEffect(() => {
      form.reset(element.extraAttributes);
    }, [element, form]);
  
    function applyChanges(values: propertiesFormSchemaType) {
      const { text } = values;
      updateElement(element.id, {
        ...element,
        extraAttributes: {
          text,
        },
      });
    }
  
    return (
      <Form {...form}>
        <form
          onBlur={form.handleSubmit(applyChanges)}
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="space-y-3"
        >
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                    <Textarea
                        rows={5}
                        {...field}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") e.currentTarget.blur();
                        }}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  }

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const element = elementInstance as CustomInstance;
    const { text } = element.extraAttributes;
    return (
      <div className="flex flex-col gap-2 w-full">
        <Label className="text-muted-foreground">Campo de Parágrafo</Label>
        <p className="text-xl">{text}</p>
      </div>
    );
}