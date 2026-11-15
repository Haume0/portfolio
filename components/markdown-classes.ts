// Neden: Site renderer'ı ve editör aynı blokları aynı görünümle göstermeli; sınıflar tek yerde tutulur.
export const markdownClasses = {
  root: "space-y-5 max-w-4xl mx-auto p-6",
  heading: {
    1: "text-3xl sm:text-4xl font-extrabold text-milk mb-6 mt-8 first:mt-0 leading-tight",
    2: "text-2xl sm:text-3xl font-bold text-milk mb-4 mt-6 first:mt-0 leading-tight",
    3: "text-xl sm:text-2xl font-bold text-milk mb-3 mt-5 first:mt-0 leading-snug",
    4: "text-lg sm:text-xl font-semibold text-milk mb-2 mt-4 first:mt-0 leading-snug",
    5: "text-base sm:text-lg font-medium text-milk mb-2 mt-3 first:mt-0 leading-normal",
    6: "text-base sm:text-lg text-milk/90 mb-2 mt-3 first:mt-0 leading-normal",
  },
  paragraph: "text-milk/80 text-base sm:text-lg leading-relaxed mb-4",
  italic: "text-milk/90 italic",
  bold: "text-milk font-bold",
  strike: "text-milk/60 line-through",
  link: "text-works underline decoration-works/40 underline-offset-2 hover:decoration-works transition-colors",
  code: "bg-about/20 text-works px-2 py-0.5 rounded-md text-[0.9em] font-mono border border-about/30",
  codeBlock:
    "rounded-xl bg-dark p-4 overflow-x-auto text-sm font-mono leading-relaxed mb-4",
  blockquote:
    "border-l-4 bg-works/10 border-works text-milk/90 pl-6 py-3 my-4 rounded-r-xl backdrop-blur-sm",
  bulletList:
    "text-milk/80 leading-relaxed list-disc pl-6 space-y-1 marker:text-works marker:text-lg mb-4",
  orderedList:
    "text-milk/80 leading-relaxed list-decimal pl-6 space-y-1 mb-4 marker:text-works marker:font-bold",
  listItem: "text-milk/90 leading-relaxed py-1",
  taskItem: "text-milk/90 leading-relaxed py-1 [&>ul]:pl-4 [&>ul]:mt-1.5",
  image: "rounded-xl max-w-full h-auto my-4",
  horizontalRule: "border-0 border-t-2 border-milk/10 my-8",
  callout: {
    container:
      "relative overflow-hidden bg-dark flex gap-3 rounded-2xl p-6 contain-content items-start justify-start",
    iconBackground:
      "absolute pointer-events-none inset-0 text-[20rem] *:size-full opacity-20 scale-900 blur-xl flex items-center justify-center",
    icon: "shrink-0 relative text-3xl leading-none",
    content:
      "relative flex-1 w-full h-max *:first:mt-0 *:last:mb-0 [&>p]:leading-relaxed",
  },
};
