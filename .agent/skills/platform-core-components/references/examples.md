# Platform-Core Components Reference Examples

This reference manual provides copy-pasteable patterns, typings, and guidelines for `@platform-core/components` and `@platform-core/hooks`. Follow these exact specifications when writing or refactoring code.

---

## 📊 1. DataTable Composition

The `DataTable` component from `@platform-core/components` handles pagination, row selection, row actions, expanding rows, and sorting.

### Standard Column Creation Helpers
- `createSelectionColumn<T>()`: Inserts a selection checkbox column.
- `createExpanderColumn<T>()`: Inserts an expandable row trigger column.
- `createRowActionsColumn<T>({ renderActions })`: Inserts a column for actions (edit, delete, etc.) on each row.

### Example Code: Full Query-bound DataTable
```tsx
import type { ColumnDef } from '@tanstack/react-table';

interface CourseRow {
  id: number;
  title: string;
  order: number;
  wordCount: number;
}

const CourseTableSection = () => {
  const { t } = useTranslation();
  
  // Data Query
  const coursesQuery = useCoursesQuery({ take: 20 });
  const data = coursesQuery.data?.data ?? [];

  // Column Definitions
  const columns = useMemo((): ColumnDef<CourseRow>[] => [
    createSelectionColumn<CourseRow>(),
    {
      accessorKey: 'title',
      header: t('course_title', 'Title'),
      cell: ({ row }) => <span className="font-semibold">{row.original.title}</span>
    },
    {
      accessorKey: 'wordCount',
      header: t('course_words', 'Words Count'),
      cell: ({ row }) => <span>{row.original.wordCount}</span>
    },
    createRowActionsColumn<CourseRow>({
      renderActions: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original)}>
            <Icons.Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(row.original)}>
            <Icons.Trash className="h-4 w-4" />
          </Button>
        </div>
      )
    })
  ], [t]);

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={coursesQuery.isLoading}
      pageSize={10}
      searchPlaceholder="Tìm kiếm khóa học..."
    />
  );
};
```

---

## 📝 2. Form Components & Validation Wrappers

The core `@platform-core/components` library provides a high-level, unified `<Form>` wrapper around `react-hook-form` along with 10 custom-wrapped field components. These components eliminate form boilerplate, unify validation rules, enforce accessible markup, and guarantee layout consistency.

### 2.1 The Form Core Container (`<Form>`)

This is the state and layout container. It initializes `react-hook-form` internally using an optional Zod schema or raw validation rules and runs standard submit handlers.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `schema` | `z.ZodSchema<any>` | - | (Optional) Zod schema used to perform automatic client-side schema validation. |
| `onSubmit` | `(values: T) => void \| Promise<void>` | - | Callback fired on successful validation check during submit. |
| `defaultValues` | `Partial<T>` | `{}` | Initial state structure for form fields. |
| `className` | `string` | `''` | Class names for the native `<form>` wrapper element. |
| `children` | `(helpers: { control: Control<T>; formState: FormState<T>; ... }) => ReactNode` | - | Render prop containing RHF helpers to display field inputs. |

---

### 2.2 Shared Inputs API & Usage Examples

All Form wrappers inherit base attributes from `FormControlProps`:
- **`control`**: RHF controller object (required).
- **`name`**: Field data key path (required).
- **`label`**: Optional label string or component. Renders with an asterisk `*` automatically if the field is marked `required`.
- **`description`**: Optional descriptive text displayed next to or below the field.
- **`rules`**: Standard `react-hook-form` validation rules (`required`, `min`, `max`, `pattern`).

---

#### 1. `<FormInput>` (Text, Email, Phone, Password fields)
Unifies standard text, email, phone, and password inputs.
- **Automatic Password Eye**: When `htmlType="password"`, it renders a toggle button containing `Icons.Eye`/`Icons.EyeOff` to reveal/hide characters automatically.
- **Regex Validations**: Automatically registers Vietnamese phone format and standard email format matching constraints if `htmlType="tel"` or `htmlType="email"` are passed and no custom patterns are provided.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `htmlType` | `'text' \| 'password' \| 'email' \| 'tel' \| 'url'` | `'text'` | Renders standard HTML input layouts. |
| `leftIcon` | `ReactNode` | - | Prefix icon rendered inside the input field. |
| `rightIcon` | `ReactNode` | - | Suffix icon rendered inside the input field. |
| `placeholder` | `string` | - | Standard placeholder. |
| `disabled` | `boolean` | `false` | Disables interaction. |
| `autoComplete` | `string` | - | Auto-complete attribute helper. |
| `inputClassName` | `string` | `''` | Direct class overrides for the `<input>` element. |

```tsx
// Example Usage
<FormInput
  control={control}
  name="email"
  label="Email đăng nhập"
  htmlType="email"
  placeholder="example@domain.com"
  leftIcon={<Icons.Mail className="h-4 w-4" />}
  rules={{ required: 'Email là bắt buộc' }}
/>

<FormInput
  control={control}
  name="password"
  label="Mật khẩu"
  htmlType="password"
  placeholder="Nhập mật khẩu của bạn..."
  leftIcon={<Icons.Lock className="h-4 w-4" />}
  rules={{ 
    required: 'Mật khẩu là bắt buộc',
    minLength: { value: 6, message: 'Mật khẩu phải từ 6 ký tự' }
  }}
/>
```

---

#### 2. `<FormTextarea>` (Multiline Text Block)
Renders a custom styled multiline text input box.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `disabled` | `boolean` | `false` | Disables input. |
| `placeholder` | `string` | - | Textarea placeholder text. |

```tsx
// Example Usage
<FormTextarea
  control={control}
  name="description"
  label="Mô tả khóa học"
  placeholder="Nhập thông tin chi tiết về nội dung khóa học..."
  rules={{ maxLength: { value: 500, message: 'Mô tả tối đa 500 ký tự' } }}
/>
```

---

#### 3. `<FormCheckbox>` (Single Boolean Toggle)
Renders a standard checkbox bound to boolean values. Sets `horizontal={true}` and `controlFirst={true}` automatically to guarantee modern inline layout.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `disabled` | `boolean` | `false` | Disables interaction. |

```tsx
// Example Usage
<FormCheckbox
  control={control}
  name="isActive"
  label="Kích hoạt khóa học"
  description="Cho phép học viên truy cập bài học ngay lập tức"
/>
```

---

#### 4. `<FormSimpleSelect>` (Simple dropdown with inline children)
A standard, direct HTML select replacement designed to render small lists using React children.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode` | - | Render option structures (e.g. `<SelectItem>`). |

```tsx
// Example Usage
<FormSimpleSelect
  control={control}
  name="status"
  label="Trạng thái"
  rules={{ required: true }}
>
  <SelectItem value="draft">Bản nháp</SelectItem>
  <SelectItem value="published">Đã xuất bản</SelectItem>
  <SelectItem value="archived">Lưu trữ</SelectItem>
</FormSimpleSelect>
```

---

#### 5. `<FormSelect>` (Dynamic Advanced Single & Multi-Select)
An advanced custom select field wrapping the standard popover-based `Select` component. Supports single selection and multi-selection automatically.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `options` | `BaseSelectOption<T>[]` | `[]` | List of selection items containing `{ value, label }`. |
| `isMulti` | `boolean` | `false` | Toggle between single select and multi-select. |
| `isClearable` | `boolean` | `true` | Show clear button. |
| `isSearchable` | `boolean` | `true` | Enable keyword searching. |
| `isLoading` | `boolean` | `false` | Displays a loading spinner inside the dropdown. |
| `onChange` | `(val: T \| T[] \| null) => void` | - | Optional raw state change interceptor. |

```tsx
// Example Usage: Single Select
<FormSelect
  control={control}
  name="level"
  label="Trình độ học"
  options={[
    { value: 'A1', label: 'A1 - Sơ cấp' },
    { value: 'B2', label: 'B2 - Trung cấp' },
    { value: 'C1', label: 'C1 - Cao cấp' }
  ]}
  isClearable={false}
  rules={{ required: 'Vui lòng chọn trình độ' }}
/>

// Example Usage: Multi Select Mode
<FormSelect
  control={control}
  name="tags"
  label="Danh mục liên quan"
  isMulti={true}
  options={[
    { value: 'vocab', label: 'Từ vựng' },
    { value: 'grammar', label: 'Ngữ pháp' },
    { value: 'listening', label: 'Luyện nghe' }
  ]}
  placeholder="Chọn danh mục..."
/>
```

---

#### 6. `<FormMultiSelect>` (Standard Popover Multi-Select)
Renders a pure tag-based multiselect box using native checkboxes inside a popover panel.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `options` | `BaseSelectOption[]` | `[]` | Array of selection options `{ value, label }`. |
| `placeholder` | `string` | `'Chọn...'` | Input placeholder. |
| `showSelectAll` | `boolean` | `false` | Show button to check all options. |
| `maxTagCount` | `number \| 'responsive'` | `'responsive'` | Maximum tags visible inside trigger box. |

```tsx
// Example Usage
<FormMultiSelect
  control={control}
  name="targetUsers"
  label="Đối tượng học viên"
  options={[
    { value: 'student', label: 'Học sinh - Sinh viên' },
    { value: 'worker', label: 'Người đi làm' },
    { value: 'kid', label: 'Trẻ em' }
  ]}
  showSelectAll={true}
  placeholder="Chọn đối tượng..."
/>
```

---

#### 7. `<FormDatePicker>` (Comprehensive Calendar & Time Selectors)
Provides dynamic single date selection, date-time picking, month selection, and range selection.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `isRangePicker` | `boolean` | `false` | Enable range-picking mode (returns `[Date, Date]`). |
| `pickerType` | `'date' \| 'time' \| 'datetime' \| 'month' \| 'year'` | `'date'` | Selects date-granularity. |
| `dateFormat` | `string` | - | Custom string formatting (e.g. `'yyyy-MM-dd'`). |
| `showTime` | `boolean \| TimeConfig` | `false` | Enable time picker or set customized steps. |
| `disabled` | `boolean` | `false` | Disables picker trigger. |
| `allowClear` | `boolean` | `false` | Enable clearing the date selection. |
| `disabledDate` | `(date: Date) => boolean` | - | Function to disable custom dates (e.g., block past dates). |
| `onChangeDate` | `(date, dateStr) => void` | - | Callback on date selection change. |
| `onChangeRange` | `(dates, dateStrs) => void` | - | Callback on range selection changes. |

```tsx
// Example Usage: Single Date Picker
<FormDatePicker
  control={control}
  name="releaseDate"
  label="Ngày phát hành"
  placeholder="Chọn ngày phát hành..."
  allowClear={true}
  rules={{ required: 'Ngày phát hành là bắt buộc' }}
/>

// Example Usage: DateTime Selector with custom disabling logic (Block past dates)
<FormDatePicker
  control={control}
  name="examTime"
  label="Thời gian thi thử"
  pickerType="datetime"
  showTime={true}
  dateFormat="dd/MM/yyyy HH:mm"
  disabledDate={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
/>

// Example Usage: Date Range Selector
<FormDatePicker
  control={control}
  name="enrollmentPeriod"
  label="Thời hạn đăng ký học"
  isRangePicker={true}
  placeholder="Ngày bắt đầu ~ Ngày kết thúc"
  rules={{ required: 'Vui lòng chọn thời gian tuyển sinh' }}
/>
```

---

#### 8. `<FormNumberInput>` (Formatted Numeric Input with Stepper Controls)
Calculates and formats numeric values beautifully. Features auto-validation against numeric boundaries.
- **Increment/Decrement buttons**: Automatic step increments using physical buttons.
- **Thousand separation & Decimal scale**: Real-time mask formats for costs, percentages, or order fields.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `stepper` | `number` | `1` | Increment step size. |
| `minValue` | `number` | `Number.NEGATIVE_INFINITY` | Lower limit boundary. |
| `maxValue` | `number` | `Number.POSITIVE_INFINITY` | Upper limit boundary. |
| `thousandSeparator` | `string` | - | Separator character (e.g. `','` or `'.'`). |
| `prefix` | `string` | - | Preceding character string (e.g., `'$'` or `'đ'`). |
| `suffix` | `string` | - | Appending character string (e.g., `'%'` or `' từ'`). |
| `decimalScale` | `number` | `0` | Quantity of decimal places allowed. |
| `fixedDecimalScale` | `boolean` | `false` | Pads decimal values with zeroes. |
| `onChange` | `(val: number \| undefined) => void` | - | Numeric state change interceptor. |

```tsx
// Example Usage: Simple Integer Stepper
<FormNumberInput
  control={control}
  name="order"
  label="Thứ tự hiển thị"
  stepper={1}
  minValue={1}
  maxValue={100}
  rules={{ required: true }}
/>

// Example Usage: Cost Input with Currency Formatting
<FormNumberInput
  control={control}
  name="price"
  label="Học phí khóa học"
  thousandSeparator=","
  suffix=" VND"
  minValue={0}
  placeholder="Ví dụ: 500,000"
  rules={{ required: 'Vui lòng nhập học phí' }}
/>
```

---

#### 9. `<FormRadioGroup>` (Dynamic Radio Selection List)
Renders a neat list of radio options supporting small/medium/large sizes and custom styling variants.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `options` | `RadioOption[]` | `[]` | Array of options containing `{ value, label, disabled }`. |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Sizing scale classes. |
| `autoHeightMax` | `number` | - | Sets a max-height (in pixels) and enables scroll on overflow. |
| `showEmpty` | `boolean` | `false` | Renders a reset options trigger. |
| `disabled` | `boolean` | `false` | Global disable state. |

```tsx
// Example Usage
<FormRadioGroup
  control={control}
  name="gender"
  label="Giới tính"
  options={[
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' }
  ]}
  rules={{ required: 'Vui lòng chọn giới tính' }}
/>
```

---

#### 10. `<FormFileUpload>` (Avatar & Standard Drag & Drop File Uploads)
Provides single/multiple file selections, drag-and-drop zones, local state management, or immediate cloud uploads (automatic S3/image-host integrations with automatic progress trackers).

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'default' \| 'avatar'` | `'default'` | `'avatar'` renders a circular profile uploader. |
| `maxFiles` | `number` | `1` | Max count of files. Emits a single item instead of an array if set to `1`. |
| `maxSize` | `number` | `5242880` (5MB) | Size boundary in bytes. Blocks files exceeding this limit. |
| `accept` | `string` | `'image/*'` | Filter MIME types (e.g. `'image/*', '.pdf'`). |
| `autoUpload` | `boolean` | `false` | Enable immediate upload mode. |
| `uploadFile` | `(file: File) => Promise<string>` | - | **(Required if autoUpload: true)** Upload handler. Returns remote URL. |

```tsx
// Example Usage: Circular Avatar with Immediate Cloud Upload
<FormFileUpload
  control={control}
  name="avatarUrl"
  label="Ảnh đại diện"
  variant="avatar"
  accept="image/png, image/jpeg"
  maxSize={2 * 1024 * 1024} // 2MB
  autoUpload={true}
  uploadFile={async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await uploadImageMutation.mutateAsync(formData);
    return response.url; // Returns cloud public URL
  }}
/>

// Example Usage: Multiple Attachments Drag & Drop (Manual Submit Upload)
<FormFileUpload
  control={control}
  name="attachments"
  label="Tài liệu đính kèm"
  variant="default"
  accept=".pdf,.docx,.xlsx"
  maxFiles={5}
  maxSize={10 * 1024 * 1024} // 10MB
  autoUpload={false} // files remain File[] inside react-hook-form
/>
```

---

### 2.3 Example Code: Comprehensive Multi-Field Course Creation Form

Here is a fully integrated form combining our container, custom schemas, and the rich control set in a single clean layout.

```tsx
import { z } from 'zod';

// 1. Zod Validation Schema
const courseSchema = z.object({
  title: z.string().min(1, 'Vui lòng nhập tiêu đề khóa học'),
  description: z.string().min(10, 'Mô tả khóa học tối thiểu phải có 10 ký tự'),
  price: z.number().min(0, 'Học phí không được phép âm'),
  level: z.string().min(1, 'Vui lòng chọn trình độ'),
  tags: z.array(z.string()).min(1, 'Chọn ít nhất 1 danh mục'),
  startDate: z.date({ required_error: 'Vui lòng chọn ngày bắt đầu' }),
  isHot: z.boolean(),
  status: z.string().min(1, 'Vui lòng chọn trạng thái'),
  thumbnailUrl: z.string().min(1, 'Vui lòng tải lên ảnh thu nhỏ (thumbnail)')
});

type CourseFormValues = z.infer<typeof courseSchema>;

// 2. Form Component Composition
const CreateCourseForm: FC<{
  onSubmit: (values: CourseFormValues) => Promise<void>;
  isSubmitting?: boolean;
}> = ({ onSubmit, isSubmitting = false }) => {
  const { t } = useTranslation();

  return (
    <Form
      schema={courseSchema}
      onSubmit={onSubmit}
      defaultValues={{
        title: '',
        description: '',
        price: 0,
        level: '',
        tags: [],
        startDate: undefined,
        isHot: false,
        status: 'draft',
        thumbnailUrl: ''
      }}
      className="space-y-6 max-w-2xl mx-auto bg-card p-6 rounded-xl border border-border shadow-sm"
    >
      {({ control }) => (
        <>
          <h2 className="text-xl font-bold mb-4">{t('course_create_title', 'Tạo khóa học mới')}</h2>

          {/* Profile Image / Thumbnail Selector */}
          <FormFileUpload
            control={control}
            name="thumbnailUrl"
            label="Ảnh bìa khóa học (Thumbnail)"
            variant="avatar"
            accept="image/webp, image/png, image/jpeg"
            autoUpload={true}
            uploadFile={async (file) => {
              // Simulated cloud image uploading service
              const res = await mockUploadImage(file);
              return res.url;
            }}
          />

          {/* Title - Text Input */}
          <FormInput
            control={control}
            name="title"
            label="Tiêu đề khóa học"
            placeholder="Ví dụ: Luyện nghe tiếng Anh nâng cao"
            leftIcon={<Icons.Sparkles className="h-4 w-4 text-primary" />}
          />

          {/* Description - Textarea */}
          <FormTextarea
            control={control}
            name="description"
            label="Mô tả tóm tắt"
            placeholder="Tóm tắt ngắn gọn nội dung và lợi ích khóa học mang lại..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price - Formatted Currency Input */}
            <FormNumberInput
              control={control}
              name="price"
              label="Học phí khóa học"
              thousandSeparator=","
              suffix=" VND"
              minValue={0}
              placeholder="0"
            />

            {/* Start Date - Calendar Picker */}
            <FormDatePicker
              control={control}
              name="startDate"
              label="Ngày khai giảng dự kiến"
              placeholder="Chọn ngày..."
              allowClear={true}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Level - Dropdown Select */}
            <FormSelect
              control={control}
              name="level"
              label="Trình độ yêu cầu"
              options={[
                { value: 'beginner', label: 'Cơ bản (A1 - A2)' },
                { value: 'intermediate', label: 'Trung cấp (B1 - B2)' },
                { value: 'advanced', label: 'Cao cấp (C1 - C2)' }
              ]}
              isClearable={false}
            />

            {/* Status - Simple Select Replacement */}
            <FormSimpleSelect
              control={control}
              name="status"
              label="Trạng thái xuất bản"
            >
              <SelectItem value="draft">Lưu nháp</SelectItem>
              <SelectItem value="published">Công khai</SelectItem>
              <SelectItem value="hidden">Ẩn</SelectItem>
            </FormSimpleSelect>
          </div>

          {/* Tags - Multi-Select Tag List */}
          <FormMultiSelect
            control={control}
            name="tags"
            label="Chủ đề bài học"
            options={[
              { value: 'ielts', label: 'Luyện thi IELTS' },
              { value: 'toeic', label: 'Luyện thi TOEIC' },
              { value: 'communication', label: 'Tiếng Anh giao tiếp' },
              { value: 'business', label: 'Tiếng Anh thương mại' }
            ]}
            showSelectAll={true}
            placeholder="Lọc chủ đề chính..."
          />

          {/* Hot Course - Inline Toggle Box */}
          <FormCheckbox
            control={control}
            name="isHot"
            label="Khóa học nổi bật (Hot Course)"
            description="Ghim khóa học này lên vị trí đầu tiên của trang chủ"
          />

          {/* Form Action Controls */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-32">
              {isSubmitting ? (
                <>
                  <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                'Tạo khóa học'
              )}
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};
```

---


---

## 🔍 3. Direct Select & MultiSelect Integration

When using dropdown selections outside of form contexts, use the custom `Select` and `MultiSelect` wrappers.

```tsx
// Single Selection Example
<Select
  value={level}
  onChange={val => val && setLevel(val)}
  options={[
    { value: 'all', label: 'Tất cả' },
    { value: 'A1', label: 'Sơ cấp (A1)' },
    { value: 'B2', label: 'Trung cấp (B2)' }
  ]}
  isClearable={false}
  isSearchable={false}
  className="w-full sm:w-40"
/>

// Multiple Selection Example
<MultiSelect
  value={selectedLevels}
  onChange={setSelectedLevels}
  options={[
    { value: 'A1', label: 'A1' },
    { value: 'A2', label: 'A2' },
    { value: 'B1', label: 'B1' }
  ]}
  placeholder="Lọc trình độ..."
/>
```

---

## 🎨 4. Global Icons Registry

Never import directly from `'lucide-react'`. Always use the `Icons` wrapper which has standard sizes and styling via className.

```tsx
// Standard Icons
<Icons.Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
<Icons.ArrowLeft className="mr-2 h-4 w-4" />
<Icons.Search className="h-4 w-4 text-muted-foreground" />

// Loaders
<Icons.Loader2 className="h-4 w-4 animate-spin" />
<Icons.LoaderCircleIcon className="h-6 w-6 animate-spin text-primary" />
```

---

## 🔐 5. Modals & `useModalState` Data Binding

Manage all modal lifecycle states using `useModalState` from `@platform-core/hooks` in combination with `ConfirmModal` or `Modal`.

```tsx
const CourseManagementSection = () => {
  const { t } = useTranslation();
  
  // Bind standard or edit word context data to the modal
  const editModal = useModalState<number>();
  const deleteModal = useModalState<{ id: number; title: string }>();

  return (
    <div>
      <Button onClick={() => editModal.openModal(104)}>
        Edit Course #104
      </Button>
      
      <Button onClick={() => deleteModal.openModal({ id: 104, title: 'English 101' })}>
        Delete Course
      </Button>

      {/* Modal with Data Binding */}
      <Modal open={editModal.isOpen} onOpenChange={editModal.closeModal}>
        <div className="p-6">
          <h2 className="text-lg font-bold mb-4">Edit Course ID: {editModal.data}</h2>
          {/* Form here */}
        </div>
      </Modal>

      {/* Confirm Modal */}
      <ConfirmModal
        open={deleteModal.isOpen}
        title={t('confirm_delete_title', 'Delete Course?')}
        description={`Are you sure you want to delete "${deleteModal.data?.title}"?`}
        confirmText={t('action_delete', 'Delete')}
        variant="destructive"
        onCancel={deleteModal.closeModal}
        onConfirm={async () => {
          if (deleteModal.data) {
            await deleteMutation.mutateAsync(deleteModal.data.id);
            deleteModal.closeModal();
          }
        }}
      />
    </div>
  );
};
```
