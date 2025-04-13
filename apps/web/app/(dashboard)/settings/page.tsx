import {
  UpdateAvatarCard,
  UpdateNameCard,
  UpdateUsernameCard,
  ChangeEmailCard,
  ChangePasswordCard,
  ProvidersCard,
  SessionsCard,
  DeleteAccountCard,
  UpdateFieldCard,
} from "@daveyplate/better-auth-ui";

export default function CustomSettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto py-12 px-4">
      <UpdateAvatarCard
        classNames={{
          avatar: {
            base: "cursor-pointer",
          },
        }}
      />

      <UpdateNameCard />

      <UpdateUsernameCard />

      <ChangeEmailCard />

      <ChangePasswordCard />

      {/* <ProvidersCard /> */}

      <SessionsCard />

      <UpdateFieldCard
        field="bio"
        label="Bio"
        description="Update your bio"
        placeholder="Enter your bio"
        type="string"
      />

      <DeleteAccountCard />
    </div>
  );
}
