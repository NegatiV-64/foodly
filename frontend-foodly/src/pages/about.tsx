import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Page } from '@/components/utility/Page';
import { getPageContent } from '@/utils/getPageContent.util';
import type { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';

const AboutPage: NextPage<AboutPageProps> = ({ pageContent, pageTitle }) => {
    return (
        <Page title={pageTitle}>
            <section className='py-10'>
                <Container className='grid grid-cols-2 gap-x-10'>
                    <div>
                        <Heading size='4xl' className='mb-5'>
                            {pageContent.title}
                        </Heading>
                        <Text size='xl' className='whitespace-pre-line leading-8 text-gray-600'>
                            {pageContent.text}
                        </Text>
                    </div>
                    <Image
                        className='h-full w-full rounded-lg object-cover'
                        width={760}
                        height={500}
                        alt='About Foodly'
                        src={'/about-us.jpg'}
                    />
                </Container>
            </section>
        </Page>
    );
};

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
    const pageContent = await getPageContent<AboutPageContent>('about');

    return {
        props: {
            pageTitle: pageContent.pageTitle,
            pageContent: pageContent.pageContent,
        },
    };
};

interface AboutPageProps {
    pageTitle: string;
    pageContent: {
        title: string;
        text: string;
    };
}

interface AboutPageContent {
    pageTitle: string;
    pageContent: {
        title: string;
        text: string;
    };
}

export default AboutPage;
