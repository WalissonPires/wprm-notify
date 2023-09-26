import { PagedInput } from ".";

export class PagedInputExtract {

    public getFromSearchParams(params: URLSearchParams): PagedInput {

        const offset = params.get('offset') ?? '0';
        const limit = params.get('limit') ?? '100';

        const input: PagedInput = {
            offset: parseInt(offset),
            limit: parseInt(limit)
        };

        if (isNaN(input.offset))
            throw new Error('Invalid offset');

        if (isNaN(input.limit))
            throw new Error('Invalid limit');

        return input;
    }
}