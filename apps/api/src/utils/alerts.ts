import { GB } from "@/src/controllers/upload-controller";
import { Embed, Webhook } from "@vermaysha/discord-webhook";
import prettyBytes from "pretty-bytes";

export const sendNewArtAlert = async ({
  name,
  authorName,
  authorId,
  postStorageUsed,
  totalStorageUsed,
  postId,
  primaryFileId,
}: {
  name: string;
  authorName: string;
  authorId: string;
  postStorageUsed: number;
  totalStorageUsed: number;
  postId: string;
  primaryFileId: string;
}) => {
  if (!Bun.env.WEBHOOK_URL) {
    return;
  }

  function formatStorageMessage(amount: number): string {
    const costDollars = amount / GB * 0.015
    const format = costDollars >= 0.01 ? costDollars.toFixed(3) : `${(costDollars * 100).toFixed(5)}c`
    return `${prettyBytes(amount)} ($${format}/m)`
  }

  const webhook = new Webhook(Bun.env.WEBHOOK_URL);

  const embed = new Embed()
    .setTitle(name)
    .setAuthor({
      name: authorName,
      icon_url: `https://api.dabble.art/auth/avatar/${authorId}`,
    })
    // .setDescription(`Total storage used: ${prettyBytes(totalStorageUsed)} - Estimated Cost: ${(totalStorageUsed / GB) * 0.015}`)
    .addField({
      name: "Post Storage Used",
      value: formatStorageMessage(postStorageUsed),
      inline: true,
    })
    .addField({
      name: "Total Storage Used",
      value: formatStorageMessage(totalStorageUsed),
      inline: true,
    })
    .setColor("Green")
    .setThumbnail({
      url: `https://api.dabble.art/public/posts/${postId}/files/${primaryFileId}/preview`,
      // ex: https://api.dabble.art/public/posts/67e6bf380a68cc2792e76c17/files/67e6bf380a68cc2792e76c18/preview
    })
    .setUrl(`https://dabble.art/public/posts/${postId}`)
    .setTimestamp();

  await webhook.addEmbed(embed).send();
};
