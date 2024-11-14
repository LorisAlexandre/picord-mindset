interface Props {
  params: Promise<{ [key: string]: string }>;
}
export default async function CategoryActionPage(props: Props) {
  const params = await props.params;
  const action = params.action;
  const category = params.category;
  return (
    <main className="flex-1 flex items-center justify-center">
      {category} {action}
    </main>
  );
}
