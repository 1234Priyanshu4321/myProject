import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props {
    cUserId: string;
    accId: string;
    accType: string;
}

const ThreadsTab = async ({ cUserId, accId, accType }: Props) => {
    let result = await fetchCommunityPosts(accId);
    if (accType === "Community") result = await fetchCommunityPosts(accId);
    else result = await fetchUserPosts(accId);

    if (!result) redirect('/');

    return (
        <section className="flex flex-col mt-9 col-10">
            {result.threads.map((thread: any) => (
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={cUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={
                        accType === 'User'
                            ? { name: result.name, image: result.image, id: result.id }
                            : { name: thread.author.name, image: thread.author.image, id: thread.author.id }
                    }
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                    isComment
                />
            ))}
        </section>
    )
}

export default ThreadsTab;