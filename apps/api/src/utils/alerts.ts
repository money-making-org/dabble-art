import { GB } from "@/src/controllers/upload-controller";
import { Embed, Webhook } from "@vermaysha/discord-webhook";
import prettyBytes from "pretty-bytes";

export const sendNewArtAlert = async ({
  name,
  authorName,
  authorId,
  totalStorageUsed,
  postId,
  primaryFileId,
}: {
  name: string;
  authorName: string;
  authorId: string;
  totalStorageUsed: number;
  postId: string;
  primaryFileId: string;
}) => {
  if (!Bun.env.WEBHOOK_URL) {
    return;
  }

  const webhook = new Webhook(Bun.env.WEBHOOK_URL);

  const embed = new Embed()
    .setTitle(name)
    .setAuthor({
      name: authorName,
      icon_url: `https://api.dabble.art/auth/avatar/${authorId}`,
    })
    // 0.0015 per GB
    // .setDescription(`Total storage used: ${prettyBytes(totalStorageUsed)} - Estimated Cost: ${(totalStorageUsed / GB) * 0.015}`)
    .addField({
      name: "Total Storage Used",
      value: prettyBytes(totalStorageUsed),
      inline: true,
    })
    .addField({
      name: "Estimated Cost",
      value: `$${(totalStorageUsed / GB) * 0.015}`,
      inline: true,
    })
    .setColor("Green")
    .setThumbnail({
      url: `https://api.dabble.art/public/posts/${postId}/files/${primaryFileId}/preview`,
      // ex: https://api.dabble.art/public/posts/67e6bf380a68cc2792e76c17/files/67e6bf380a68cc2792e76c18/preview
    })
    .setTimestamp();

  await webhook.addEmbed(embed).send();
};
