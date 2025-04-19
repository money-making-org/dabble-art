import { Illustration, NotFound } from "@/components/not-found";

export const PostNotFound = () => {
  return (
    // make it not the entire page
    <div className="relative flex flex-col w-full justify-center min-h-[60svh] bg-background p-6 md:p-10">
      <div className="relative max-w-5xl mx-auto w-full">
        <Illustration className="absolute inset-0 w-full h-[40vh] opacity-[0.04] dark:opacity-[0.03] text-foreground" />
        <NotFound
          title="Post not found"
          description="The post you are looking for does not exist."
        />
      </div>
    </div>
  );
};
