export const ContentWidget = async () => {
  const content = await Array.from({ length: 5 }).map((_, i) => String(i));

  return <div>{content}</div>;
};
