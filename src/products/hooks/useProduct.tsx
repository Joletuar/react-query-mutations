import { useQuery } from '@tanstack/react-query';
import { productActions } from '..';

interface Options {
    id: number;
}

export const useProduct = ({ id }: Options) => {
    const {
        isLoading,
        isError,
        error,
        data: product,
        isFetching,
    } = useQuery({
        queryKey: [productActions.getProducts.name, { id }],
        queryFn: () => productActions.getProductById(id),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        error,
        isError,
        isFetching,
        isLoading,
        product,
    };
};
