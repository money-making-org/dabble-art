export const ProfileBanner = () => {
  return (
    <div className="relative h-48 md:h-64 w-full">
      <img
        src={"https://pingcraft.io/_app/immutable/assets/banner.AzxsXaih.png"}
        alt="Profile banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
    </div>
  );
};
