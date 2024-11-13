interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function VerifyYourMails(props: Props) {
  const searchParams = await props.searchParams;
  const email = searchParams.email;

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div>
        <p>Un mail vous a été envoyé à l'adresse suivante: {email}</p>
      </div>
    </main>
  );
}
