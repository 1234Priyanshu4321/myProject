import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { profileTabs } from "@/constants";
import ThreadsTab from "@/components/shared/ThreadsTaab";
import UserCard from "@/components/cards/UserCard";


async function Page() {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding');

    const result = await fetchUsers({
        userId: user.id,
        searchString: '',
        pgNo: 1,
        pgSize: 25
    });

    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>
            <div className="flex flex-col mt-14 gap-9">
                {result.users.length === 0 ? (
                    <p className="no-result">No Users</p>
                ) : (
                    <>
                        {result.users.map((person) => (
                            <UserCard
                                key={person.id}
                                id={person.id}
                                name={person.name}
                                username={person.username}
                                imgUrl={person.image}
                                type='User'
                            />
                        ))}
                    </>
                )}
            </div>
        </section>
    )
}

export default Page;