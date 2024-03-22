import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, productActions } from '..';

export const useProductMutation = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: productActions.createProduct,
        onSuccess: (data) => {
            // se ejecuta cuando la mutacion se ha completado con exito
            console.log(console.log('Product created'));

            // invalidamos la cache de productos para que se vuelva a hacer la peticion y se actualice la lista
            // queryClient.invalidateQueries({
            //     queryKey: ['products', { filterKey: data.category }],
            // });

            // seteamos la cache de productos con los valores anteriores mas el nuevo producto
            // esto nos permite reflejar en la ui de forma inmediata el nuevo producto
            queryClient.setQueryData<Product[]>(
                ['products', { filterKey: data.category }],
                (old) => (old ? [...old, data] : [data])
            );
        },
        onError: (error) => {
            // se ejecuta cuando la mutacion se ha completado con error
            console.log('Product error', error);
        },
        onSettled: () => {
            // se ejecuta cuando la mutacion se ha completado (ya sea con exito o con error)
            console.log('Product mutation settled');
        },
    });

    return mutation;
};
