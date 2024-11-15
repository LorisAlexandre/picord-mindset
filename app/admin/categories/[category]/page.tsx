interface Props {
  params: Promise<{ [key: string]: string }>;
}
export default async function CategoryPage(props: Props) {
  const params = await props.params;
  const category = params.category;
  return (
    <main className="flex-1 flex items-center justify-center">{category}</main>
  );
}
