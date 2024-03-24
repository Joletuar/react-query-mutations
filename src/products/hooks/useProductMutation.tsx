import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, productActions } from '..';

export const useProductMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: productActions.createProduct, // funcion que se va a utilizar para hacer la mutacion

    onMutate: async (newProduct) => {
      // ----> Parte optimista

      // se ejecuta antes de que la mutacion se ejecute
      // se puede utilizar para optimizar la ui antes de que la mutacion se ejecute
      // por ejemplo, se puede actualizar la cache de productos con el nuevo producto

      console.log('Product mutation started');

      // Optimistic product
      const optimisticProduct: Product = {
        ...newProduct,
        id: Math.random(),
      };

      // seteamos la cache de productos con los valores anteriores mas el nuevo producto
      queryClient.setQueryData<Product[]>(
        ['products', { filterKey: newProduct.category }],
        (old) => (old ? [...old, optimisticProduct] : [optimisticProduct])
      );

      // se puede retornar cualquier valor que se quiera utilizar en el onError o onSuccess
      return { optimisticProduct };
    },

    onSuccess: (data, variables, context) => {
      // se ejecuta cuando la mutacion se ha completado con exito

      /**
       * data: es el valor retornado por la mutacion
       * variables: son las variables que se pasaron a la mutacion, esto casi nunca se utiliza
       * context: es el valor retornado en el onMutate
       */

      console.log('Product created');
      console.log({ data, variables, context });

      // ----> Parte invalidacion de cache

      // invalidamos la cache de productos para que se vuelva a hacer la peticion y se actualice la lista
      // queryClient.invalidateQueries({
      //     queryKey: ['products', { filterKey: data.category }],
      // });

      // ----> Parte optimista

      // removemos el producto optimista de la cache de product

      queryClient.removeQueries({
        queryKey: ['product', context?.optimisticProduct.id],
      });

      // se puede utilizar el valor retornado en el onMutate
      // seteamos la cache de productos con los valores anteriores mas el nuevo producto
      // esto nos permite reflejar en la ui de forma inmediata el nuevo producto
      // quitamos el producto optimista de la cache y lo reemplazamos por el producto real

      queryClient.setQueryData<Product[]>(
        ['products', { filterKey: data.category }],
        (old) =>
          old
            ? old.map((cacheProduct) =>
                cacheProduct.id === context.optimisticProduct.id
                  ? data
                  : cacheProduct
              )
            : [data]
      );
    },
    onError: (error, variables, context) => {
      // se ejecuta cuando la mutacion se ha completado con error
      console.log('Product error', error);

      // ----> Parte optimista

      // realizamos el rollback
      // eliminamos el producto optimista de la cache de productos

      queryClient.removeQueries({
        queryKey: ['product', context?.optimisticProduct.id],
      });

      queryClient.setQueryData<Product[]>(
        ['products', { filterKey: context?.optimisticProduct.category }],
        (old) =>
          old
            ? old.filter(
                (cacheProduct) =>
                  cacheProduct.id !== context?.optimisticProduct.id
              )
            : undefined
      );

      queryClient.invalidateQueries({
        queryKey: [
          'products',
          { filterKey: context?.optimisticProduct.category },
        ],
      });
    },
    onSettled: () => {
      // se ejecuta cuando la mutacion se ha completado (ya sea con exito o con error)
      console.log('Product mutation settled');
    },
  });

  return mutation;
};
