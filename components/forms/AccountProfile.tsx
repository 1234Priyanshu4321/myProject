"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from '@/lib/validations/user';
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing'
import { usePathname, useRouter } from 'next/navigation';
import { updateUser } from '@/lib/actions/user.actions';

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
const AccountProfile = ({ user, btnTitle }: Props) => {
    const [files, setfiles] = useState<File[]>([])
    const { startUpload } = useUploadThing("media");
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(UserValidation),
        defaultValues: {
            profile_pic: user?.image || "",
            name: user?.name || "",
            username: user?.username || "",
            bio: user?.bio || ""
        }
    })

    const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault();
        const fileReader = new FileReader();
        if (e.target.files && e.target.files.length >= 1) {
            const file = e.target.files[0];
            setfiles(Array.from(e.target.files));
            if (!file.type.includes('image')) return;
            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || '';
                fieldChange(imageDataUrl);
            }
            fileReader.readAsDataURL(file);
        }
    }

    const onSubmit = async (values: z.infer<typeof UserValidation>) => {
        const blob = values.profile_pic;
        const cimg = isBase64Image(blob);
        if (cimg) {
            const res = await startUpload(files);
            if (res && res[0].ufsUrl) {
                values.profile_pic = res[0].ufsUrl;;
            }
        }
        await updateUser({
            username: values.username,
            name: values.name,
            bio: values.bio,
            image: values.profile_pic,
            userId: user.id,
            path: pathname
        });
        if (pathname === '/profile/edit') router.back();
        else router.push('/');

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
                <FormField
                    control={form.control}
                    name="profile_pic"
                    render={({ field }) => (
                        <FormItem className='flex items-center gap-4'>
                            <FormLabel className='account-form_image-label'>
                                {field.value ? (
                                    <Image src={field.value} alt='profile pic' width={96} height={96} priority className='rounded-full object-contain' />
                                ) : (
                                    <Image src="/assets/profile.svg" alt='profile pic' width={96} height={96} priority className='object-contain' />

                                )}
                            </FormLabel>
                            <FormControl className='flex-1 text-base-semibold text-gray-200'>
                                <Input type='file' accept='image/*' placeholder='Upload photo' className='account-form_image-input' onChange={(e) => handleImage(e, field.onChange)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input className='account-form_input no-focus' {...field} type='text' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Username
                            </FormLabel>
                            <FormControl>
                                <Input className='account-form_input no-focus' {...field} type='text' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Bio
                            </FormLabel>
                            <FormControl>
                                <Textarea className='account-form_input no-focus' {...field} type='text' rows={10} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className='bg-primary-500' >Submit</Button>
            </form>
        </Form>
    )
}

export default AccountProfile;