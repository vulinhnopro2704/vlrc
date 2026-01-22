import { FormFileUpload } from '@/components/Form';

const HomePage = () => {
  const form = useForm();

  return (
    <div className='space-y-4 p-4'>
      <Form {...form}>
        <FormFileUpload
          control={form.control}
          name='file'
          label='Upload File'
          description='Chọn một file để tải lên'
        />
      </Form>
    </div>
  );
};

export default HomePage;
