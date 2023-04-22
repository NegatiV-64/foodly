import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { Text } from '@/components/ui/Text';
import { Page } from '@/components/utility/Page';
import type { NextPage } from 'next';
import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';

const ContactPage: NextPage = () => {
    return (
        <Page title='Contacts'>
            <Section>
                <Container>
                    <div className='grid grid-cols-2 gap-x-7'>
                        <div className='rounded-lg bg-white py-8 px-4'>
                            <Heading
                                as='h2'
                                size='2xl'
                                weight='bold'
                                className='tracking-tight text-gray-900 sm:text-3xl'
                            >
                                Get in touch
                            </Heading>
                            <Text
                                size='lg'
                                weight='light'
                                className='mt-3 leading-6 text-gray-500'
                            >
                                If you have any questions or would like to get in touch, please feel free to contact us. If you would like to do it, please use the form on this page. We will get back to you as soon as possible.
                            </Text>
                            <address
                                className='mt-8 flex flex-col gap-y-3 text-base font-light not-italic text-gray-500'
                            >
                                <Text className='text-gray-500' weight='light'>
                                    Fake street 42,
                                    <br />
                                    43213 Tashkent, Uzbekistan
                                </Text>
                                <a className='flex items-center gap-1' href="tel:998991234567">
                                    <HiOutlinePhone size={25} className={'font-thin'} /> +998 99 123 45 67
                                </a>
                                <a className="flex items-center gap-1">
                                    <HiOutlineMail size={25} /> contact@foodly.com
                                </a>
                            </address>
                        </div>
                        <form className='flex flex-col gap-y-6 rounded-lg bg-white py-8 px-4'>
                            <div>
                                <input
                                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 '
                                    name='name'
                                    placeholder='Full name'
                                    type="text"
                                />
                            </div>
                            <div>
                                <input
                                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 '
                                    name='email'
                                    placeholder='Email'
                                    type="email"
                                />
                            </div>
                            <div>
                                <input
                                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 '
                                    name='phone'
                                    placeholder='Phone'
                                    type="tel"
                                />
                            </div>
                            <div>
                                <textarea
                                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 '
                                    name='message'
                                    rows={4}
                                    placeholder='Message'
                                />
                            </div>
                            <Button className='w-fit' type='submit'>
                                Send
                            </Button>
                        </form>
                    </div>
                </Container>
            </Section>
        </Page>
    );
};

export default ContactPage;