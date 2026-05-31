# Form Primitives & Shadcn Form Item Wrappers

The `@platform-core/components` package provides a highly optimized, schema-driven `<Form>` container that bridges **react-hook-form** with **Shadcn UI** layout elements. It handles form state, layout orientation, automatic error rendering, accessibility attributes (`aria-invalid`), and Zod validation rules with minimal boilerplate.

---

## 🏗 1. The Core Form Container (`<Form>`)

The `<Form>` component initializes the React Hook Form context and wraps standard HTML `<form>` tags.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `schema` | `z.ZodSchema<any>` | - | **(Optional)** Zod schema used to perform automatic client-side schema validation. |
| `onSubmit` | `(values: T) => void \| Promise<void>` | - | Callback fired on successful validation check during submit. |
| `defaultValues` | `Partial<T>` | `{}` | Initial state structure for form fields. |
| `className` | `string` | `''` | Class names for the native `<form>` wrapper element. |
| `children` | `(helpers: { control: Control<T>; formState: FormState<T>; ... }) => ReactNode` | - | Render prop containing RHF helpers to display field inputs. |

---

## 📝 2. Inner Workings of the `FormItem` & `FormBase` Wrapper

Every form input field in `@platform-core/components` is wired up internally via `FormBase` which wraps the Shadcn-style **`FormItem`** structure. Here is how it operates:

1. **State Connection (`Controller`)**: Utilizes `react-hook-form`'s `<Controller>` to wire custom inputs to the context.
2. **Accessible Labels (`FieldLabel`)**: Automatically renders the `<FieldLabel>` tied directly to the input `id`. If a field has validation rules indicating it is `required`, a red asterisk `<span className="text-red-500">*</span>` is automatically appended to the label.
3. **Descriptions (`FieldDescription`)**: Binds an optional description string or node directly below/above the field.
4. **Error Handling (`FieldError`)**: Automatically hooks into the controller's `fieldState.error`. If `fieldState.invalid` is active, it renders the `<FieldError>` component with localized text without manual developer checks.
5. **Flexible Orientations**:
   - **Vertical (Default)**: Stacked label -> input -> error.
   - **Horizontal (`horizontal={true}`)**: Arranges the label and control element side-by-side using CSS grid/flex values.
   - **Control First (`controlFirst={true}`)**: Renders the input control *before* the label (perfect for checkboxes and radio options).

---

## 🛠 3. Zod & RHF Composition Example

This clean, copy-pasteable example demonstrates how to compose a customized form with custom validation constraints using a Zod schema.

```tsx
import { z } from 'zod';

// 1. Zod Schema Declaration (Strongly Typed Validation Rules)
const userProfileSchema = z.object({
  fullName: z.string().min(3, 'Tên phải chứa ít nhất 3 ký tự'),
  email: z.string().email('Địa chỉ email không hợp lệ'),
  bio: z.string().max(200, 'Giới thiệu bản thân tối đa 200 ký tự').optional()
});

type UserProfileValues = z.infer<typeof userProfileSchema>;

const UserProfileForm = () => {
  const { t } = useTranslation();

  const handleSave = async (values: UserProfileValues) => {
    // API request mutation triggered here
    await saveProfileMutation.mutateAsync(values);
  };

  return (
    <Form
      schema={userProfileSchema}
      onSubmit={handleSave}
      defaultValues={{
        fullName: '',
        email: '',
        bio: ''
      }}
      className="space-y-4 bg-card p-6 rounded-xl border border-border"
    >
      {({ control, formState }) => (
        <>
          {/* 1. FormInput (Leverages FormBase / FormItem under the hood) */}
          <FormInput
            control={control}
            name="fullName"
            label="Họ và tên"
            placeholder="Nhập đầy đủ họ tên..."
            leftIcon={<Icons.User className="h-4 w-4" />}
          />

          {/* 2. FormInput with automatic email validation checks */}
          <FormInput
            control={control}
            name="email"
            label="Email liên hệ"
            htmlType="email"
            placeholder="name@company.com"
            leftIcon={<Icons.Mail className="h-4 w-4" />}
          />

          {/* 3. FormTextarea for multiline details */}
          <FormTextarea
            control={control}
            name="bio"
            label="Giới thiệu bản thân"
            placeholder="Viết một vài dòng mô tả ngắn..."
          />

          {/* Action buttons with loading states */}
          <Button type="submit" disabled={formState.isSubmitting} className="w-full">
            {formState.isSubmitting ? (
              <>
                <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              'Lưu hồ sơ'
            )}
          </Button>
        </>
      )}
    </Form>
  );
};
```
