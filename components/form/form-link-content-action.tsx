import { Category, Content, Form } from "@prisma/client";
import { DynamicSearchContent } from "@/components/content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/shadcn/ui";
import { PreviousBtn } from "@/components/previous-btn";
import { addContentToForm } from "@/lib/server/content";

type FormProps = Form & { content: Content[]; category: Category };
export const FormLinkContentAction = ({ form }: { form: FormProps }) => {
  async function handleResultClick(result: Content) {
    "use server";

    await addContentToForm(form.id, result.id, form.category.title);
  }

  return (
    <Card variant={"ghost"} className="size-full flex flex-col">
      <div className="pb-2 pl-1 sticky top-4">
        <div className="flex items-center justify-between px-6 pb-2">
          <CardFooter className="p-0 gap-2">
            <PreviousBtn
              previousUrl={`/admin/categories/${form.category.title}/forms/${form.id}`}
            />
          </CardFooter>
          <CardHeader className="p-0">
            <CardTitle className="text-xl">{form.title}</CardTitle>
            <CardDescription>{form?.description}</CardDescription>
          </CardHeader>
        </div>
        <Separator />
      </div>
      <CardContent className="flex-1 pt-12 font-semibold">
        {/* Contenus liés */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h2>
              <span>Contenu(s) lié(s): </span>
              <span className="text-sm font-normal">
                ({form.content.length})
              </span>
            </h2>
          </div>
          <Separator />
          <div className="pt-1">
            <DynamicSearchContent handleResultClick={handleResultClick} />
          </div>
          <Accordion type="single" collapsible>
            {(form?.content ?? []).map((content) => (
              <AccordionItem key={content.id} value={content.id}>
                <AccordionTrigger>{content.properties.title}</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};
