import { getFormsByCategory } from "@/lib/server/form";

interface Props {
  params: Promise<{ [key: string]: string }>;
}
export default async function FormPage(props: Props) {
  const params = await props.params;
  const category = params.category;

  const forms = await getFormsByCategory(category);

  return (
    <main className="flex-1 flex items-center justify-center">
      {forms.map((f) => f.title)}
    </main>
  );
}
