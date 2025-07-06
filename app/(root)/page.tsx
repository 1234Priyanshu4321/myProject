// import { auth, currentUser } from '@clerk/nextjs/server'

// export default async function Page() {
//   // Get the userId from auth() -- if null, the user is not signed in
//   const { userId } = await auth()

//   // Protect the route by checking if the user is signed in
//   if (!userId) {
//     return <div>Sign in to view this page</div>
//   }

//   // Get the Backend API User object when you need access to the user's information
//   const user = await currentUser()

//   // Use `user` to render user details or create UI elements
//   return <div>Welcome, {user.firstName}!</div>
// }

import { fetchPosts } from "@/lib/actions/thread.actions";
import "../globals.css";
import { currentUser } from "@clerk/nextjs/server";
import ThreadCard from "@/components/cards/ThreadCard";


export default async function Home() {
  const result = await fetchPosts(1, 30);
  const user = await currentUser();
  console.log(result);
  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (<p className="no-result">No threads found</p>) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}

              />
            ))}
          </>
        )}
      </section>
    </>
  )
}