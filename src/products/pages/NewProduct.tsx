import { Button, Image, Input, Textarea } from '@nextui-org/react';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useProductMutation } from '..';

interface FormsInputs {
    title: string;
    price: number;
    image: string;
    description: string;
    category: string;
}

const defaultValues: FormsInputs = {
    title: '',
    price: 0,
    image: 'https://static.nationalgeographic.es/files/styles/image_3200/public/75552.ngsversion.1422285553360.jpg?w=1600&h=1067',
    description: '',
    category: "men's clothing",
};

export const NewProduct = () => {
    // const [tempImage, setTempImage] = useState<string>(
    //     'https://static.nationalgeographic.es/files/styles/image_3200/public/75552.ngsversion.1422285553360.jpg?w=1600&h=1067'
    // );

    const productMutation = useProductMutation();

    const {
        handleSubmit,
        control, // permite controlar el estado de los inputs personalizados a traves de react-hook-form
        watch, // permite ver el estado de un input en tiempo real
    } = useForm<FormsInputs>({
        defaultValues,
    });

    // esto esquivalente a un estado
    const newImage = watch('image'); // con esto podemos disparar un evento cada vez que el input image cambie

    // useEffect(() => {
    //     if (newImage) {
    //         setTempImage(newImage);
    //     }
    // }, [newImage]);

    const onSubmit: SubmitHandler<FormsInputs> = (data) => {
        console.log(data);

        productMutation.mutate(data);
    };

    return (
        <div className='w-full flex-col'>
            <h1 className='text-2xl font-bold'>Nuevo producto</h1>

            <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                <div className='flex justify-around items-center'>
                    <div className='flex-col w-[500px]'>
                        {/* Usar este componente es importante para que react-hook-form pueda controlar el estado de los inputs personalizados o de librerias de terceros como NextUI */}

                        <Controller
                            control={control}
                            name='title'
                            rules={{ required: 'Este campo es requerido' }}
                            // el render es para renderizar el campo que se quiere que este controloador tome el controle
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    className='mt-2'
                                    type='text'
                                    label='Titulo del producto'
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name='price'
                            rules={{ required: 'Este campo es requerido' }}
                            render={({ field }) => (
                                <Input
                                    value={field.value?.toString()}
                                    onChange={(e) =>
                                        field.onChange(parseInt(e.target.value))
                                    }
                                    className='mt-2'
                                    type='number'
                                    label='Precio del producto'
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name='image'
                            rules={{ required: 'Este campo es requerido' }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    className='mt-2'
                                    type='url   '
                                    label='image del producto'
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name='description'
                            rules={{ required: 'Este campo es requerido' }}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    className='mt-2'
                                    label='Descripcion del producto'
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name='category'
                            rules={{ required: 'Este campo es requerido' }}
                            render={({ field }) => (
                                <select
                                    value={field.value}
                                    onChange={field.onChange}
                                    className='rounded-md p-3 mt-2 bg-gray-800 w-full'
                                >
                                    <option value="men's clothing">
                                        Men's clothing
                                    </option>

                                    <option value="women's clothing">
                                        Women's clothing
                                    </option>

                                    <option value='jewelery'>Jewelery</option>

                                    <option value='electronics'>
                                        Electronics
                                    </option>
                                </select>
                            )}
                        />

                        <br />

                        <Button
                            className='mt-2'
                            color='primary'
                            type='submit'
                            isDisabled={productMutation.isPending}
                        >
                            {productMutation.isPending
                                ? 'Cargando...'
                                : 'Guardar'}
                        </Button>
                    </div>

                    <div
                        className='bg-white rounded-2xl p-10 flex items-center'
                        style={{
                            width: '500px',
                            height: '600px',
                        }}
                    >
                        <Image src={newImage} />
                    </div>
                </div>
            </form>
        </div>
    );
};
