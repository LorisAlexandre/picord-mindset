import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/shadcn/ui";
import { getFormById } from "@/lib/server/form";
import { cn } from "@/lib/utils";
import { Content, Form, Question } from "@prisma/client";
import { LinkIcon, Plus, SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ [key: string]: string }>;
}
type FormProps = Form & { question: Question[] } & { content: Content[] };
export default async function FormPage(props: Props) {
  const params = await props.params;
  const formId = params.form;

  const form = (await getFormById(formId, {
    question: {
      include: {
        answerOption: true,
      },
    },
    content: true,
  })) as FormProps;

  if (form === null) {
    return notFound();
  }

  return (
    <main className={cn("flex-1 grid grid-cols-1 gap-x-1 pl-4")}>
      <Card variant={"ghost"} className="size-full flex flex-col">
        <div className="pb-2 sticky top-4">
          <div className="flex items-center justify-between px-6 pb-2">
            <CardHeader className="p-0">
              <CardTitle className="text-xl">{form.title}</CardTitle>
              <CardDescription>{form?.description}</CardDescription>
            </CardHeader>
            <CardFooter className="p-0 gap-2">
              <Button asChild>
                <Link href={`/admin/forms/${form.id}/actions/link-content`}>
                  <LinkIcon /> Associer contenu(s)
                </Link>
              </Button>
              <Button variant={"secondary"} asChild>
                <Link href={`/admin/forms/${form.id}/actions/edit`}>
                  <SquarePen /> Modifier
                </Link>
              </Button>
              <Button variant={"destructive"} asChild>
                <Link href={`/admin/forms/${form.id}/actions/delete`}>
                  <Trash2 /> Supprimer
                </Link>
              </Button>
            </CardFooter>
          </div>
          <Separator />
        </div>
        <CardContent className="flex-1 pt-12 font-semibold grid grid-cols-[1fr_1px_1fr] gap-x-4">
          {/* Questions */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h2>
                <span>Question(s): </span>
                <span className="text-sm font-normal">
                  ({form.question.length})
                </span>
              </h2>
              <div>
                <Button variant={"secondary"} asChild>
                  <Link href={`/admin/forms/${form.id}/actions/edit`}>
                    <Plus /> Ajouter une question
                  </Link>
                </Button>
              </div>
            </div>
            <Separator />
            <Accordion type="single" collapsible>
              {(form.question ?? []).map((q) => (
                <AccordionItem key={q.id} value={q.id}>
                  <AccordionTrigger>
                    {q.qText} - {q.qType}
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <Separator orientation="vertical" />

          {/* Contenus liés */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h2>
                <span>Contenu(s) lié(s): </span>
                <span className="text-sm font-normal">
                  ({form.content.length})
                </span>
              </h2>
              <Button variant={"secondary"} asChild>
                <Link href={`/admin/forms/${form.id}/actions/link-content`}>
                  <LinkIcon /> Associer contenu(s)
                </Link>
              </Button>
            </div>
            <Separator />
            <Accordion type="single" collapsible>
              {(form?.content ?? []).map((content) => (
                <AccordionItem key={content.id} value={content.id}>
                  <AccordionTrigger>
                    {content.properties.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
