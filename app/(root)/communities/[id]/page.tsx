import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { currentUser } from "@clerk/nextjs/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { communityTabs } from "@/constants";
import ThreadsTab from "@/components/shared/ThreadsTaab";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import UserCard from "@/components/cards/UserCard";


async function Page({ params }: { params: { id: string } }) {
    const user = await currentUser();
    if (!user) return null;
    const communityDetails = await fetchCommunityDetails(params.id);
    return (
        <section>
            <ProfileHeader
                accountId={communityDetails.id}
                authUserId={user.id}
                name={communityDetails.name}
                username={communityDetails.username}
                imgUrl={communityDetails.image}
                bio={communityDetails.bio}
                type="Community"
            />

            <div className="mt-9">
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                        {communityTabs.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.value} className="tab">
                                <Image src={tab.icon} alt={tab.label} width={24} height={24} className="object-contain" />
                                <p className="max-sm:hidden">{tab.label}</p>
                                {tab.label == 'Threads' && (
                                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                        {communityDetails?.threads?.length}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <TabsContent value="threads" className="w-full text-light-1">
                        <ThreadsTab cUserId={user.id} accId={communityDetails._id} accType="Community" />
                    </TabsContent>
                    <TabsContent value="members" className="w-full text-light-1">
                        <section className="flex flex-col mt-9 gap-10">
                            {communityDetails?.members.map((member: any) => (
                                <UserCard
                                    key={member.id}
                                    id={member.id}
                                    name={member.name}
                                    username={member.username}
                                    imgUrl={member.image}
                                    type="User"
                                />
                            ))}
                        </section>
                    </TabsContent>
                    <TabsContent value="requests" className="w-full text-light-1">
                        <ThreadsTab cUserId={user.id} accId={communityDetails._id} accType="Community" />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}

export default Page;