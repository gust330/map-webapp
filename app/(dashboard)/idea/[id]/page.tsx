type IdeaPageProps = {
  params: Promise<{ id: string }>;
};

export default async function IdeaDetailPage({ params }: IdeaPageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-3xl space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight text-[#f5f5f5]">
        Ideia
      </h1>
      <p className="font-mono text-sm text-[#a1a1aa]">ID: {id}</p>
      <p className="text-[#a1a1aa]">
        Detalhe e chat de desenvolvimento — Sprint 4.
      </p>
    </div>
  );
}
