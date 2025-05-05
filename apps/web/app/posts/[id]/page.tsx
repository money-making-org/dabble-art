import {api} from "@workspace/eden";
import ArtPiecePage from "./ArtPiecePage";
import {Metadata} from "next";
import {getPreviewURL} from "@/hooks/use-preview";

export async function generateMetadata({ params }): Promise<Metadata> {
    const postId = (await params).id as string;
    const { data } = await api.public.posts({ id: postId }).get()

    if (data == null) {
        return {
            title: "Dabble Art"
        }
    }

    const primaryImageURL = getPreviewURL(postId, data.files[0]._id)

    return {
        title: data.name,
        description: data.description,
        keywords: [...data.tags],
        openGraph: {
            title: data.name,
            description: data.description,
            url: `https://dabble.art/posts/${postId}`,
            images: [
                {
                    url: primaryImageURL
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: data.name,
            description: data.description,
            images: [primaryImageURL],
        },
    };
}

export default function Page() {
    return (
        <div>
            <ArtPiecePage />
        </div>
    )
}
