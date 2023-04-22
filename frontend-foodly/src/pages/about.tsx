import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { Text } from '@/components/ui/Text';
import { Page } from '@/components/utility/Page';
import type { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';

const AboutPage: NextPage<AboutPageProps> = ({ pageContent, pageTitle }) => {
    return (
        <Page title={pageTitle}>
            <Section>
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
            </Section>
        </Page>
    );
};

export const getStaticProps: GetStaticProps<AboutPageProps> = () => {
    const pageContent = {
        pageTitle: 'About Us',
        pageContent: {
            title: 'About Foodly',
            text: 'Foodly was founded in 2017 by a group of friends who wanted to make it easier to find and order food.We are a team of passionate professionals who love to cook and provide great service.We are based in the Tashkent, Uzbekistan.\n Now, we are among the top 10 food delivery services in the country.We are constantly working to improve our service and make it more convenient for our customers.We are always happy to hear your feedback and suggestions.\n In our plans for the future, we are planning to expand our service to other cities in Uzbekistan. We are also working on the development of our AI chat assistan. We are always happy to hear your feedback and suggestions. In our plans for the future, we are planning to expand our service to other cities in Uzbekistan. We are also working on the development of our mobile application.'
        }
    };

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

export default AboutPage;
