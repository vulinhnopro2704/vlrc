# Form Primitives & Shadcn Form Item Wrappers

The `@platform-core/components` package provides form integration built on top of **Shadcn UI Form** (which is just `react-hook-form`'s `FormProvider`) combined with custom-wrapped field components. No Zod schema validation is used — all validation runs through RHF's `rules` prop on each field.

---

## 🏗 1. The `<Form>` Component = `FormProvider`

The `<Form>` component exported from this package is literally **`FormProvider`** from `react-hook-form`. It provides form context to all child components.

### Usage Pattern
```tsx
// 1. Call useForm() to get the form object
const form = useForm<MyFormType>({
  defaultValues: { name: '', email: '' }
});

// 2. Spread the form object into <Form>
// 3. Wrap a native <form> with handleSubmit
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormInput control={form.control} name="name" label="Họ tên" rules={{ required: true }} />
    <FormInput control={form.control} name="email" label="Email" htmlType="email" />
    <Button type="submit">Lưu</Button>
  </form>
</Form>
```

> [!IMPORTANT]
> - **`Form` = `FormProvider`**. You spread the `useForm()` return value into it: `<Form {...form}>`.
> - **No Zod validation**. All validation is done via `rules` prop on each field (standard RHF `RegisterOptions`).
> - **`control` comes from `useForm()`** or `useFormContext()` when splitting into child components.

---

## 📝 2. Shadcn Form Item Internals

Shadcn provides these standard layout components that some of the custom wrappers use internally:

| Component | Role |
| :--- | :--- |
| `FormField` | RHF `<Controller>` + context provider for the field name. |
| `FormItem` | Layout container with `grid gap-2`. Generates a unique `id` for accessibility. |
| `FormLabel` | Auto-linked `<Label>` that turns red on validation errors via `data-error`. |
| `FormControl` | `<Slot>` that injects `id`, `aria-describedby`, and `aria-invalid` into the child input. |
| `FormDescription` | Gray helper text below the field. |
| `FormMessage` | Red error text that reads from the RHF field error state automatically. |

### When You Use Shadcn Primitives Directly
Some complex wrappers like `FormDatePicker` and `FormRadioGroup` use these Shadcn primitives directly:

```tsx
<FormField
  control={control}
  name={name}
  rules={rules}
  render={({ field }) => (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        {/* your custom input here */}
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### When You Use `FormBase` Instead
The simpler wrappers (`FormInput`, `FormTextarea`, `FormCheckbox`, `FormSimpleSelect`) use a custom `FormBase` component that wraps `<Controller>` with the `Field`/`FieldLabel`/`FieldError` layout system. It provides the same functionality but with extra features:
- Automatic `required` asterisk on labels
- Auto-validation patterns for `email` and `tel` input types
- Flexible `horizontal` and `controlFirst` layout options

---

## 🛠 3. Real-World Form Pattern (from the codebase)

This is the actual pattern used throughout the VLRC project:

```tsx
const CreateCourseModal = ({ id, open, onCancel }: App.ModalProps) => {
  const { t } = useTranslation();

  // 1. useForm — no Zod, just RHF with type
  const { control, handleSubmit, reset } = useForm<LearningManagement.Course>();

  const courseMutation = useCourseMutation({
    onSuccess: () => { reset(); onCancel(); }
  });

  const onSubmit = handleSubmit(data => {
    courseMutation.mutate({ id, payload: data });
  });

  return (
    <Modal open={open} onCancel={onCancel} onConfirm={onSubmit}>
      <form className="space-y-5">
        <FormInput
          control={control}
          name="title"
          label={t('create_course_title_label')}
          placeholder={t('create_course_title_placeholder')}
          rules={{ required: true }}
        />
        <FormInput
          control={control}
          name="enTitle"
          label={t('create_course_en_title_label')}
        />
        <FormTextarea
          control={control}
          name="description"
          label={t('create_course_description_label')}
        />
      </form>
    </Modal>
  );
};
```

### Splitting Into Child Components

When a form is large, split fields into child components. Use `useFormContext()` to access `control` without prop drilling:

```tsx
// Parent
const form = useForm<FormValues>({ defaultValues: { ... } });

return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <PersonalInfoFields />
      <AddressFields />
      <Button type="submit">Lưu</Button>
    </form>
  </Form>
);

// Child component (no need for control prop)
const PersonalInfoFields = () => {
  const { control } = useFormContext<FormValues>();
  return (
    <>
      <FormInput control={control} name="name" label="Họ tên" rules={{ required: true }} />
      <FormInput control={control} name="phone" label="SĐT" htmlType="tel" />
    </>
  );
};
```
