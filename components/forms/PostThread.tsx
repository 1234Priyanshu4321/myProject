"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { ThreadValidation } from '@/lib/validations/thread';
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Textarea } from '../ui/textarea';
import { usePathname, useRouter } from 'next/navigation';
import { updateUser } from '@/lib/actions/user.actions';
import { createThread } from '@/lib/actions/thread.actions';
import { useOrganization } from '@clerk/nextjs';

interface Props {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    btnTitle: string;
}


function PostThread({ userId }: { userId: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const { organization } = useOrganization();

    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: '',
            accountId: userId,
        }
    })

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
        if (!organization) {
            await createThread({ text: values.thread, author: userId, communityId: null, path: pathname });
        }
        else {
            await createThread({ text: values.thread, author: userId, communityId: organization.id, path: pathname });
        }
        router.push("/");
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex flex-col justify-start gap-10">
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Content
                            </FormLabel>
                            <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1' >
                                <Textarea rows={15} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' className='bg-primary-500'>
                    Post Thread
                </Button>
            </form>

        </Form>
    )
}

export default PostThread;