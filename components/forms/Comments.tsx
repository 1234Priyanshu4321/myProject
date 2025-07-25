"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentValidation } from '@/lib/validations/thread';
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from '../ui/input';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { addCommentToThread } from '@/lib/actions/thread.actions';
//import { updateUser } from '@/lib/actions/user.actions';
//import { createThread } from '@/lib/actions/thread.actions';

interface Props {
    threadId: string;
    cUserImg: string;
    cUserId: string;
}

const Comment = ({ threadId, cUserImg, cUserId }: Props) => {
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToThread(threadId, values.thread, JSON.parse(cUserId), pathname);
        form.reset();
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className='flex gap-3 w-full items-center'>
                            <FormLabel>
                                <Image src={cUserImg} alt='Profile Image' width={48} height={48} className='rounded-full' />
                            </FormLabel>
                            <FormControl className='border-none bg-transparent' >
                                <Input type='text' placeholder='Comment...' className='no-focus text-light-1 outline-none' {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type='submit' className='comment-form_btn'>
                    Reply
                </Button>
            </form>

        </Form>
    )
}

export default Comment;