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
      

      

      <ChangeEmailCard />

      <ChangePasswordCard />

      {/* <ProvidersCard /> */}

      <SessionsCard />


      <DeleteAccountCard />
    </div>
  );
}
