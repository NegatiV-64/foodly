import { readFile } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';

export const getPageContent = async <PageDataType>(pageName: string): Promise<PageDataType> => {
    const pageContentPath = join(cwd(), 'src', 'content', `${pageName}.page.json`);

    try {
        const pageContent = await readFile(pageContentPath, { encoding: 'utf-8' });

        return JSON.parse(pageContent) as PageDataType;
    } catch (error) {
        throw new Error(`Error while reading page content: ${error}. Page content path: ${pageContentPath}. Reason: ${error}`);
    }
};